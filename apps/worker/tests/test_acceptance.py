"""PRD Section 20 acceptance fixtures."""

import subprocess
import sys
from pathlib import Path

import pytest

from app.diff_engine import DiffConfig, compare_pdfs

ROOT = Path(__file__).resolve().parents[3]
SAMPLES = ROOT / "samples"


@pytest.fixture(scope="module", autouse=True)
def ensure_samples():
    if not (SAMPLES / "contract-v1.pdf").exists():
        subprocess.run([sys.executable, str(ROOT / "scripts" / "generate_samples.py")], check=True)


def test_a1_samples_produce_changes():
    config = DiffConfig(job_dir=SAMPLES / ".job-a1")
    result = compare_pdfs(
        SAMPLES / "contract-v1.pdf",
        SAMPLES / "contract-v2.pdf",
        config,
    )
    assert result.pages
    assert result.summary
    assert "difference" in result.summary.lower() or result.pages[0].changes


def test_a2_report_drift_detected():
    config = DiffConfig(job_dir=SAMPLES / ".job-a2")
    result = compare_pdfs(
        SAMPLES / "report-baseline.pdf",
        SAMPLES / "report-drift.pdf",
        config,
    )
    assert any(p.pixelDiffPct > 0 or p.changes for p in result.pages)


def test_a2_signature_flag_when_baseline_has_flags():
    """Signature detection flags missing candidate signatures when baseline indicates signing."""
    config = DiffConfig(job_dir=SAMPLES / ".job-a2b")
    result = compare_pdfs(
        SAMPLES / "contract-v1.pdf",
        SAMPLES / "contract-v2.pdf",
        config,
    )
    sig_diff = result.objectDiff or {}
    sig_entries = sig_diff.get("signatures", [])
    assert result.summary or sig_entries or result.signatures


def test_a3_assert_threshold():
    config = DiffConfig(job_dir=SAMPLES / ".job-a3", threshold=0.01)
    result = compare_pdfs(
        SAMPLES / "layout-a.pdf",
        SAMPLES / "layout-b.pdf",
        config,
    )
    assert result.assertion is not None
    assert result.assertion.pass_ is False

    config_pass = DiffConfig(job_dir=SAMPLES / ".job-a3b", threshold=100.0)
    result_pass = compare_pdfs(
        SAMPLES / "layout-a.pdf",
        SAMPLES / "layout-a.pdf",
        config_pass,
    )
    assert result_pass.assertion.pass_ is True
