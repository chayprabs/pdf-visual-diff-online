from pathlib import Path

import fitz
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _pdf_bytes(text: str) -> bytes:
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), text)
    bio = doc.tobytes()
    doc.close()
    return bio


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_diff_endpoint():
    files = {
        "baseline": ("a.pdf", _pdf_bytes("A"), "application/pdf"),
        "candidate": ("b.pdf", _pdf_bytes("B"), "application/pdf"),
    }
    r = client.post("/v1/diff", files=files, data={"dpi": "72", "tolerance": "20"})
    assert r.status_code == 200
    data = r.json()
    assert "summary" in data
    assert "pages" in data


def test_assert_endpoint():
    files = {
        "baseline": ("a.pdf", _pdf_bytes("Same"), "application/pdf"),
        "candidate": ("b.pdf", _pdf_bytes("Same"), "application/pdf"),
    }
    r = client.post(
        "/v1/assert",
        files=files,
        data={"dpi": "72", "tolerance": "20", "threshold": "5"},
    )
    assert r.status_code == 200
    data = r.json()
    assert data.get("assertion", {}).get("pass") is True
