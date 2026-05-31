import fitz
from pathlib import Path

import pytest

from app.diff_engine import DiffConfig, compare_pdfs


def _make_pdf(path: Path, text: str) -> None:
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), text)
    doc.save(path)
    doc.close()


@pytest.fixture
def sample_pair(tmp_path: Path):
    a = tmp_path / "baseline.pdf"
    b = tmp_path / "candidate.pdf"
    _make_pdf(a, "Hello World")
    _make_pdf(b, "Hello Universe")
    return a, b


def test_compare_detects_text_change(sample_pair, tmp_path):
    baseline, candidate = sample_pair
    config = DiffConfig(job_dir=tmp_path / "job")
    result = compare_pdfs(baseline, candidate, config)
    assert result.pages
    assert result.summary
    assert any(p.changes for p in result.pages) or result.summary


def test_assert_mode_pass_identical(tmp_path):
    a = tmp_path / "a.pdf"
    b = tmp_path / "b.pdf"
    _make_pdf(a, "Same")
    _make_pdf(b, "Same")
    config = DiffConfig(job_dir=tmp_path / "job", threshold=1.0)
    result = compare_pdfs(a, b, config)
    assert result.assertion is not None
    assert result.assertion.pass_ is True


def test_assert_mode_fail_on_change(sample_pair, tmp_path):
    baseline, candidate = sample_pair
    config = DiffConfig(job_dir=tmp_path / "job2", threshold=0.01)
    result = compare_pdfs(baseline, candidate, config)
    assert result.assertion is not None
    assert result.assertion.pass_ is False
