<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Read this before writing anything

compremium.ch presents a **regulated medical device**. Wording on this site is governed by
market-specific Instructions for Use and cleared by QARA/Regulatory and Clinical/Medical.

**Never invent, paraphrase, translate, shorten or improve clinical, evidence, regulatory or
economic wording.** Copy the approved string exactly, or stop and say what is missing. This
covers body copy, headings, title tags, meta descriptions, URL slugs, alt text, schema values,
button and form labels, error messages, breadcrumbs, OpenGraph fields and video transcripts.

A title tag, meta description or slug is a claim surface: it is quoted verbatim in search
results and in AI answers, detached from the page that qualified it.

The full rules are `docs/spec/claims-guardrails.md`. Read it before producing any user-visible
string. When a required string does not exist, report the gap — do not fill it.

## Where the truth is

| Question                                                              | File                             |
| --------------------------------------------------------------------- | -------------------------------- |
| What may I write, and when?                                           | `docs/spec/claims-guardrails.md` |
| What pages exist, at which URL, on which template, behind which gate? | `docs/spec/page-register.md`     |
| Which slots are mandatory, and in what order?                         | `docs/spec/templates.md`         |
| What is permitted in each market?                                     | `docs/spec/locales.md`           |
| What must the SEO implementation do?                                  | `docs/spec/seo-requirements.md`  |
| What is our scope, and what is it waiting on?                         | `docs/spec/fe-scope.md`          |
| How do I work in this repository?                                     | `rulesets/project/`              |
| Why is something the way it is?                                       | `docs/adr/`                      |

Most of `docs/spec/` was transcribed from the spreadsheets in `docs/` at project start. The
spreadsheets are provenance now, not a build input. Changing a metadata value is a
specification change under claims review, never a text edit.

## Non-negotiables

- **Gates.** Every page carries one. `LOW` may be produced now; `MEDIUM` needs Product/Technical confirmation; `HARD` is blocked until the specific wording is cleared; `RESERVED` is not built, not indexed, not linked.
- **No placeholder copy** on any page with a clinical, evidence, regulatory or economic slot — not behind a flag, not in a preview deployment.
- **Slots are substituted, never deleted**, and never reordered. The boundary slot and the definition block cannot move below a product block.
- **No permission crosses a market.** Wording approved for `/us/` is prohibited on `/` and `/de/`, and the reverse.
- **No geo-redirection and no `Accept-Language` negotiation**, ever. The visitor chooses the locale.
- **Served HTML.** Evidence, counters, citations, reviewer fields and definition blocks must be in the initial HTML response. The previous site shipped JavaScript-only counters that reached crawlers as zero.
- **Mantine is imported only in `src/shared/`.** Application code uses `@/shared/ui` and `@/shared/theme`.
- **FSD layer direction**: `app -> screens -> widgets -> features -> entities -> shared`. Downward only.
- **Never edit an accelerator payload file** (`.claude/`, `.agents/`, `rulesets/common/`, `rulesets/framework/`, `toolchain/`). `rulesets/project/` is ours.
- **WCAG 2.1 AA** is a delivery requirement. Mantine's defaults do not all pass; measure.
- **No new dependency, package-manager change or configuration rewrite** without an explicit decision.

ESLint enforces the Mantine boundary, the FSD direction and the RSC-safe JSX form. Never add an
`eslint-disable` to get past one of them.

## How to work

```bash
npm run dev          # development server
npm run verify       # lint + typecheck + unit tests - the gate
npm run test:e2e     # production build, then Playwright against served HTML
```

Run `npm run verify` before reporting work complete. Run `npm run test:e2e` as well when
routing, metadata, canonicals, hreflang or server rendering changed.

One accelerator command at a time: `/requirements-analyst`, `/architect`, `/coder`,
`/code-reviewer`, `/browser-verify`, `/verify`. Each runs an isolated agent, reports evidence
and stops. It may recommend the next command; it never starts it.

`browser-verify` uses only `node ./toolchain/bin/agent-browser.mjs`. Playwright MCP is for
authoring specs; Chrome DevTools MCP is for performance traces. See `docs/mcp.md`.

## Git

The remote is **GitHub** (`asipenka-kanstantsin/compremium_`). It moved from Bitbucket when
hosting was settled: Webflow Cloud builds and deploys from a connected GitHub repository, one
branch per environment, so **a push to a deployed branch is a deployment**. Treat it as one.

This repository began as Webflow's `hello-world-next-app` starter (branch `v16`), which is why
its history opens with commits nobody here wrote. The starter's demo page, its Tailwind setup
and the Webflow brand assets were removed when this project was ported in; what it still
provides is the repository Webflow Cloud connects to. The predecessor repository
`asipenka-kanstantsin/compremium` holds the history from before the port.

`main` is the integration branch; branch before committing. The checklist is
`docs/pull-request-checklist.md`. `bitbucket-pipelines.yml` is kept until the GitHub Actions
workflow has run green on a real pull request, then removed - two CI definitions that can
disagree about what passing means is the trap `npm run verify` exists to prevent.

## Open decisions

Do not resolve these silently. If your work depends on one, say so and stop.

- ~~Hosting~~ — settled: Webflow Cloud, mounted at the origin root. See
  `docs/adr/0004-hosting-webflow-cloud.md`, and `0005`/`0006` for what it cost. Two things it
  opened: whether Webflow Localize or this application serves `/de/` and `/us/` (they cannot
  both own those folders), and the Webflow plan tier, which sets the limits and log retention.
- URL trailing slash — see `docs/adr/0001-url-trailing-slash.md`.
- Whether the register's 23 template names are 23 templates or variants of the 9 that carry the metadata pattern system.
- Webflow plan tier, and therefore CMS collection and locale limits.
- The WS-C design tokens. `src/shared/theme/theme.ts` is a skeleton of `TODO(WS-C)` entries.
- No consent management platform has been selected.
