"""Baseline path must stay under BASELINES_DIR."""

import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


@pytest.fixture
def baselines_dir(tmp_path: Path, monkeypatch):
    root = tmp_path / "baselines"
    root.mkdir()
    monkeypatch.setenv("BASELINES_DIR", str(root))
    return root


def test_baseline_escape_blocked(baselines_dir: Path):
    r = client.post(
        "/v1/baselines",
        files={"baseline": ("b.pdf", b"%PDF-1.4\n", "application/pdf")},
        data={"repo": "/tmp/evil", "branch": "main"},
    )
    assert r.status_code == 422
    assert not (Path("/tmp/evil") / "main" / "baseline.pdf").exists()
