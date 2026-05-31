from __future__ import annotations

import os
import shutil
import tempfile
import uuid
from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

from app.diff_engine import DiffConfig, cleanup_job, compare_pdfs
from app.models import DiffResult

app = FastAPI(title="PdfDiff Worker", version="1.0.0")

origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RETENTION_SECONDS = int(os.environ.get("ARTIFACT_TTL_SECONDS", "3600"))
MAX_UPLOAD_MB = int(os.environ.get("MAX_UPLOAD_MB", "50"))


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


def _save_upload(upload: UploadFile, dest: Path) -> None:
    size = 0
    max_bytes = MAX_UPLOAD_MB * 1024 * 1024
    with dest.open("wb") as f:
        while chunk := upload.file.read(1024 * 1024):
            size += len(chunk)
            if size > max_bytes:
                raise HTTPException(413, f"File exceeds {MAX_UPLOAD_MB}MB limit")
            f.write(chunk)


def _parse_opts(
    dpi: int | None,
    tolerance: int | None,
    threshold: float | None,
) -> DiffConfig:
    return DiffConfig(
        dpi=dpi or 150,
        tolerance=tolerance or 12,
        threshold=threshold,
    )


def _serialize_result(result: DiffResult, job_id: str) -> dict:
    data = result.model_dump(by_alias=True)
    for page in data.get("pages", []):
        mask = page.pop("maskPath", None)
        if mask:
            page["maskUrl"] = f"/v1/artifacts/{job_id}/{Path(mask).name}"
    bundle = data.pop("bundlePath", None)
    if bundle:
        data["bundleUrl"] = f"/v1/artifacts/{job_id}/{Path(bundle).name}"
    return data


@app.post("/v1/diff")
async def diff_endpoint(
    baseline: UploadFile = File(...),
    candidate: UploadFile = File(...),
    dpi: int = Form(150),
    tolerance: int = Form(12),
):
    job_id = uuid.uuid4().hex
    job_dir = Path(tempfile.gettempdir()) / "pdf-diff" / job_id
    job_dir.mkdir(parents=True, exist_ok=True)
    baseline_path = job_dir / "baseline.pdf"
    candidate_path = job_dir / "candidate.pdf"
    try:
        _save_upload(baseline, baseline_path)
        _save_upload(candidate, candidate_path)
        config = _parse_opts(dpi, tolerance, None)
        config.job_dir = job_dir
        result = compare_pdfs(baseline_path, candidate_path, config)
        return JSONResponse(_serialize_result(result, job_id))
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(500, "Diff failed") from exc


@app.post("/v1/assert")
async def assert_endpoint(
    baseline: UploadFile = File(...),
    candidate: UploadFile = File(...),
    dpi: int = Form(150),
    tolerance: int = Form(12),
    threshold: float = Form(0.5),
):
    job_id = uuid.uuid4().hex
    job_dir = Path(tempfile.gettempdir()) / "pdf-diff" / job_id
    job_dir.mkdir(parents=True, exist_ok=True)
    baseline_path = job_dir / "baseline.pdf"
    candidate_path = job_dir / "candidate.pdf"
    try:
        _save_upload(baseline, baseline_path)
        _save_upload(candidate, candidate_path)
        config = _parse_opts(dpi, tolerance, threshold)
        config.job_dir = job_dir
        result = compare_pdfs(baseline_path, candidate_path, config)
        return JSONResponse(_serialize_result(result, job_id))
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(500, "Assert diff failed") from exc


@app.get("/v1/artifacts/{job_id}/{filename}")
def get_artifact(job_id: str, filename: str):
    if ".." in job_id or ".." in filename:
        raise HTTPException(400, "Invalid path")
    path = Path(tempfile.gettempdir()) / "pdf-diff" / job_id / filename
    if not path.exists():
        raise HTTPException(404, "Artifact not found")
    return FileResponse(
        path,
        headers={"Cache-Control": "private, no-store"},
    )
