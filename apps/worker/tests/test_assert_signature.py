"""Assert mode must fail when signatures differ even if pixels match."""

from pathlib import Path

from app.diff_engine import DiffConfig, compare_pdfs

ROOT = Path(__file__).resolve().parents[3]
SAMPLES = ROOT / "samples"


def test_assert_fails_on_signature_removal():
    config = DiffConfig(job_dir=SAMPLES / ".job-assert-sig", threshold=100.0)
    result = compare_pdfs(
        SAMPLES / "signed-baseline.pdf",
        SAMPLES / "signed-candidate-unsigned.pdf",
        config,
    )
    assert result.assertion is not None
    assert result.assertion.pass_ is False
    assert result.assertion.failureReason in ("structural", "structural_and_pixel")
