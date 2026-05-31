# PdfDiff — PDF Visual Diff Online

Compare PDFs visually and structurally online — per-page masks, text and object diffs, signature checks, and human-readable summaries.

**Keywords:** pdf, pdf-diff, pdf-compare, visual-diff, pdf-tools, document-comparison, pymupdf, pdf-text-diff, signed-pdf, document-automation, online-tool.

## Features

- **Visual diff** — Page renders at configurable DPI with pixel masks and anti-alias tolerance.
- **Text diff** — Position-aware extraction so moved text is not reported as add+remove.
- **Object diff** — Annotations, form fields, attachments, bookmarks, signatures.
- **Metadata & fonts** — Info dict changes and embedded font/resource comparison.
- **Summary** — Plain-English page-by-page summary.
- **Reports** — Downloadable ZIP bundle (masks, summary HTML, JSON).
- **Assert mode** — CI-friendly pass/fail against a pixel-diff threshold.

## Quick start

### Docker (recommended)

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). API worker: [http://localhost:8000/health](http://localhost:8000/health).

### Local development

```bash
pnpm install
pnpm --filter @pdf-diff/shared-types build

# Terminal 1 — worker
cd apps/worker && pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Terminal 2 — web
pnpm --filter @pdf-diff/web dev
```

## API

| Endpoint | Description |
|----------|-------------|
| `POST /v1/diff` | Compare two PDFs (multipart: `baseline`, `candidate`, optional `dpi`, `tolerance`) |
| `POST /v1/assert` | Same + `threshold` for pass/fail |
| `GET /health` | Health check |

## Samples

Fixture PDFs live in `samples/`. Generate them with:

```bash
python scripts/generate_samples.py
```

## Self-host environment

| Variable | Default | Description |
|----------|---------|-------------|
| `WORKER_URL` | `http://localhost:8000` | Worker base URL (web) |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed origins (worker) |
| `ARTIFACT_TTL_SECONDS` | `3600` | Ephemeral artifact retention |
| `MAX_UPLOAD_MB` | `50` | Upload size limit |

## License

AGPL-3.0 — see [LICENSE](LICENSE).

## Links

- [GitHub](https://github.com/chayprabs/pdf-visual-diff-online)
- [Privacy Policy](/privacy) (on deployed site)
- [Terms](/terms)
