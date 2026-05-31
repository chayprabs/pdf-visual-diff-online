# Contributing to PdfDiff

Thank you for your interest in contributing.

## Development setup

1. Fork and clone the repository.
2. Install Node 22+, pnpm 9+, and Python 3.12+.
3. Run `pnpm install` and `pip install -r apps/worker/requirements.txt`.
4. Start worker and web as described in README.md.

## Pull requests

- Keep changes focused and include tests where applicable.
- Ensure `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pytest` pass.
- Follow conventional commit messages.

## Reporting issues

Use GitHub issues with reproduction steps and sample PDFs when possible.
