# Codex Goal Prompt - PdfDiff (pdf-visual-diff-online)

This file contains the standalone Codex `/goal` prompt for this repository.

## 27. PdfDiff (`pdf-visual-diff-online`) - Pattern 1

~~~
You are building **PdfDiff** as a standalone open-source tool.

Repo: `pdf-visual-diff-online` - Pattern: **Pattern 1 (server-side)** - License: **AGPL-3.0**.

What it does: compare two PDFs visually + structurally - per-page pixel masks with anti-alias tolerance, position-aware text diff, object-level diff (annotations / form fields / attachments / bookmarks / signatures), metadata diff, font/resource diff, plain-English summary, CI "assert" mode.

**Required reading (BEFORE writing any code; read each fully):**
1. `IMPLEMENTATION_HANDOFF.md` - universal context, default tech stack, repo template, shared UI conventions, license/CI/deployment defaults.
2. `PRODUCT_REQUIREMENTS.md` - full product requirements document. Section 5 F-requirements are HARD; Section 20 acceptance criteria are your DoD.
3. `RELEASE_QUALIFICATION_CHECKLIST.md` **Section 27** - the release gate. Every code/product checkbox must pass. Host-only Docker/runtime glitches may be `VERIFY-DEFERRED` under the resilience policy below.

**Verification resilience policy (do not stop `/goal` on environment flakes):**
- Docker support is still required: write Dockerfiles, compose files, health checks, and docs as if they will run in CI and on a clean machine.
- Treat code-caused failures as blocking: invalid Dockerfile/compose syntax, missing files, repo dependency/install errors, app boot crashes, missing health endpoints, failing lint/typecheck/unit/build/e2e, or failing PRD behavior. Fix these before completing.
- Treat host-caused Docker failures as `VERIFY-DEFERRED`, not `/goal` blockers: Docker daemon unavailable, registry/network pull flake, disk/permission/port conflict, platform mismatch, or timeout with no app stack trace after one retry. Record the command, error, and the static checks used instead, then continue.
- When Docker execution is deferred, still run what you can: `docker compose config` when available, package install, lint, typecheck, tests, build, local web/worker run without Docker, and static inspection of Dockerfile COPY paths/env/health checks.
- Finish with a QC note listing passed checks, fixed code defects, and any `VERIFY-DEFERRED` Docker evidence. Do not mark the Codex `/goal` blocked solely because the host Docker runtime glitched.

**Tool-specific stack:**
- Worker: Python 3.12 + FastAPI + `PyMuPDF` (render + text + objects) + Pillow + `pixelmatch-py` + `pikepdf` (low-level objects).
- Web: Next.js 15 + Tailwind 4 + shadcn/ui + pdf.js previews + per-page mask overlay.

**Workflow:**
- Branch: `cursor/pdf-diff-build`. Stay on it. Push on every commit.
- Pattern-1 repo layout.
- Use shared packages.

**COMMIT CADENCE - STRICT, NON-NEGOTIABLE:**
`git commit && git push` every 5-6 minutes. No exceptions.
- Conventional messages.
- One sentence per commit.
- Stale at 6 min -> `chore: wip <area>`.
- Target: 30+ commits.
Examples:
  feat(worker): per-page pixel mask with tolerance
  feat(text): position-aware text diff
  feat(assert): threshold-based pass/fail badge

**Build order (PRD F-requirements):**
F1 visual diff (page render + pixel mask + tolerance + overlay) -> F2 text diff (extract with positions; moved-text aware) -> F3 object diff (annotations/fields/attachments/bookmarks/signatures) -> F4 metadata diff -> F5 font/resource diff -> F6 plain-English summary -> F7 reports (diff bundle ZIP) -> F8 assert mode (CI threshold pass/fail) -> F9 baselines (Pro).

After each F: tests -> run -> commit -> push. After each section: re-walk QUALIFYING_CRITERIA Section 27, tick boxes, commit progress.

**Verification phase (mandatory):**
Run every check in `RELEASE_QUALIFICATION_CHECKLIST.md` Section 27:
- Lighthouse >=95.
- p95 diff 20-page PDF <=12s.
- Acceptance Section 27.19: A1 samples produce expected page changes, A2 signature-removed fixture flagged, A3 assert mode pass/fail per threshold.
- Produce QC Appendix B report.
- Any code/product failure -> fix, commit, push, re-verify. Host-only Docker/runtime glitches -> record `VERIFY-DEFERRED` evidence and continue.

**Done = code/product QUALIFIED on QUALIFYING_CRITERIA Section 27 with no unresolved code/product failures.** If Docker/runtime is `VERIFY-DEFERRED`, include the rerun evidence in the PR and do not claim final public release `QUALIFIED` until it passes. Open PR titled `PdfDiff: v1 build (QC Section 27 qualified)`.
~~~

---
