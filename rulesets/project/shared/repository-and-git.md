# Repository And Git

## The remote is GitHub, and a push can deploy

- The remote is `asipenka-kanstantsin/compremium_`. It was Bitbucket until hosting was settled; Webflow Cloud builds from a connected GitHub repository, so the move was a consequence of `docs/adr/0004-hosting-webflow-cloud.md`, not a preference.
- **Webflow Cloud tracks one branch per environment. A push to a tracked branch is a deployment.** Treat pushing as an outward-facing action and confirm it, rather than as the last step of committing.
- Never claim a pull request was opened. Prepare the branch, push it, and report the branch name and the compare URL for a human to open the PR.
- `gh` is available in principle now, but nothing here requires it, and the accelerator's `release` skill has not been exercised against this remote. Do not reach for it without being asked.
- GitHub does read a pull-request template from the repository, which Bitbucket did not. The checklist still lives in `docs/pull-request-checklist.md`; whether it also becomes `.github/pull_request_template.md` is an open decision, noted in that file.

## Branches and commits

- `main` is the integration branch. Never commit to it directly; branch first.
- Conventional-commit subjects (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- One logical change per commit. Explain why in the body, not what the diff already shows.
- Never commit secrets. `.env.local` is ignored; `.env.example` is the documented surface.

## Before handing work over

- `npm run verify` passes.
- `npm run test:e2e` passes when routing, metadata, canonicals, hreflang or server rendering changed.
- `node ./toolchain/bin/doctor.mjs` is not `BLOCKED`.
- No accelerator payload file is modified.
- A `docs/spec/` content change kept in its own commit, with the source of the new value named.
