# Release Qualification Checklist - PdfDiff (pdf-visual-diff-online)

# Standalone Tool Portfolio - Qualifying Criteria (30 Tools)

> **Purpose.** This document is the release gate for every Standalone Tool Portfolio
> tool. For each of the 30 tools there is one self-contained section
> below. Copy that single section into an AI verification agent's
> context window, give it the repo URL and the hosted URL, and tell it
> to work through the checklist. When every box passes, the tool has
> officially qualified as a working v1.
>
> Run this file repeatedly. Every release of every tool should re-pass
> its own section before going live.

---

## How to use this document

### As a human reviewer

1. Pick a tool to verify.
2. Copy that tool's entire section into a fresh working doc.
3. Tick boxes as you (or your agent) verify each item.
4. Required artefacts to start: repo URL, hosted URL, optional credentials.

### As an AI verification agent (the intended primary user)

The end user will paste one tool's full section into your context. You
will also receive:

- The repo URL (`https://github.com/chayprabs/pdf-visual-diff-online`).
- The hosted URL (`https://<tool>.Standalone Tool Portfolio`).
- The relevant product requirements file path (`prds/N_<tool>.md`).
- The universal context file (`IMPLEMENTATION_HANDOFF.md`).

Your environment must have:

```
node >= 22       pnpm >= 9         docker >= 24
curl             jq                git
gh               openssl           dig
playwright OR puppeteer            lighthouse-cli
```

Work through every checkbox in order. For each item:

1. **If the check passes**, tick the box and record the evidence
   (command + output, screenshot, or selector + DOM snapshot).
2. **If the check fails**, do not tick. Record the failure mode with
   reproducible evidence.
3. **If the check is ambiguous** (e.g. requires credentials you don't
   have), mark `BLOCKED` and explain.
4. **If a Docker/local-runtime check fails for a host/environment reason only**, mark `VERIFY-DEFERRED` instead of `FAILED` or `BLOCKED`. This applies to Docker daemon unavailable, registry/network pull flakes, disk/permission/port conflicts, platform mismatch, or non-deterministic startup timeouts with no app stack trace after one retry. It does not apply to code defects such as invalid Dockerfile/compose syntax, missing dependencies/files, app boot crashes, missing health endpoints, or failing product behavior.
5. For `VERIFY-DEFERRED`, continue through the remaining non-Docker checks and record substitute evidence: `docker compose config` if available, static Dockerfile/compose inspection, install/lint/typecheck/test/build results, and local web/worker run evidence where possible.

A `VERIFY-DEFERRED` item must not stop a Codex implementation `/goal`. Public release qualification remains strict: deferred Docker/runtime checks must be rerun in CI or on a healthy Docker host before claiming final `QUALIFIED`.

At the end produce a structured report:

```
Tool: <name>
Total checks: <N>
Passed: <P>
Failed: <F> (list each with evidence)
Blocked: <B> (list each with reason)
Verify-deferred: <D> (list each host/runtime check with rerun command)
Verdict: QUALIFIED | NOT QUALIFIED | VERIFY-DEFERRED
```

If verdict = QUALIFIED, post a comment on the release PR with the body
`Qualifying-Criteria-PASS: <tool>@<sha>` and a link to your report.

If verdict = NOT QUALIFIED because of product or code failures, open a
GitHub issue per failed check with label `qualifying-failure`, assign to
the tool owner, and **block the release** until all are resolved.

If only `VERIFY-DEFERRED` host/runtime items remain, open a verification
follow-up instead of a code-failure issue. Do not block Codex
implementation progress, but do not claim final release `QUALIFIED` until
those checks pass in CI or on a healthy Docker host.

### Universal assumptions (true for every tool)

These hold across the org. If any are not true for a specific tool,
that tool's section will say so explicitly.

- The repo follows one of two templates documented in
  `IMPLEMENTATION_HANDOFF.md` Section 4.
- **Pattern 1 (server-side)** tools: `apps/web/` + `apps/worker/` + `docker-compose.yml`.
- **Pattern C+D (browser-only)** tools: `packages/core/` + `packages/web/` (+ optional `packages/cli/`).
- Hosted convention: `<tool-slug>.Standalone Tool Portfolio`; API on `api.<tool-slug>.Standalone Tool Portfolio` for server-side.
- Org-wide required files: `LICENSE`, `README.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, `.github/workflows/ci.yml`, `.github/workflows/release.yml`.

### Section structure - every tool has these 13 categories

| # | Category | Goal |
|---|---|---|
| .0 | Inputs the agent needs | What you receive before starting |
| .1 | Repo structure | Files/folders/config exist |
| .2 | Build & install | pnpm install / typecheck / lint / test / build |
| .3 | Local run | docker-compose / vite dev / health check |
| .4 | Functional (per PRD F-requirements) | Each F1.x, F2.x, ... verified |
| .5 | UI / UX | Header, drops, states, keyboard, mobile, dark mode |
| .6 | Non-functional (perf & budgets) | Lighthouse, p95 latency, bundle size |
| .7 | Privacy & security | CSP, retention, logs, CSP, secrets, redaction |
| .8 | Testing | Coverage, e2e, fixtures, snapshots |
| .9 | Deployment | Hosted URL works, TLS, releases, registries |
| .10 | Docs | README, license, links, screenshots |
| .11 | SEO / discovery | Description, topics, sub-routes, schema |
| .12 | Acceptance fixtures (PRD Section 20) | The must-pass canned scenarios |
| .13 | Final verdict | Block on product/code failures; defer proven host-only runtime glitches |

---

<!-- BEGIN_SECTIONS -->


---

## 27. PdfDiff (`pdf-visual-diff-online`)

### 27.0 Inputs

- [ ] Repo, PRD `PRODUCT_REQUIREMENTS.md`, handoff.
- [ ] Hosted `https://pdf-diff.Standalone Tool Portfolio` + API.
- [ ] Samples: signed contract v1 vs v2, generated report drift, layout-change demo.
- [ ] Pattern: **Pattern 1 (server-side)**.

### 27.1 Repo structure

- [ ] Server-side template.
- [ ] Worker Python + PyMuPDF + Pillow + pixelmatch-py + pikepdf.
- [ ] LICENSE = AGPL-3.0.
- [ ] Topics >=10 of: `pdf`, `pdf-diff`, `pdf-compare`, `visual-diff`, `visual-regression`, `pdf-tools`, `document-comparison`, `pymupdf`, `pdfium`, `pdf-text-diff`, `signed-pdf`, `pdf-annotations`, `pdf-forms`, `document-automation`, `online-tool`.

### 27.2 Build & install

- [ ] Standard checks green.

### 27.3 Local run

- [ ] `docker compose up` healthy.

### 27.4 Functional - Visual diff (PRD F1)

- [ ] Page render at configurable DPI works.
- [ ] Pixel mask per page; anti-alias tolerance slider applied.
- [ ] Overlay view with bbox around changes.

### 27.5 Functional - Text diff (PRD F2)

- [ ] Text extracted with positions.
- [ ] Position-aware diff (moved text isn't reported as add+remove).

### 27.6 Functional - Object diff (PRD F3)

- [ ] Annotations, form fields, attachments, bookmarks, signatures all diffed.
- [ ] Signature missing on v2 fixture flagged (per PRD Section 20.A2).

### 27.7 Functional - Metadata + font diff (PRD F4-F5)

- [ ] Info dict + XMP diff.
- [ ] Embedded fonts + images diff.

### 27.8 Functional - Summary (PRD F6)

- [ ] Plain-English page-by-page summary present.

### 27.9 Functional - Reports (PRD F7)

- [ ] Diff bundle ZIP with masks, composite PDF, summary HTML, JSON.

### 27.10 Functional - Assert mode (PRD F8)

- [ ] Threshold + observed comparison; pass/fail badge (per PRD Section 20.A3).

### 27.11 Functional - Baselines (PRD F9)

- [ ] Pro: save baseline per repo/branch.

### 27.12 UI / UX

- [ ] Thumbnails with "changed" badges.
- [ ] Page view: original / candidate / overlay / mask toggle.
- [ ] Right drawer with summary + object diff.

### 27.13 Non-functional

- [ ] Lighthouse >= 95.
- [ ] p95 diff 20-page PDF <= 12 s.

### 27.14 Privacy

- [ ] No PDF content in logs.
- [ ] Retention TTL.
- [ ] HTTPS cert valid.

### 27.15 Testing

- [ ] Golden DiffResult per sample.
- [ ] Pixel-diff stability across renders.

### 27.16 Deployment

- [ ] Hosted URLs 200.
- [ ] Worker image pushed.

### 27.17 Docs

- [ ] README + screenshot + self-host.

### 27.18 SEO

- [ ] Sub-routes 200: `/pdf-compare`, `/pdf-visual-diff`, `/pdf-text-diff`, `/pdf-signature-check`, `/pdf-regression-test`.

### 27.19 Acceptance fixtures (PRD Section 20)

- [ ] **A1.** Samples produce expected page changes.
- [ ] **A2.** Signature-removed fixture flagged.
- [ ] **A3.** Assert mode pass/fail per threshold.

### 27.20 Final verdict

- [ ] All boxes ticked -> **TOOL 27 (PdfDiff) QUALIFIES**.

---

## B. Standard structured report format

```
Tool: <name>
Section: <N>.<title>
Repo: <github-url>@<sha>
Hosted: <hosted-url>
Run at: <ISO timestamp>
Verifier: <agent-id>

Counts:
  Total checks: <T>
  Passed: <P>
  Failed: <F>
  Blocked: <B>
  Verify-deferred: <D>
Failures:
  - 1.4.F1-RAR: curl returned 500 (logs attached)
  - 1.14: Lighthouse Performance 88 < 95

Blocked:
  - 1.20.A3: requires diff fixture not present in repo

Verify-deferred:
  - 1.3: Docker daemon unavailable; rerun `docker compose up` in CI or on a healthy Docker host.

Verdict: NOT QUALIFIED
Action: open issues for code/product failures; rerun VERIFY-DEFERRED items in CI or on a healthy Docker host before final release.
```

## C. Re-running this document

This file is **idempotent and re-runnable**. Run the relevant section on
every release of a tool. Track section results in a tools-status
spreadsheet or dashboard with one row per tool and one column per
section release. The first all-green row across all 30 tools = the
portfolio's GA milestone.
