from __future__ import annotations

import io
import json
import os
import shutil
import zipfile
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import fitz  # PyMuPDF
import numpy as np
import pikepdf
from PIL import Image

from app.models import (
    AssertionResult,
    DiffResult,
    PageChange,
    PageDiff,
    SignatureInfo,
)


@dataclass
class DiffConfig:
    dpi: int = 150
    tolerance: int = 12
    threshold: float | None = None
    job_dir: Path | None = None
    baseline_password: str | None = None
    candidate_password: str | None = None


def _render_page(doc: fitz.Document, page_num: int, dpi: int) -> Image.Image:
    page = doc[page_num]
    zoom = dpi / 72.0
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)


MAX_DIFF_SIDE_PX = int(os.environ.get("MAX_DIFF_SIDE_PX", "2400"))


def _downscale_for_diff(img: Image.Image, max_side: int = MAX_DIFF_SIDE_PX) -> Image.Image:
    if max(img.size) <= max_side:
        return img
    ratio = max_side / max(img.size)
    return img.resize(
        (int(img.width * ratio), int(img.height * ratio)),
        Image.Resampling.LANCZOS,
    )


def _pixel_diff_pct(
    img_a: Image.Image, img_b: Image.Image, tolerance: int
) -> tuple[float, Image.Image, list[tuple[float, float, float, float]], bool]:
    size_mismatch = img_a.size != img_b.size
    if size_mismatch:
        img_b = img_b.resize(img_a.size, Image.Resampling.LANCZOS)
    img_a = _downscale_for_diff(img_a)
    img_b = _downscale_for_diff(img_b)
    if img_b.size != img_a.size:
        img_b = img_b.resize(img_a.size, Image.Resampling.LANCZOS)
    a = np.array(img_a.convert("RGB"), dtype=np.int16)
    b = np.array(img_b.convert("RGB"), dtype=np.int16)
    channel_max = np.abs(a - b).max(axis=2)
    mask = channel_max > tolerance
    pct = float(mask.mean() * 100.0) if mask.size else 0.0
    mask_rgb = np.zeros((*mask.shape, 3), dtype=np.uint8)
    mask_rgb[mask] = [255, 0, 0]
    mask_img = Image.fromarray(mask_rgb)
    bboxes: list[tuple[float, float, float, float]] = []
    if mask.any():
        ys, xs = np.where(mask)
        bboxes.append(
            (float(xs.min()), float(ys.min()), float(xs.max()), float(ys.max()))
        )
    return pct, mask_img, bboxes, size_mismatch


def _bbox_to_pixels(
    bbox: tuple[float, float, float, float], dpi: int, kind: str
) -> tuple[float, float, float, float]:
    if kind == "image" or not any(bbox):
        return bbox
    scale = dpi / 72.0
    return (bbox[0] * scale, bbox[1] * scale, bbox[2] * scale, bbox[3] * scale)


def _normalize_page_changes(changes: list[PageChange], dpi: int) -> list[PageChange]:
    return [
        PageChange(
            kind=c.kind,
            bbox=_bbox_to_pixels(c.bbox, dpi, c.kind),
            description=c.description,
        )
        for c in changes
    ]


def _extract_text_blocks(doc: fitz.Document, page_num: int) -> list[dict[str, Any]]:
    page = doc[page_num]
    blocks = []
    for block in page.get_text("dict")["blocks"]:
        if block.get("type") != 0:
            continue
        for line in block.get("lines", []):
            for span in line.get("spans", []):
                text = span.get("text", "").strip()
                if not text:
                    continue
                bbox = span.get("bbox", (0, 0, 0, 0))
                blocks.append(
                    {
                        "text": text,
                        "bbox": tuple(bbox),
                        "page": page_num,
                    }
                )
    return blocks


def _text_diff(
    baseline_blocks: list[dict[str, Any]],
    candidate_blocks: list[dict[str, Any]],
    move_threshold: float = 8.0,
) -> list[PageChange]:
    changes: list[PageChange] = []
    used_c = set()

    def center(bbox: tuple[float, ...]) -> tuple[float, float]:
        return ((bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2)

    for bi, b in enumerate(baseline_blocks):
        best_j = None
        best_dist = move_threshold
        for j, c in enumerate(candidate_blocks):
            if j in used_c or c["text"] != b["text"]:
                continue
            dist = (
                (center(b["bbox"])[0] - center(c["bbox"])[0]) ** 2
                + (center(b["bbox"])[1] - center(c["bbox"])[1]) ** 2
            ) ** 0.5
            if dist < best_dist:
                best_dist = dist
                best_j = j
        if best_j is not None:
            used_c.add(best_j)
            c = candidate_blocks[best_j]
            if best_dist > 1.0:
                changes.append(
                    PageChange(
                        kind="text",
                        bbox=tuple(c["bbox"]),  # type: ignore[arg-type]
                        description=f'Moved text: "{b["text"][:40]}"',
                    )
                )
        else:
            changes.append(
                PageChange(
                    kind="text",
                    bbox=tuple(b["bbox"]),  # type: ignore[arg-type]
                    description=f'Removed text: "{b["text"][:40]}"',
                )
            )

    for j, c in enumerate(candidate_blocks):
        if j not in used_c:
            changes.append(
                PageChange(
                    kind="text",
                    bbox=tuple(c["bbox"]),  # type: ignore[arg-type]
                    description=f'Added text: "{c["text"][:40]}"',
                )
            )
    return changes


def _metadata_diff(
    meta_a: dict[str, Any], meta_b: dict[str, Any]
) -> dict[str, dict[str, Any]]:
    diff: dict[str, dict[str, Any]] = {}
    keys = set(meta_a) | set(meta_b)
    for k in keys:
        va, vb = meta_a.get(k), meta_b.get(k)
        if va != vb:
            diff[k] = {"before": va, "after": vb}
    return diff


def _get_xmp(path: Path, password: str | None = None) -> str | None:
    try:
        with pikepdf.open(path, password=password or "") as pdf:
            with pdf.open_metadata() as meta:
                return meta.dumps() if meta else None
    except Exception:
        return None


def _get_metadata(doc: fitz.Document, pdf_path: Path | None = None, password: str | None = None) -> dict[str, Any]:
    m = doc.metadata or {}
    result = {k: v for k, v in m.items() if v}
    if pdf_path:
        xmp = _get_xmp(pdf_path, password)
        if xmp:
            result["xmp"] = xmp[:2000]
    return result


def _image_xrefs(path: Path, password: str | None = None) -> set[str]:
    refs: set[str] = set()
    try:
        with pikepdf.open(path, password=password or "") as pdf:
            for i, page in enumerate(pdf.pages):
                resources = page.get("/Resources", {})
                xobj = resources.get("/XObject", {})
                if xobj:
                    for name, ref in xobj.items():
                        try:
                            subtype = str(ref.get("/Subtype", ""))
                            if subtype == "/Image":
                                refs.add(f"page{i + 1}:{name}")
                        except Exception:
                            continue
    except Exception:
        pass
    return refs


def _object_diff(
    path_a: Path,
    path_b: Path,
    pwd_a: str | None = None,
    pwd_b: str | None = None,
) -> dict[str, Any]:
    result: dict[str, Any] = {
        "annotations": [],
        "formFields": [],
        "attachments": [],
        "bookmarks": [],
        "signatures": [],
    }
    with pikepdf.open(path_a, password=pwd_a or "") as pa, pikepdf.open(path_b, password=pwd_b or "") as pb:
        names_a = {a.get("/T", str(i)): i for i, a in enumerate(pa.attachments)}
        names_b = {a.get("/T", str(i)): i for i, a in enumerate(pb.attachments)}
        for name in set(names_a) - set(names_b):
            result["attachments"].append({"change": "removed", "name": str(name)})
        for name in set(names_b) - set(names_a):
            result["attachments"].append({"change": "added", "name": str(name)})

        def bookmark_titles(pdf: pikepdf.Pdf) -> list[str]:
            titles: list[str] = []

            def walk(outline, depth=0):
                if outline is None:
                    return
                try:
                    for item in outline:
                        if "/Title" in item:
                            titles.append(str(item["/Title"]))
                        if "/First" in item:
                            walk(item["/First"])
                except Exception:
                    pass

            if pdf.open_outline():
                walk(pdf.open_outline().root)
            return titles

        ba, bb = bookmark_titles(pa), bookmark_titles(pb)
        if ba != bb:
            result["bookmarks"].append({"before": ba, "after": bb})

    doc_a, doc_b = fitz.open(path_a), fitz.open(path_b)
    if pwd_a:
        doc_a.authenticate(pwd_a)
    if pwd_b:
        doc_b.authenticate(pwd_b)
    try:
        for pn in range(min(len(doc_a), len(doc_b))):
            ann_a = doc_a[pn].annots()
            ann_b = doc_b[pn].annots()
            texts_a = [a.info.get("content", "") for a in ann_a] if ann_a else []
            texts_b = [a.info.get("content", "") for a in ann_b] if ann_b else []
            if texts_a != texts_b:
                result["annotations"].append(
                    {"page": pn + 1, "before": texts_a, "after": texts_b}
                )
        def widget_count(doc: fitz.Document) -> int:
            total = 0
            for pn in range(len(doc)):
                total += sum(1 for _ in doc[pn].widgets() or [])
            return total

        widgets_a = widget_count(doc_a)
        widgets_b = widget_count(doc_b)
        if widgets_a != widgets_b:
            result["formFields"].append(
                {"change": "count", "before": widgets_a, "after": widgets_b}
            )
    finally:
        doc_a.close()
        doc_b.close()
    return result


def _signature_info(path: Path, password: str | None = None) -> SignatureInfo:
    try:
        with pikepdf.open(path, password=password or "") as pdf:
            if "/AcroForm" not in pdf.Root:
                return SignatureInfo(present=False, details="No AcroForm")
            acro = pdf.Root.AcroForm
            if "/SigFlags" in acro and int(acro["/SigFlags"]) > 0:
                return SignatureInfo(present=True, valid=None, details="Signature flags set")
            for page in pdf.pages:
                annots = page.get("/Annots", [])
                if annots:
                    for ref in annots:
                        annot = ref
                        if str(annot.get("/Subtype", "")) == "/Sig":
                            return SignatureInfo(
                                present=True, valid=None, details="Signature annotation found"
                            )
    except Exception as exc:
        return SignatureInfo(present=False, details=str(exc))
    return SignatureInfo(present=False, details="No signature detected")


def _resource_diff(
    path_a: Path,
    path_b: Path,
    pwd_a: str | None = None,
    pwd_b: str | None = None,
) -> dict[str, Any]:
    fonts_a: set[str] = set()
    fonts_b: set[str] = set()
    for path, target, pwd in ((path_a, fonts_a, pwd_a), (path_b, fonts_b, pwd_b)):
        doc = fitz.open(path)
        if pwd:
            doc.authenticate(pwd)
        try:
            for i in range(len(doc)):
                for f in doc[i].get_fonts():
                    target.add(f[3] if len(f) > 3 else str(f))
        finally:
            doc.close()
    images_a = _image_xrefs(path_a, pwd_a)
    images_b = _image_xrefs(path_b, pwd_b)
    return {
        "fonts": {
            "added": sorted(fonts_b - fonts_a),
            "removed": sorted(fonts_a - fonts_b),
        },
        "images": {
            "added": sorted(images_b - images_a),
            "removed": sorted(images_a - images_b),
        },
    }


def _build_summary(pages: list[PageDiff], meta_diff: dict, sig: dict[str, SignatureInfo]) -> str:
    lines = []
    changed = [p for p in pages if p.pixelDiffPct > 0 or p.changes]
    if not changed:
        lines.append("No visual or structural differences detected.")
    else:
        lines.append(f"{len(changed)} page(s) have differences.")
        for p in changed:
            parts = []
            if p.pixelDiffPct > 0:
                parts.append(f"{p.pixelDiffPct:.2f}% pixel change")
            if p.changes:
                parts.append(f"{len(p.changes)} change(s)")
            lines.append(f"Page {p.page}: " + ", ".join(parts))
    if meta_diff:
        lines.append(f"Metadata: {len(meta_diff)} field(s) changed.")
    if sig["baseline"].present != sig["candidate"].present:
        if sig["baseline"].present and not sig["candidate"].present:
            lines.append("Warning: signature present in baseline but missing in candidate.")
        elif not sig["baseline"].present and sig["candidate"].present:
            lines.append("Signature added in candidate.")
    return " ".join(lines)


def _create_composite_pdf(job_dir: Path, mask_paths: list[Path], max_width: int = 800) -> Path:
    composite = job_dir / "composite.pdf"
    out = fitz.open()
    for mp in mask_paths:
        if not mp.exists():
            continue
        thumb = job_dir / f"thumb-{mp.stem}.jpg"
        img = Image.open(mp).convert("RGB")
        if img.width > max_width:
            ratio = max_width / img.width
            img = img.resize((max_width, int(img.height * ratio)), Image.Resampling.LANCZOS)
        img.save(thumb, "JPEG", quality=80, optimize=True)
        page = out.new_page(width=img.width, height=img.height)
        page.insert_image(page.rect, filename=thumb.as_posix())
    if len(out) == 0:
        out.new_page()
    out.save(composite, garbage=4, deflate=True)
    out.close()
    return composite


def _create_bundle(
    job_dir: Path,
    pages: list[PageDiff],
    result_dict: dict[str, Any],
    mask_paths: list[Path],
) -> Path:
    bundle = job_dir / "diff-bundle.zip"
    summary_html = job_dir / "summary.html"
    summary_html.write_text(
        f"<html><body><h1>PdfDiff Report</h1><pre>{result_dict.get('summary', '')}</pre></body></html>",
        encoding="utf-8",
    )
    composite = _create_composite_pdf(job_dir, mask_paths)
    with zipfile.ZipFile(bundle, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("summary.json", json.dumps(result_dict, indent=2, default=str))
        zf.write(summary_html, "summary.html")
        if composite.exists():
            zf.write(composite, "composite.pdf")
        for mp in mask_paths:
            if mp.exists():
                zf.write(mp, f"masks/{mp.name}")
    return bundle


def compare_pdfs(
    baseline_path: Path,
    candidate_path: Path,
    config: DiffConfig,
) -> DiffResult:
    job_dir = config.job_dir or Path(os.environ.get("JOB_DIR", "/tmp/pdf-diff-jobs")) / os.urandom(8).hex()
    job_dir = Path(job_dir)
    job_dir.mkdir(parents=True, exist_ok=True)

    doc_a = fitz.open(baseline_path)
    doc_b = fitz.open(candidate_path)
    if config.baseline_password:
        if not doc_a.authenticate(config.baseline_password):
            raise ValueError("Incorrect baseline PDF password")
    if config.candidate_password:
        if not doc_b.authenticate(config.candidate_password):
            raise ValueError("Incorrect candidate PDF password")
    page_count = max(len(doc_a), len(doc_b))
    pages: list[PageDiff] = []
    mask_paths: list[Path] = []
    all_text_changes: list[dict[str, Any]] = []

    try:
        for pn in range(page_count):
            page_num = pn + 1
            changes: list[PageChange] = []
            pixel_pct = 0.0
            mask_path: Path | None = None
            baseline_png: Path | None = None
            candidate_png: Path | None = None

            if pn < len(doc_a) and pn < len(doc_b):
                img_a = _render_page(doc_a, pn, config.dpi)
                img_b = _render_page(doc_b, pn, config.dpi)
                pixel_pct, mask_img, bboxes, size_mismatch = _pixel_diff_pct(
                    img_a, img_b, config.tolerance
                )
                if size_mismatch:
                    changes.append(
                        PageChange(
                            kind="image",
                            bbox=(0, 0, float(img_a.width), float(img_a.height)),
                            description="Page dimensions differ between baseline and candidate",
                        )
                    )
                mask_path = job_dir / f"mask-page-{page_num}.png"
                mask_img.save(mask_path)
                mask_paths.append(mask_path)
                baseline_png = job_dir / f"baseline-page-{page_num}.png"
                candidate_png = job_dir / f"candidate-page-{page_num}.png"
                img_a.save(baseline_png)
                img_b.save(candidate_png)
                for bb in bboxes:
                    if pixel_pct > 0:
                        changes.append(
                            PageChange(
                                kind="image",
                                bbox=bb,
                                description=f"Visual change ({pixel_pct:.2f}% pixels)",
                            )
                        )

                tb = _extract_text_blocks(doc_a, pn)
                tc = _extract_text_blocks(doc_b, pn)
                text_changes = _text_diff(tb, tc)
                changes.extend(text_changes)
                if text_changes:
                    all_text_changes.append(
                        {"page": page_num, "changes": [c.model_dump() for c in text_changes]}
                    )
            elif pn >= len(doc_a):
                changes.append(
                    PageChange(
                        kind="text",
                        bbox=(0, 0, 0, 0),
                        description="Page added in candidate",
                    )
                )
            else:
                changes.append(
                    PageChange(
                        kind="text",
                        bbox=(0, 0, 0, 0),
                        description="Page removed from candidate",
                    )
                )

            pages.append(
                PageDiff(
                    page=page_num,
                    pixelDiffPct=pixel_pct,
                    changes=_normalize_page_changes(changes, config.dpi),
                    maskPath=str(mask_path) if mask_path else None,
                    baselinePath=str(baseline_png) if baseline_png else None,
                    candidatePath=str(candidate_png) if candidate_png else None,
                )
            )

        meta_a = _get_metadata(doc_a, baseline_path, config.baseline_password)
        meta_b = _get_metadata(doc_b, candidate_path, config.candidate_password)
        meta_diff = _metadata_diff(meta_a, meta_b)
        obj_diff = _object_diff(
            baseline_path,
            candidate_path,
            config.baseline_password,
            config.candidate_password,
        )
        font_diff = _resource_diff(
            baseline_path,
            candidate_path,
            config.baseline_password,
            config.candidate_password,
        )
        sig = {
            "baseline": _signature_info(baseline_path, config.baseline_password),
            "candidate": _signature_info(candidate_path, config.candidate_password),
        }

        if meta_diff:
            for k in meta_diff:
                pages[0].changes.append(
                    PageChange(
                        kind="metadata",
                        bbox=(0, 0, 0, 0),
                        description=f"Metadata changed: {k}",
                    )
                )

        if sig["baseline"].present and not sig["candidate"].present:
            obj_diff.setdefault("signatures", []).append(
                {"change": "removed", "message": "Signature missing in candidate"}
            )

        summary = _build_summary(pages, meta_diff, sig)
        assertion = None
        if config.threshold is not None:
            observed = max((p.pixelDiffPct for p in pages), default=0.0)
            structural_change = any(p.changes for p in pages)
            page_count_mismatch = len(doc_a) != len(doc_b)
            pixel_ok = observed <= config.threshold
            passes = pixel_ok and not structural_change and not page_count_mismatch
            failure_reason = None
            if not passes:
                if page_count_mismatch:
                    failure_reason = "page_count_mismatch"
                elif structural_change and not pixel_ok:
                    failure_reason = "structural_and_pixel"
                elif structural_change:
                    failure_reason = "structural"
                else:
                    failure_reason = "pixel_threshold"
                if page_count_mismatch or structural_change:
                    observed = max(observed, 100.0) if observed == 0 else observed
            assertion = AssertionResult(
                pass_=passes,
                threshold=config.threshold,
                observed=observed,
                failureReason=failure_reason,
            )

        result = DiffResult(
            pages=pages,
            metadata=meta_b,
            metadataDiff=meta_diff or None,
            signatures=sig,
            textDiff=all_text_changes or None,
            objectDiff=obj_diff,
            fontDiff=font_diff,
            summary=summary,
            assertion=assertion,
        )

        result_dict = result.model_dump(by_alias=True)
        bundle = _create_bundle(job_dir, pages, result_dict, mask_paths)
        result.bundlePath = str(bundle)
        return result
    finally:
        doc_a.close()
        doc_b.close()


def cleanup_job(job_dir: Path) -> None:
    if job_dir.exists():
        shutil.rmtree(job_dir, ignore_errors=True)
