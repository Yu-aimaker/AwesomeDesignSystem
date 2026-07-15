# Security policy

AwesomeDS treats documentation, generated assets, install scripts, packages, and the public docs site as one security boundary.

## Supported versions

Security fixes target the current `main` branch and the latest published release. Older snapshots may not receive backports unless a maintainer explicitly marks them as supported.

## Report a vulnerability privately

Do not open a public issue for a suspected vulnerability or leaked credential. Use GitHub's **Private vulnerability reporting** for this repository:

1. Open the repository's **Security** tab.
2. Choose **Report a vulnerability**.
3. Include affected paths or versions, impact, reproduction steps, and any suggested mitigation.

If private reporting is unavailable, contact the repository owner through their verified GitHub profile and ask for a private channel. Do not include exploit details in the initial public message.

## Response process

Maintainers will validate the report, establish affected versions, prepare a fix and regression test, and coordinate disclosure. We aim to acknowledge actionable reports within five business days, but this is a response target rather than a contractual SLA.

## Repository controls

- OSV dependency scans run on relevant pull requests, pushes, and a weekly schedule.
- Dependabot monitors npm and GitHub Actions dependencies.
- The docs site applies a nonce-bound script CSP and defense-in-depth response headers.
- Local credentials, agent state, environment files, and deployment state are excluded from version control.
- Release evidence and known automation boundaries are published under `reports/` and `docs/qa-report.md`.

See the public [Release Reports](https://awesome-design-system.yumaker.studio/en/reports) surface for the latest recorded verification snapshot.
