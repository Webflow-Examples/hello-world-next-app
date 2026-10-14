# compremium.ch

Rebuild of compremium.ch: Next.js App Router frontend, Webflow as a headless CMS through the
Data API, HubSpot for lead capture.

This is a regulated medical device property. Before writing any copy, heading, slug, alt text
or schema value, read [`docs/spec/claims-guardrails.md`](docs/spec/claims-guardrails.md).

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` for anything other than
production. A preview deployment that leaves it unset emits canonicals pointing at the live
domain.

## Scripts

| Script                                    | Purpose                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------ |
| `npm run dev`                             | Development server                                                       |
| `npm run build` / `npm run start`         | Production build and server                                              |
| `npm run lint` / `npm run lint:fix`       | ESLint. The accelerator's Stop hook runs `lint`, so it must stay working |
| `npm run typecheck`                       | `tsc --noEmit`                                                           |
| `npm run format` / `npm run format:check` | Prettier                                                                 |
| `npm run test` / `npm run test:watch`     | Vitest + Testing Library                                                 |
| `npm run test:e2e`                        | Production build, then Playwright against served HTML                    |
| `npm run verify`                          | lint + typecheck + test                                                  |
| `npm run build:workers`                   | Build through the OpenNext adapter - the artifact Webflow Cloud serves   |
| `npm run preview:workers`                 | Serve that build on the Workers runtime at `:3123`                       |

## Hosting

The property is deployed on **Webflow Cloud**, which runs this app on Cloudflare Workers
through the OpenNext adapter, mounted at the origin root. See
[`docs/adr/0004-hosting-webflow-cloud.md`](docs/adr/0004-hosting-webflow-cloud.md) and
[`docs/webflow-cloud-integration-plan.md`](docs/webflow-cloud-integration-plan.md).

`next build` is not the build that ships. Two constraints follow from the runtime and are not
negotiable without re-reading the ADRs: `cacheComponents` is off because it hangs every React
route on Workers (ADR 0005), and `next` is pinned to exactly `16.3.8` because 16.4 breaks the
adapter outright (ADR 0006).

To reproduce production locally:

```bash
npm run build:workers
npm run preview:workers
# then, in another shell:
E2E_BASE_URL=http://127.0.0.1:3123 npx playwright test
```

## CI

`.github/workflows/verify.yml` is the gate: `npm run verify`, then served-HTML checks **on the
Workers runtime**, then Core Web Vitals. The served-HTML job runs against `build:workers` on
purpose - a build has passed `verify` and `next start` here while every route on Workers
answered 500.

Lighthouse measures the Node build and cannot predict production TTFB: Webflow Cloud replaces
every response `Cache-Control` with `private, no-cache`. Acceptance is measured on a deployed
environment. To run the budgets locally, point `CHROME_PATH` at a Chrome binary and run
`npx @lhci/cli autorun` after a build.

`bitbucket-pipelines.yml` is the previous remote's definition, kept until the GitHub workflow
has run green on a real pull request, then deleted.

## Specification

[`docs/spec/`](docs/spec/README.md) is the source of truth for routing, templates, metadata,
schema and locales. Most of it was transcribed from the estimate spreadsheets in `docs/` at
project start; the spreadsheets remain as provenance and there is nothing to re-run. Every
title tag, meta description, H1 and slug is a claim surface under QARA/Regulatory and
Clinical/Medical review, so changing one is a specification change, not a text edit.

## Conventions

**Feature-Sliced Design.** The FSD `pages` layer is named `screens` so it does not collide
with Next.js routing vocabulary.

```text
src/app       Next.js App Router; plays the role of the FSD app layer. Stays thin.
src/screens   One slice per page or template.
src/widgets   Composite blocks.
src/features  User interactions with business value.
src/entities  Business entities.
src/shared    UI kit, config, i18n, lib.
```

Imports go downward only: `app -> screens -> widgets -> features -> entities -> shared`.
ESLint enforces the direction. Slices are imported through their `index.ts`.

**Routes come from the page register.** `src/shared/config/page-register.ts` holds the rows
transcribed from the spreadsheet. Never write a URL as a string literal; a slug changes only as
a reviewed specification change. The file deliberately omits H1, title tag and meta
description: those are drafted claim surfaces and must not sit one import away from being
rendered. The register is the _plan_ — `built-routes.ts` is what this deployment serves.

**i18next covers interface strings only.** Page content comes from the CMS. Server Components
use `getTranslation` from `@/shared/i18n`; Client Components get resources from the server
through `I18nProvider`. There is no language detection - the locale comes from routing.

**Mantine is imported only in `src/shared/`.** Application code imports UI from `@/shared/ui`
and Mantine wiring from `@/shared/theme`. ESLint enforces this. See
[`src/shared/ui/mantine.ts`](src/shared/ui/mantine.ts) for the reasoning, including why the
compound form `List.Item` breaks in a Server Component.

**Locales.** `/` (x-default, en), `/de`, `/us` are routed; `/sa-en` is registered as a shell
and is not routed. The default locale is unprefixed and `/en` redirects to `/`.
`src/proxy.ts` performs no geo detection of any kind - the locale is the visitor's choice and
nothing else. Routing lives in [`src/lib/locales.ts`](src/lib/locales.ts); the canonical and
hreflang cluster in [`src/lib/site.ts`](src/lib/site.ts).

**SEO artefacts.** `src/shared/seo` owns the structured-data builders, the stable `@id`
registry for the entity graph, the sitemap rules and the legacy redirect map. A clinical page
cannot be built without its author, medical reviewer, publication date and review date: the
builders refuse, which is the CI check WS-D asks for. Sitemaps are partitioned per locale and
only a locale whose publication gate has cleared gets one, so today that is the root locale
alone. URL form is an open decision — see
[docs/adr/0001-url-trailing-slash.md](docs/adr/0001-url-trailing-slash.md).

**Analytics.** GTM with Consent Mode v2 defaults, all denied except security storage. Nothing
loads until `NEXT_PUBLIC_GTM_ID` is set, and no consent management platform has been chosen
yet.

**Server rendering.** Evidence, counters, citations, reviewer fields and definition blocks
must be present in the served HTML, not produced client-side. The previous site shipped
JavaScript-only counters that reached crawlers as zero. `e2e/served-html.spec.ts` reads raw
responses for exactly this reason.

## Agent workflow

The repository carries the Frontend Accelerator Toolset: `.claude/`, `.agents/`, `rulesets/`
and `toolchain/` are installed payload, verified against the SHA-256 receipt in
`.frontend-accelerator/installation.json`. ESLint and Prettier ignore all of it - reformatting
any payload file makes `frontend-accelerator update` report a conflict and refuse to write.

Readiness check:

```bash
node ./toolchain/bin/doctor.mjs --json
```

Hooks need to be reviewed once per machine through `/hooks` in Claude Code, after which a new
session turns the hook status from `PENDING_ACTIVATION` into `ACTIVE`. Until then Doctor
reports `DEGRADED`, which is expected and does not block anything else.

MCP servers are configured in `.mcp.json` and documented in [docs/mcp.md](docs/mcp.md):
Playwright, Mantine and Chrome DevTools. Three browser-ish tools exist and they are not
interchangeable — `browser-verify` uses only the accelerator's own adapter, Playwright MCP is
for authoring e2e specs, and Chrome DevTools MCP is for Core Web Vitals traces. Figma is
connected at the account level. Webflow and HubSpot wait on their accounts.

Invoke one command at a time, for example `/requirements-analyst`, `/architect` or `/coder`.
Each runs an isolated agent, reports evidence and stops; it never starts the next one.
Project-specific rules live in `rulesets/project/`.

## Pending

Webflow and HubSpot accounts, the WS-C Figma handoff with the real design tokens, and the
hosting decision. The application is hosting-neutral until then.
