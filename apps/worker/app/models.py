from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


class PageChange(BaseModel):
    kind: Literal[
        "text",
        "annotation",
        "image",
        "metadata",
        "font",
        "signature",
        "form",
        "bookmark",
        "attachment",
    ]
    bbox: tuple[float, float, float, float]
    description: str


class PageDiff(BaseModel):
    page: int
    pixelDiffPct: float = Field(alias="pixelDiffPct")
    changes: list[PageChange]
    maskPath: str | None = None
    baselinePath: str | None = None
    candidatePath: str | None = None

    model_config = {"populate_by_name": True}


class SignatureInfo(BaseModel):
    present: bool
    valid: bool | None = None
    details: str | None = None


class AssertionResult(BaseModel):
    pass_: bool = Field(alias="pass")
    threshold: float
    observed: float

    model_config = {"populate_by_name": True}


class DiffResult(BaseModel):
    pages: list[PageDiff]
    metadata: dict[str, Any]
    metadataDiff: dict[str, dict[str, Any]] | None = None
    signatures: dict[str, SignatureInfo]
    textDiff: list[dict[str, Any]] | None = None
    objectDiff: dict[str, Any] | None = None
    fontDiff: dict[str, Any] | None = None
    summary: str
    assertion: AssertionResult | None = None
    bundlePath: str | None = None
