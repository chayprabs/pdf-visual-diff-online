"""Pixel diff stability across repeated renders."""

from pathlib import Path

import fitz

from app.diff_engine import DiffConfig, _pixel_diff_pct, _render_page


def _page_image(text: str) -> tuple[Path, Path]:
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), text)
    path = Path("/tmp") / f"stab-{hash(text)}.pdf"
    doc.save(path)
    doc.close()
    doc = fitz.open(path)
    img = _render_page(doc, 0, 150)
    doc.close()
    return img, img


def test_identical_renders_zero_diff():
    img_a, img_b = _page_image("Stability test content")
    pct1, _, _, _ = _pixel_diff_pct(img_a, img_b, 12)
    pct2, _, _, _ = _pixel_diff_pct(img_a, img_b, 12)
    assert pct1 == pct2 == 0.0


def test_tolerance_reduces_noise():
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), "Tolerance test")
    path = Path("/tmp/tol-test.pdf")
    doc.save(path)
    doc.close()
    doc = fitz.open(path)
    a = _render_page(doc, 0, 72)
    b = _render_page(doc, 0, 150)
    doc.close()
    strict, _, _, _ = _pixel_diff_pct(a, b, 0)
    loose, _, _, _ = _pixel_diff_pct(a, b, 50)
    assert loose <= strict
