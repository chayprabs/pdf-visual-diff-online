# Product Requirements 27 - PdfDiff (`pdf-visual-diff-online`)

## 0. Meta

| Field | Value |
|---|---|
| Tool ID | `pdf-diff` |
| Repo name | `pdf-visual-diff-online` |
| Architecture pattern | **Pattern 1 - Server-side** |
| Worker | Python + PyMuPDF + image diff |
| PRD version | 1.0.0 |

---

## 1. Overview

**One-liner.** Compare PDFs visually and structurally online -
per-page masks, text and object diffs, signature checks and
human-readable summaries.

**Problem.** Comparing PDFs (contract revisions, generated reports,
signed agreements) is essential but the only good tools are pricey
(Draftable, Adobe). Open-source `diff-pdf` is local-only.

**Solution.** A playground that compares two PDFs across visual,
text, structural, and metadata dimensions, producing per-page masks
and a plain-English summary.

---

## 2. Goals & non-goals

### Goals

- G1. Visual page diff with pixel masks + tolerance.
- G2. Text-content diff (position-aware).
- G3. Object-level diff (annotations, fields, attachments, bookmarks, signatures).
- G4. Metadata diff.
- G5. Font/embedded-resource diff.
- G6. Plain-English summary.
- G7. CI-friendly "assert" mode with pass/fail threshold.

### Non-goals

- NG1. PDF editing.
- NG2. OCR-based diff for scanned PDFs (v2).

---

## 3. Personas

- **Legal "Lila"** comparing signed contracts.
- **QA "Qadir"** verifying generated reports.
- **Compliance "Olu"** ensuring nothing changed.

---

## 4. Stories

- U1. Lila uploads two signed PDFs; sees signature missing on v2.
- U2. Qadir CI-runs PDF diff vs baseline; fails on threshold.
- U3. Olu downloads side-by-side composite.

---

## 5. Functional

### F1. Visual diff

- F1.1 Page render at configurable DPI.
- F1.2 Pixel mask per page; anti-alias tolerance slider.
- F1.3 Overlay view with bounding boxes around changes.

### F2. Text diff

- F2.1 Extract text with positions.
- F2.2 Diff position-aware (so "moved text" isn't reported as added+removed).

### F3. Object diff

- F3.1 Annotations.
- F3.2 Form fields.
- F3.3 Attachments.
- F3.4 Bookmarks.
- F3.5 Signatures (presence + validity).

### F4. Metadata diff

- Info dict + XMP.

### F5. Font / resource diff

- Embedded fonts and images.

### F6. Summary

- F6.1 Plain-English page-by-page summary.

### F7. Reports

- Diff bundle (ZIP): masks per page, composite PDF, summary HTML, JSON.

### F8. Assert mode

- Threshold (e.g. "fail if pixel diff > 0.5%").
- Output is pass/fail badge + summary.

### F9. Baselines

- Save a baseline per repo/branch (Pro).

---

## 6. Non-functional

- p95 diff 20-page PDF <= 12 s.
- Worker memory 2 GB.

---

## 7. Architecture

Pattern 1.

### Stack

- PyMuPDF (page render + text + objects).
- Pillow + pixelmatch-py for visual diff.
- pikepdf for low-level object access.

---

## 8. Data model

```ts
export interface PageDiff { page: number; pixelDiffPct: number; changes: { kind: "text"|"annotation"|"image"; bbox: [number,number,number,number]; description: string }[]; }

export interface DiffResult { pages: PageDiff[]; metadata: object; signatures: object; summary: string; assertion?: { pass: boolean; threshold: number; observed: number }; }
```

---

## 9. UI / UX

### Page: `/`

- Two PDF drops.
- After diff: thumbnails with "changed" badges.
- Page view: original / candidate / overlay / mask toggle.
- Right drawer: summary + object diff.

---

## 10. API surface

- `POST /v1/diff` - body two files + opts -> DiffResult.
- `POST /v1/assert` - same + threshold -> pass/fail.

---

## 11. Samples

- Signed contract v1 vs v2.
- Generated report drift.
- Layout change demo.

---

## 12. Privacy

- Server-side defaults.

---

## 13. Testing

- Golden DiffResult per sample.
- Pixel-diff stability across renders.

---

## 14. Deployment

- Worker Fly.io.

---

## 15. CI/CD

- Per template.

---

## 16. SEO

- Description: "Compare PDFs visually and structurally online - per-page masks, text and object diffs, signature checks and human-readable summaries."
- Topics: `pdf`, `pdf-diff`, `pdf-compare`, `visual-diff`, `visual-regression`, `pdf-tools`, `document-comparison`, `pymupdf`, `pdfium`, `pdf-text-diff`, `signed-pdf`, `pdf-annotations`, `pdf-forms`, `document-automation`, `online-tool`.
- Sub-routes: `/pdf-compare`, `/pdf-visual-diff`, `/pdf-text-diff`, `/pdf-signature-check`, `/pdf-regression-test`.

---

## 17. License & monetization

- AGPL-3.0.
- Pro: baselines + scheduled + CI integration.

---

## 18. Launch

- MVP: visual + text + samples.
- Beta: objects + signatures + summary.
- GA: assert mode + baselines.

---

## 19. Metrics

- NSM: diffs / week.

---

## 20. Acceptance

- A1. Samples produce expected page changes.
- A2. Signature-removed fixture flagged.
- A3. Assert mode pass/fail per threshold.

---

## 21. Risks

| Risk | Mitigation |
|---|---|
| Anti-aliasing noise | Tolerance defaults + override. |
| Encrypted PDFs | Password input that doesn't persist. |

---

## 22. Future

- OCR-aware diff for scans.
- GitHub Action wrapping.
- VS Code extension.

---

## 23. Glossary

- **Pixel mask** - Image where changed pixels are highlighted.
- **PAdES** - PDF Advanced Electronic Signatures.
