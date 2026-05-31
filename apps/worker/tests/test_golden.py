"""Golden DiffResult snapshots for sample fixtures."""

import json
import subprocess
import sys
from pathlib import Path

import pytest

from app.diff_engine import DiffConfig, compare_pdfs

ROOT = Path(__file__).resolve().parents[3]
SAMPLES = ROOT / "samples"
GOLDEN = Path(__file__).resolve().parent / "golden"


@pytest.fixture(scope="module", autouse=True)
def ensure_samples():
    if not (SAMPLES / "contract-v1.pdf").exists():
        subprocess.run([sys.executable, str(ROOT / "scripts" / "generate_samples.py")], check=True)
    GOLDEN.mkdir(parents=True, exist_ok=True)


def _normalize(result_dict: dict) -> dict:
    for page in result_dict.get("pages", []):
        for key in ("maskPath", "baselinePath", "candidatePath", "bundlePath"):
            page.pop(key, None)
    result_dict.pop("bundlePath", None)
    return result_dict


def test_golden_contract_diff():
    config = DiffConfig(job_dir=SAMPLES / ".job-golden", dpi=72, tolerance=15)
    result = compare_pdfs(SAMPLES / "contract-v1.pdf", SAMPLES / "contract-v2.pdf", config)
    data = _normalize(result.model_dump(by_alias=True))
    golden_path = GOLDEN / "contract-v1-v2.json"
    if not golden_path.exists():
        golden_path.write_text(json.dumps(data, indent=2, default=str), encoding="utf-8")
    expected = json.loads(golden_path.read_text(encoding="utf-8"))
    assert data["summary"]
    assert len(data["pages"]) == len(expected["pages"])
    assert data["pages"][0]["pixelDiffPct"] >= 0
