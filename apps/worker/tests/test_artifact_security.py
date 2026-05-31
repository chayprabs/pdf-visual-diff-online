"""Artifact download path hardening."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_artifact_rejects_path_traversal():
    r = client.get("/v1/artifacts/../etc/passwd/mask.png")
    assert r.status_code in (400, 404)
