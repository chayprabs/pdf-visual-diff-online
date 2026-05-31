#!/usr/bin/env python3
"""Generate sample PDF fixtures for acceptance tests."""

import io
from pathlib import Path

import fitz
import pikepdf

ROOT = Path(__file__).resolve().parents[1]
SAMPLES = ROOT / "samples"
WEB_SAMPLES = ROOT / "apps" / "web" / "public" / "samples"


def write_pdf(path: Path, pages: list[str]) -> None:
    doc = fitz.open()
    for text in pages:
        page = doc.new_page()
        page.insert_text((72, 72), text)
    doc.save(path)
    doc.close()


def set_signature_flags(path: Path, flags: int) -> None:
    data = path.read_bytes()
    with pikepdf.open(io.BytesIO(data)) as pdf:  # type: ignore[name-defined]
        acro = pikepdf.Dictionary(
            {
                "/SigFlags": flags,
                "/Fields": pikepdf.Array([]),
            }
        )
        pdf.Root["/AcroForm"] = pdf.make_indirect(acro)
        pdf.save(path)


def copy_samples_to_web() -> None:
    WEB_SAMPLES.mkdir(parents=True, exist_ok=True)
    for pdf in SAMPLES.glob("*.pdf"):
        dest = WEB_SAMPLES / pdf.name
        dest.write_bytes(pdf.read_bytes())


def main() -> None:
    SAMPLES.mkdir(exist_ok=True)
    write_pdf(SAMPLES / "contract-v1.pdf", ["Signed Contract v1\nParty A agrees."])
    write_pdf(SAMPLES / "contract-v2.pdf", ["Signed Contract v2\nParty A agrees with amendments."])
    write_pdf(SAMPLES / "report-baseline.pdf", ["Q4 Report\nRevenue: $1M"])
    write_pdf(SAMPLES / "report-drift.pdf", ["Q4 Report\nRevenue: $1.2M"])
    write_pdf(SAMPLES / "layout-a.pdf", ["Layout demo page one."])
    write_pdf(SAMPLES / "layout-b.pdf", ["Layout demo page one changed."])

    write_pdf(SAMPLES / "signed-baseline.pdf", ["Signed agreement v1\nSignature block present."])
    set_signature_flags(SAMPLES / "signed-baseline.pdf", 3)
    write_pdf(SAMPLES / "signed-candidate-unsigned.pdf", ["Signed agreement v2\nSignature block present."])
    set_signature_flags(SAMPLES / "signed-candidate-unsigned.pdf", 0)

    copy_samples_to_web()
    print(f"Wrote samples to {SAMPLES} and {WEB_SAMPLES}")


if __name__ == "__main__":
    main()
