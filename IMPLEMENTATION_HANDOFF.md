# Implementation Handoff - PdfDiff (pdf-visual-diff-online)

This is the tool-specific handoff distilled from the shared planning document for **PdfDiff**.
The product is a standalone public GitHub repository, not part of a shared platform suite.

## Product Context

- Repo: `pdf-visual-diff-online`
- PRD: `PRODUCT_REQUIREMENTS.md`
- Architecture: Pattern 1 - Server-side
- One-liner: Compare PDFs visually and structurally online - per-page masks, text and object diffs, signature checks and human-readable summaries.

## Default Stack

- TypeScript 5.5+ where practical.
- pnpm workspaces.
- React 19 with shadcn/ui, Tailwind CSS 4, lucide-react, react-hook-form, zod, Zustand, and TanStack Query where applicable.
- Vitest for unit tests, Playwright for e2e, Storybook for component coverage.
- ESLint, Prettier, commitlint, Husky, lint-staged, EditorConfig, and strict TypeScript.
- Worker runtime: Python 3.12 + FastAPI or Node 22 + Hono, matching the PRD.
- Every worker job runs in an ephemeral per-job directory with CPU, memory, file-count, and wall-clock limits.
- Downloads use signed URLs with a documented TTL; file contents and passwords are never logged.
- Self-host path must work with docker compose up.

## Architecture Pattern

Pattern 1: server-side web playground plus sandboxed worker for native file-processing workloads.

## Repo Layout Template

```
<tool-repo>/
|-- apps/
|   |-- web/           Next.js 15 playground.
|   `-- worker/        FastAPI or Hono worker with native dependencies.
|-- packages/
|   |-- shared-ui/
|   |-- shared-types/
|   `-- shared-worker-runtime/
|-- docker-compose.yml
|-- docker-compose.single.yml
|-- .github/workflows/
|-- README.md
`-- LICENSE
```

## Shared UI Conventions

- Header: product name, GitHub link, theme toggle, and concise navigation relevant to this tool.
- Main surface: the playground workflow specified by the PRD, optimized for repeated technical use.
- File input: drag-and-drop, click-to-browse, paste when relevant, URL input only when the PRD allows it, validation, progress, cancel, and sample inputs.
- Result display: tabs for result, warnings/logs, raw JSON, downloads, and share/export when supported.
- Shared primitives to reuse when useful: FileDrop, ResultPane, SamplePicker, EngineSelector, DiffViewer, JsonTree, and SEO/FAQ content.

## Privacy And Security Defaults

- Store uploads and artifacts only in ephemeral per-job directories unless the PRD explicitly enables longer retention.
- Redact file contents, filenames when sensitive, passwords, and secrets from logs.
- Use signed, private, no-store artifact URLs with documented expiry.
- Run native tools with timeout and resource limits.
- Add security.txt, Dependabot, CodeQL, and no third-party tracking scripts.

## License And Monetization Defaults

- License default: AGPL-3.0 for server-side worker/product code.
- Free anonymous use should cover the primary playground workflow within PRD limits.
- Paid tiers, if implemented later, must not hide the basic tool behind a login wall.

## Deployment Defaults

- Web: static export or deployed frontend as appropriate for the chosen Next.js setup.
- Worker: containerized service with documented environment variables and health checks.
- Self-host: docker compose up must work on a clean machine.

## CI/CD Template

- CI on push and PR: pnpm install --frozen-lockfile, lint, typecheck, unit tests, e2e tests, and build.
- Server-side or hybrid repos also build the worker container and run worker integration tests.
- Browser-only or browser-first repos enforce bundle budgets from the PRD.
- Releases are tagged vX.Y.Z and publish the relevant web, npm, and/or container artifacts.

## Verification Resilience Policy

Docker and self-host support remain required deliverables. Implement Dockerfiles, compose files, health checks, environment documentation, and CI/container build configuration so they are valid for a clean machine and CI runner.

During Codex `/goal` implementation, do not stop the goal solely because the local Docker host is unhealthy. Classify Docker daemon outages, image registry/network pull flakes, disk/permission/port conflicts, platform mismatches, and startup timeouts with no app stack trace after one retry as `VERIFY-DEFERRED`. Continue with non-Docker verification and record the exact command, error, and substitute evidence.

Do not defer code defects. Invalid Dockerfile or compose syntax, missing COPY sources, missing dependencies, app boot crashes, missing health endpoints, failing lint/typecheck/unit/build/e2e, and failing PRD acceptance behavior are implementation failures and must be fixed before claiming the code is ready.

When Docker execution is deferred, still run static and local checks where possible: `docker compose config`, Dockerfile/compose path and environment inspection, package install, lint, typecheck, tests, build, and direct web/worker startup outside Docker. The final QC note must list every passed check plus any `VERIFY-DEFERRED` Docker item with a rerun command for CI or a healthy Docker host.

## SEO And Launch Checklist

- GitHub repo name and description should mirror the PRD one-liner and high-intent search terms.
- README first 100 words should repeat the primary keywords naturally and explain the core workflow.
- Include screenshots, sample files, FAQ/schema content where relevant, sitemap/robots for hosted web builds, and no login wall for the playground.

## Definition Of Done

- Every functional requirement in the PRD passes.
- Core or worker test coverage is at least 80% line coverage, with UI snapshots/e2e for important workflows.
- Lighthouse is at least 95 in all four categories on the deployed playground or preview.
- README, LICENSE, CODE_OF_CONDUCT.md, CONTRIBUTING.md, SECURITY.md, CI, and release workflows exist.
- The local run path from the PRD works on a clean machine.
- Qualifying criteria for this tool pass end to end.

## Read Order

1. Read this file.
2. Read `PRODUCT_REQUIREMENTS.md` end to end.
3. Read `RELEASE_QUALIFICATION_CHECKLIST.md` end to end.
4. Use `CODEX_GOAL_PROMPT.md` only when starting a Codex `/goal` run for this repository.
