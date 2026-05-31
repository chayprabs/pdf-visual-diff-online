#!/usr/bin/env python3
"""Generate sample PDF fixtures for acceptance tests."""

from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]
SAMPLES = ROOT / "samples"


def write_pdf(path: Path, pages: list[str]) -> None:
    doc = fitz.open()
    for text in pages:
        page = doc.new_page()
        page.insert_text((72, 72), text)
    doc.save(path)
    doc.close()


def main() -> None:
    SAMPLES.mkdir(exist_ok=True)
    write_pdf(SAMPLES / "contract-v1.pdf", ["Signed Contract v1\nParty A agrees."])
    write_pdf(SAMPLES / "contract-v2.pdf", ["Signed Contract v2\nParty A agrees with amendments."])
    write_pdf(SAMPLES / "report-baseline.pdf", ["Q4 Report\nRevenue: $1M"])
    write_pdf(SAMPLES / "report-drift.pdf", ["Q4 Report\nRevenue: $1.2M"])
    write_pdf(SAMPLES / "layout-a.pdf", ["Layout demo page one."])
    write_pdf(SAMPLES / "layout-b.pdf", ["Layout demo page one changed."])
    print(f"Wrote samples to {SAMPLES}")


if __name__ == "__main__":
    main()
