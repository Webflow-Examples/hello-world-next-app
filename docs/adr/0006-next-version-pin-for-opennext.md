# 6. Next.js is pinned to 16.3.8 until OpenNext supports 16.4

- Status: **Accepted**, and temporary by design. Follows from
  `docs/adr/0004-hosting-webflow-cloud.md`.
- Date: 2026-10-14

## Context

The project was on Next 16.4.0. Under `@opennextjs/cloudflare` 1.20.11 - the latest release -
the build succeeds and **every** request to the deployed worker fails at startup:

> Error: Unexpected loadManifest(/.next/server/preview-props.json) call!

Next 16.4 added `.next/server/preview-props.json`. The adapter inlines Next's manifests at
build time by globbing files whose names end in `-manifest.json`, and this one does not match,
so the worker throws while constructing the server - before any route is reached. `robots.txt`
answered 500 along with everything else.

This is upstream issue [#1356's subject][issue]; the fix is a one-line change to the glob in
the adapter's `load-manifest.ts`. As of 2026-10-14 the issue and its pull request are both
open, 1.20.11 is the latest published adapter, and 16.4.0 is the only release on the 16.4 line,
so there is no patched version of either side to move to.

Webflow's own Next.js starter declares `"next": "^16.2.6"`, which tells us what the platform is
actually exercised against. The caret means a fresh install of their starter would pull 16.4.0
and hit this too; the platform has not met 16.4 yet, rather than having blessed it.

The project uses nothing from 16.4 specifically. `proxy.ts`, `cacheComponents` and
`partialPrefetching` all exist in 16.3.

[issue]: https://github.com/opennextjs/opennextjs-cloudflare/issues/1355

## Decision

`next` and `eslint-config-next` are pinned to **exactly** `16.3.8`, the last release of the
16.3 line.

Exact, not `^16.3.8`. A caret resolves to 16.4.0 on any fresh install, which reintroduces the
defect in a form that looks like an unrelated outage: every page 500s with no stack naming a
file. The lockfile would hold `npm ci`, but a pin that depends on nobody ever running
`npm install` is not a pin. This also matches how `react` and `react-dom` are already declared
in this repository.

`@opennextjs/cloudflare` is declared as a dependency rather than left to the platform.
Webflow Cloud installs its own adapter when an app does not declare one, and uses the app's
when it does - so declaring it is what makes the version reproducible, and what makes
`npm run build:workers` locally the same build that ships.

## Consequences

- **Next upgrades are blocked on the adapter**, not on Next. Lift the pin when
  `@opennextjs/cloudflare` ships the fix, and verify by building and serving, not by reading
  the changelog: the symptom of getting this wrong is total, and silent until the first
  request.
- **Security patches on the 16.3 line remain available.** 16.3.8 is a patch release and the
  line is still receiving them; this is a pin to a maintained line, not to an abandoned one.
  If that changes before the adapter catches up, the pin becomes a liability and the decision
  has to be reopened.
- **`npm run verify` cannot catch a regression of this kind.** It passed on 16.4.0 while every
  deployed route was failing. Only `npm run build:workers` followed by `npm run preview:workers`
  exercises the adapter, which is why the served-HTML suite is pointed at that server through
  `E2E_BASE_URL` in CI.
