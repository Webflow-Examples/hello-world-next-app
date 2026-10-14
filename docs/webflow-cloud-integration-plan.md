# Webflow Cloud integration

- Status: **Implemented and verified locally.** Not yet deployed - no Webflow Cloud app or
  environment exists for this repository yet.
- Date: 2026-10-14
- Decisions: `docs/adr/0004-hosting-webflow-cloud.md`,
  `docs/adr/0005-cache-components-on-workers.md`,
  `docs/adr/0006-next-version-pin-for-opennext.md`
- Source: `https://developers.webflow.com/webflow-cloud/` (bring-your-own-app,
  environment/configuration, environment/framework-customization, environments, limits,
  `cli/command-reference`, `cli/agent-workflows`), read 2026-10-14.

## How it works

Webflow Cloud runs this Next.js app on **Cloudflare Workers** through the **OpenNext adapter**.
A connected GitHub repository is built per environment, one branch each, at a mount path. We
mount at the origin root, because the page register puts the property there.

The builder detects the framework, generates the adapter and platform configuration, and sets
`basePath`/`assetPrefix` from the mount path at build time, overwriting anything committed.
What we commit is only what the app itself cares about.

## The repository move

This project now lives in `asipenka-kanstantsin/compremium_`, which started as Webflow's
`hello-world-next-app` starter on branch `v16`. The application, the specification, the
accelerator payload, the tasks and the CI definition were ported into it; the starter's demo
page, its Tailwind setup and the Webflow brand assets (`src/app/icon.svg`, `public/*.svg`) were
removed, because none of them is ours to ship on a Compremium domain.

What the starter contributed in the end is the repository Webflow Cloud connects to, not the
configuration: its `next` was `^16.2.6`, which resolves to the 16.4.0 that breaks the adapter,
and it carried no `wrangler.json`, no `open-next.config.ts` and no `webflow.json`. Those came
from the port, already verified.

One consequence worth stating: the property currently ships **no favicon**. The starter's was
the Webflow brand mark and had to go, and no approved Compremium asset exists. Do not
substitute one - it is a brand asset, and WS-C has not delivered it.

## What changed in this repository

| File                                                 | Change                                                                                                                                                            | Why                                                                                                                                                                             |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`                                       | `@opennextjs/cloudflare` dependency, `wrangler` devDependency; `next`/`eslint-config-next` pinned to exactly `16.3.8`; `build:workers`, `preview:workers` scripts | Declaring the adapter is what makes the deployed build reproducible locally. ADR 0006 for the pin.                                                                              |
| `open-next.config.ts`                                | New, `defineCloudflareConfig()`                                                                                                                                   | Webflow generates one when absent, but without it `opennextjs-cloudflare build` refuses to run locally - and a build only the platform can perform is a build nobody can debug. |
| `wrangler.json`                                      | New: `name`, `compatibility_date`, `nodejs_compat`, worker entry and assets                                                                                       | Required by the local adapter build. Webflow reads only `name`, `compatibility_date` and storage bindings; the rest is passed through and ignored.                              |
| `webflow.json`                                       | New: `{"cloud": {"framework": "nextjs"}}`                                                                                                                         | Pins framework detection rather than leaving it to inference.                                                                                                                   |
| `next.config.ts`                                     | `cacheComponents` and `partialPrefetching` removed                                                                                                                | They hang every React route on Workers. ADR 0005.                                                                                                                               |
| `src/shared/i18n/server.ts`                          | `use cache` removed; template-literal dynamic import replaced with a statically analysable registry                                                               | The directive follows `cacheComponents`. The import had to go regardless: a module specifier built at runtime cannot be resolved on Workers.                                    |
| `src/shared/config/site.ts`                          | `absoluteUrl` prefixes `NEXT_PUBLIC_BASE_PATH`                                                                                                                    | Next prefixes its own navigation primitives, not URLs we assemble from strings - and canonical, hreflang, sitemap and the robots host are all assembled from strings.           |
| `src/shared/config/site.test.ts`                     | Mount-path cases                                                                                                                                                  | A canonical that omits the mount path points at a 404.                                                                                                                          |
| `eslint.config.mjs`, `.gitignore`, `.prettierignore` | `.open-next/`, `.wrangler/` ignored                                                                                                                               | The adapter writes ~155k lines of generated JavaScript; linting it buried our own output.                                                                                       |
| `.env.example`                                       | `NEXT_PUBLIC_BASE_PATH` documented                                                                                                                                |                                                                                                                                                                                 |
| `.github/workflows/verify.yml`                       | New                                                                                                                                                               | The remote moved to GitHub and had no CI. Served-HTML now runs on Workers, not on `next start`.                                                                                 |
| `AGENTS.md`                                          | Remote and the hosting open decision corrected                                                                                                                    |                                                                                                                                                                                 |

## Verification

Measured locally on `@opennextjs/cloudflare` 1.20.11, `wrangler` 4.151.0, Next 16.3.8,
`wrangler dev --local`.

| Check                                                             | Result                                                             |
| ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| `npm run verify` (lint, typecheck, 98 unit tests - 5 of them new) | pass                                                               |
| `npx playwright test` against **Workers** (`E2E_BASE_URL`)        | 30/30 pass                                                         |
| `npm run test:e2e` against **Node** (`next start`)                | 30/30 pass                                                         |
| `/`, `/de`, `/us` on Workers                                      | 200, `lang` = `en`, `de`, `en-US`                                  |
| `/en` on Workers                                                  | 308 to `/`                                                         |
| `/nonexistent-page` on Workers                                    | 404                                                                |
| `/robots.txt` on Workers                                          | 200, advertises no partition - matching the uncleared locale gates |
| canonical + full hreflang cluster in served HTML on Workers       | present, reciprocal                                                |

Route output changed from `◐ (Partial Prerender)` to `● (SSG)` for the locale routes: they are
now fully prerendered static HTML, which satisfies the served-HTML requirement unconditionally.

**Not verified:** anything that needs a deployed environment. See below.

## What is left, and who it needs

### Needs a Webflow account action

1. **Create the app and environments.** Connect the GitHub repository, install the Webflow
   Cloud GitHub App, set the production mount path to `/` and a staging environment to its own
   path. Mount paths must be unique per environment within an app.
2. **Environment variables.** `NEXT_PUBLIC_SITE_URL` per environment - a staging environment
   that inherits the production value advertises production canonicals. `NEXT_PUBLIC_BASE_PATH`
   on any environment not mounted at the root. `WEBFLOW_SITE_ID`, `WEBFLOW_API_TOKEN`,
   `HUBSPOT_*` as **Secret Variable**; never mark a `NEXT_PUBLIC_*` value secret, since it is
   inlined into client JavaScript.
3. **Plan tier.** Sets the worker limits, storage caps and log retention (1 hour on
   Starter/Basic, 1 day on CMS/Business, 3 days on Enterprise). Still open in `AGENTS.md`.
4. **First deploy, then re-measure Core Web Vitals** on the deployed environment. Webflow Cloud
   replaces every response `Cache-Control` with `private, no-cache`, so the lab numbers in CI
   do not predict production TTFB.

### Needs a decision

5. **Who serves `/de/` and `/us/`** - this application or Webflow Localize. They cannot both
   own those folders, and `docs/Compremium — требования к локализации на Webflow.md` evaluates
   Localize for exactly those paths. Blocks FE-02 beyond the scaffold.

### Carried, with a trigger

6. **Lift the Next pin** when `@opennextjs/cloudflare` ships the `preview-props.json` fix
   (upstream issue #1355). Verify by serving, not by changelog.
7. **Restore `cacheComponents`** when composable caching is supported, and only after a preview
   deployment proves React routes render. Re-examine at FE-16, when the first per-request
   content lands.
8. **Drop `i18next-resources-to-backend`.** It is declared and imported nowhere - it predates
   this work - and every unused dependency now has a 10 MB worker budget cost.
9. **Remove `bitbucket-pipelines.yml`** once the GitHub workflow has run green on a real pull
   request.
10. **Webflow CMS images will not be optimized** by `next/image` - they are external. Decide at
    FE-15/FE-16 whether to size them in the CMS or proxy them.

## Constraints to design against

- **Caching is not ours.** Response `Cache-Control` is overwritten; `cache-tag` is stripped;
  request `Cache-Control` is dropped. Standard invalidation does not work.
- **ISR and on-demand revalidation are experimental.** With Webflow CMS content arriving via
  the Data API, the realistic options are per-request fetching or a redeploy on CMS publish.
- **6 simultaneous outgoing requests**, 1,000 subrequests per request. A page fanning out over
  several CMS collections will serialise.
- **Edge runtime only.** API route handlers need `export const runtime = 'edge'`. Use `fetch`,
  never a Node HTTP client such as `axios`. Node APIs are partially supported.
- **Limits:** worker bundle 10 MB, build output 100 MB compressed, 128 MB memory, 30 s CPU,
  20 s request timeout, 100 env vars, 10 environments per app.
- **Node-runtime middleware is unsupported.** `src/proxy.ts` currently builds and runs, but the
  adapter warns on every build that Node middleware support is "experimental … not officially
  maintained", and Webflow documents only Edge middleware as supported. It works today and is
  verified above; it is the most likely thing to break on an adapter upgrade, and all locale
  routing lives in it.
- **Staging is public.** No access control on a mount path. An uncleared locale must not be
  deployed to one.
- **OpenNext warns it is not fully supported on Windows.** The builds above worked, but CI on
  Linux is the authority.
