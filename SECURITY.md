# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |

## Reporting a vulnerability

Please report security issues **privately** via [GitHub Security Advisories](https://github.com/chayprabs/pdf-visual-diff-online/security/advisories/new). Do not open public issues for undisclosed vulnerabilities.

By submitting a report, you agree that we may process your contact information solely to investigate and respond. See [legal/privacy.md](legal/privacy.md).

## Practices

- Uploads are processed in ephemeral directories with TTL cleanup.
- PDF contents and passwords are not logged intentionally.
- Artifact URLs use `Cache-Control: private, no-store`.

## Disclaimer

Security reports and fixes are provided on a **best-effort** basis without warranty. We are not liable for damages arising from vulnerabilities or delays in disclosure except as required by applicable law. See [legal/terms.md](legal/terms.md) and [legal/disclaimer.md](legal/disclaimer.md).
