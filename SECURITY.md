# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |

## Reporting a vulnerability

Please report security issues privately via GitHub Security Advisories on this repository. Do not open public issues for undisclosed vulnerabilities.

## Practices

- Uploads are processed in ephemeral directories with TTL cleanup.
- PDF contents and passwords are not logged intentionally.
- Artifact URLs use `Cache-Control: private, no-store`.
