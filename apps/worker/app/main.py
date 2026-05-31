from __future__ import annotations

import os
import shutil
import tempfile
import time
import uuid
from pathlib import Path

import fitz
import pikepdf
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

from app.diff_engine import DiffConfig, cleanup_job, compare_pdfs
from app.models import DiffResult

app = FastAPI(title="PdfDiff Worker", version="1.0.0")

origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RETENTION_SECONDS = int(os.environ.get("ARTIFACT_TTL_SECONDS", "3600"))
MAX_UPLOAD_MB = int(os.environ.get("MAX_UPLOAD_MB", "50"))
JOBS_ROOT = Path(tempfile.gettempdir()) / "pdf-diff"


def _cleanup_stale_jobs() -> None:
    if not JOBS_ROOT.exists():
        return
    cutoff = time.time() - RETENTION_SECONDS
    for job_dir in JOBS_ROOT.iterdir():
        if job_dir.is_dir() and job_dir.stat().st_mtime < cutoff:
            shutil.rmtree(job_dir, ignore_errors=True)


@app.get("/health")
def health() -> dict[str, str]:
    _cleanup_stale_jobs()
    return {"status": "ok"}


def _save_upload(upload: UploadFile, dest: Path) -> None:
    size = 0
    max_bytes = MAX_UPLOAD_MB * 1024 * 1024
    with dest.open("wb") as f:
        while chunk := upload.file.read(1024 * 1024):
            size += len(chunk)
            if size > max_bytes:
                raise HTTPException(413, f"File exceeds {MAX_UPLOAD_MB}MB limit")
            f.write(chunk)


def _parse_opts(
    dpi: int | None,
    tolerance: int | None,
    threshold: float | None,
) -> DiffConfig:
    resolved_dpi = 150 if dpi is None else dpi
    resolved_tolerance = 12 if tolerance is None else tolerance
    if resolved_dpi < 36 or resolved_dpi > 600:
        raise HTTPException(422, "dpi must be between 36 and 600")
    if resolved_tolerance < 0 or resolved_tolerance > 100:
        raise HTTPException(422, "tolerance must be between 0 and 100")
    if threshold is not None and threshold < 0:
        raise HTTPException(422, "threshold must be non-negative")
    return DiffConfig(
        dpi=resolved_dpi,
        tolerance=resolved_tolerance,
        threshold=threshold,
    )


def _serialize_result(result: DiffResult, job_id: str) -> dict:
    data = result.model_dump(by_alias=True)
    for page in data.get("pages", []):
        for key, url_key in (
            ("maskPath", "maskUrl"),
            ("baselinePath", "baselineUrl"),
            ("candidatePath", "candidateUrl"),
        ):
            path_val = page.pop(key, None)
            if path_val:
                page[url_key] = f"/v1/artifacts/{job_id}/{Path(path_val).name}"
    bundle = data.pop("bundlePath", None)
    if bundle:
        data["bundleUrl"] = f"/v1/artifacts/{job_id}/{Path(bundle).name}"
    return data


def _open_compare(
    baseline_path: Path,
    candidate_path: Path,
    config: DiffConfig,
    job_id: str,
) -> JSONResponse:
    result = compare_pdfs(baseline_path, candidate_path, config)
    return JSONResponse(_serialize_result(result, job_id))


def _handle_compare(
    baseline: UploadFile,
    candidate: UploadFile,
    config: DiffConfig,
    error_label: str,
) -> JSONResponse:
    _cleanup_stale_jobs()
    job_id = uuid.uuid4().hex
    job_dir = JOBS_ROOT / job_id
    job_dir.mkdir(parents=True, exist_ok=True)
    baseline_path = job_dir / "baseline.pdf"
    candidate_path = job_dir / "candidate.pdf"
    try:
        _save_upload(baseline, baseline_path)
        _save_upload(candidate, candidate_path)
        config.job_dir = job_dir
        return _open_compare(baseline_path, candidate_path, config, job_id)
    except HTTPException:
        shutil.rmtree(job_dir, ignore_errors=True)
        raise
    except (fitz.FileDataError, pikepdf.PdfError, ValueError) as exc:
        shutil.rmtree(job_dir, ignore_errors=True)
        raise HTTPException(422, str(exc) or "Invalid or corrupt PDF") from exc
    except Exception as exc:
        shutil.rmtree(job_dir, ignore_errors=True)
        raise HTTPException(500, error_label) from exc


@app.post("/v1/diff")
async def diff_endpoint(
    baseline: UploadFile = File(...),
    candidate: UploadFile = File(...),
    dpi: int = Form(150),
    tolerance: int = Form(12),
    baseline_password: str = Form(""),
    candidate_password: str = Form(""),
):
    config = _parse_opts(dpi, tolerance, None)
    config.baseline_password = baseline_password or None
    config.candidate_password = candidate_password or None
    return _handle_compare(baseline, candidate, config, "Diff failed")


@app.post("/v1/assert")
async def assert_endpoint(
    baseline: UploadFile = File(...),
    candidate: UploadFile = File(...),
    dpi: int = Form(150),
    tolerance: int = Form(12),
    threshold: float = Form(0.5),
    baseline_password: str = Form(""),
    candidate_password: str = Form(""),
):
    config = _parse_opts(dpi, tolerance, threshold)
    config.baseline_password = baseline_password or None
    config.candidate_password = candidate_password or None
    return _handle_compare(baseline, candidate, config, "Assert diff failed")


@app.post("/v1/baselines")
async def save_baseline(
    baseline: UploadFile = File(...),
    repo: str = Form(...),
    branch: str = Form("main"),
):
    """Pro feature: persist baseline PDFs per repo/branch (requires BASELINES_DIR)."""
    baselines_dir = os.environ.get("BASELINES_DIR")
    if not baselines_dir:
        raise HTTPException(
            501,
            "Baseline storage not enabled. Set BASELINES_DIR on the worker to enable Pro baselines.",
        )
    safe_repo = "".join(c if c.isalnum() or c in "-_/" else "_" for c in repo)
    dest_dir = Path(baselines_dir) / safe_repo / branch
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / "baseline.pdf"
    _save_upload(baseline, dest)
    return {"saved": True, "path": str(dest)}


@app.get("/v1/baselines/{repo}/{branch}")
def get_baseline(repo: str, branch: str = "main"):
    baselines_dir = os.environ.get("BASELINES_DIR")
    if not baselines_dir:
        raise HTTPException(501, "Baseline storage not enabled")
    safe_repo = "".join(c if c.isalnum() or c in "-_/" else "_" for c in repo)
    path = Path(baselines_dir) / safe_repo / branch / "baseline.pdf"
    if not path.exists():
        raise HTTPException(404, "Baseline not found")
    return FileResponse(path, headers={"Cache-Control": "private, no-store"})


@app.get("/v1/artifacts/{job_id}/{filename}")
def get_artifact(job_id: str, filename: str):
    if ".." in job_id or ".." in filename:
        raise HTTPException(400, "Invalid path")
    path = JOBS_ROOT / job_id / filename
    if not path.exists():
        raise HTTPException(404, "Artifact not found")
    return FileResponse(
        path,
        headers={"Cache-Control": "private, no-store"},
    )
