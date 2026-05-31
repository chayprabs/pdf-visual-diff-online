"""Non-functional: diff performance budget (PRD p95 20-page <= 12s)."""

import time
from pathlib import Path

import fitz
import pytest

from app.diff_engine import DiffConfig, compare_pdfs


@pytest.mark.slow
def test_twenty_page_diff_under_budget(tmp_path: Path):
    base = tmp_path / "base.pdf"
    cand = tmp_path / "cand.pdf"
    for path, suffix in ((base, "A"), (cand, "B")):
        doc = fitz.open()
        for i in range(20):
            page = doc.new_page()
            page.insert_text((72, 72), f"Page {i + 1} content {suffix}")
        doc.save(path)
        doc.close()

    config = DiffConfig(job_dir=tmp_path / "job", dpi=72, tolerance=20)
    start = time.perf_counter()
    result = compare_pdfs(base, cand, config)
    elapsed = time.perf_counter() - start
    assert len(result.pages) == 20
    assert elapsed < 12.0, f"20-page diff took {elapsed:.2f}s (budget 12s)"
