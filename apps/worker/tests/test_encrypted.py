"""Encrypted PDF password handling."""

from pathlib import Path

import fitz
import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _encrypted_pdf(path: Path, password: str, text: str) -> None:
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), text)
    doc.save(path, encryption=fitz.PDF_ENCRYPT_AES_256, user_pw=password)
    doc.close()


def test_encrypted_identical_pair(tmp_path: Path):
    pwd = "testpass"
    a = tmp_path / "a.pdf"
    b = tmp_path / "b.pdf"
    _encrypted_pdf(a, pwd, "Secret doc")
    _encrypted_pdf(b, pwd, "Secret doc")
    files = {
        "baseline": ("a.pdf", a.read_bytes(), "application/pdf"),
        "candidate": ("b.pdf", b.read_bytes(), "application/pdf"),
    }
    r = client.post(
        "/v1/diff",
        files=files,
        data={
            "dpi": "72",
            "tolerance": "15",
            "baseline_password": pwd,
            "candidate_password": pwd,
        },
    )
    assert r.status_code == 200, r.text
    data = r.json()
    assert "summary" in data


def test_wrong_password_422(tmp_path: Path):
    a = tmp_path / "a.pdf"
    _encrypted_pdf(a, "correct", "x")
    files = {"baseline": ("a.pdf", a.read_bytes(), "application/pdf"), "candidate": ("a.pdf", a.read_bytes(), "application/pdf")}
    r = client.post("/v1/diff", files=files, data={"baseline_password": "wrong"})
    assert r.status_code == 422
