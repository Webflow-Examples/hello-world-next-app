# 4. Hosting is Webflow Cloud, and the application is mounted at the origin root

- Status: **Accepted.** Supersedes the "Hosting" entry under Open decisions in `AGENTS.md`.
- Date: 2026-10-14

## Context

The application was built hosting-neutral on purpose. `AGENTS.md` listed hosting as an open
decision, and `src/shared/config/site.ts` already read its origin from the environment rather
than assuming one.

Webflow is already the CMS through the Data API and the candidate platform for localisation.
Webflow Cloud hosts a Next.js application on the Cloudflare Workers runtime through the
OpenNext adapter, which makes the whole property - pages, CMS and lead capture - one vendor
relationship instead of three.

Taking it has consequences the application cannot opt out of:

| Platform behaviour                                                                                                         | Source                                |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Next runs on Cloudflare Workers via OpenNext, not on Node                                                                  | `environment/framework-customization` |
| `basePath` and `assetPrefix` are generated from the environment's mount path and overwrite anything committed              | `bring-your-own-app`                  |
| Every response `Cache-Control` is replaced with `private, no-cache`; `cache-tag` is stripped                               | `limits`                              |
| Composable caching (`use cache`) is unsupported; ISR and on-demand revalidation are experimental                           | `environment/framework-customization` |
| Node-runtime middleware is unsupported; only Edge middleware runs                                                          | `environment/framework-customization` |
| `next/image` optimizes local images only; external images are passed through                                               | `environment/framework-customization` |
| Worker bundle 10 MB, build output 100 MB compressed, 30 s CPU, 20 s request timeout, 100 env vars, 10 environments per app | `limits`                              |

Two of these were not survivable as the code stood, and are recorded separately in
`docs/adr/0005-cache-components-on-workers.md` and
`docs/adr/0006-next-version-pin-for-opennext.md`.

## Decision

**Webflow Cloud is the hosting target**, and the application is deployed **mounted at the
origin root**, not at a subpath.

The root mount is not a preference. `docs/spec/page-register.md` places the property at `/`,
with locales at `/de/`, `/us/` and `/sa-en/`. Under a subpath mount, `src/app/robots.ts` and
`src/app/sitemap.ts` answer at `/<mount>/robots.txt` and `/<mount>/sitemap/en.xml`, where no
crawler looks, and the legacy 301 map in `src/shared/seo/redirects.ts` targets URLs that do not
exist. A subpath is usable for a staging environment and for nothing that is indexed.

The application nevertheless **reads the mount path at runtime** from
`NEXT_PUBLIC_BASE_PATH`, in `absoluteUrl` in `src/shared/config/site.ts`. Next prefixes `Link`,
`useRouter`, `redirect` and `next/image` by itself; it does not prefix a URL we assemble from a
string, and canonical, hreflang, sitemap entries and the robots host are all assembled from
strings. Without this, a staging environment mounted at `/staging` would advertise production
URLs as the canonicals of its own pages.

The mount path is never read from `next.config`. Webflow Cloud generates its own configuration
at build time and moves ours aside, so `next.config` does not know the value in force.

Deployment is by **push to GitHub**, which the Webflow Cloud GitHub App builds per environment.
The repository remote moved from Bitbucket to GitHub for this reason; the CLI path
(`webflow apps deploy`) remains available and is what a non-GitHub remote would have required.

## Consequences

- **The caching strategy is not ours.** Response `Cache-Control` is overwritten, so TTFB is
  Worker cold start plus render on every request, and the Core Web Vitals budgets in
  `.lighthouserc.json` must be re-measured against a deployed environment rather than against
  `next start`. A budget failure measured locally proves nothing about production, and the
  reverse is equally true.
- **`next build` is no longer the build that ships.** `npm run build:workers` is, and it is the
  only one that exercises the adapter. A change can pass `npm run verify` and still fail on the
  runtime - which is exactly what `cacheComponents` did. Served-HTML verification runs against
  `npm run preview:workers`.
- **Webflow CMS images will not be optimized.** They are external to the app, so `next/image`
  passes them through. Sizing discipline moves to the CMS, or an explicit decision to proxy
  them has to be taken when FE-15 and FE-16 land.
- **The 10 MB worker limit becomes a standing constraint.** The current bundle is far below it,
  but every dependency added to a Server Component now has a hosting cost. The unused
  `i18next-resources-to-backend` dependency should be dropped for this reason.
- **Staging is public.** Webflow Cloud puts no access control on a mount path. Under
  `docs/spec/claims-guardrails.md`, a locale whose claims review has not cleared must not be
  deployed to a staging environment at all, because "staging" is not a private audience.
- **Hosting is no longer hosting-neutral**, and should not be re-neutralised casually. The
  adapter constraints above have shaped `next.config.ts` and `src/shared/i18n/server.ts`;
  moving to a Node host would allow those decisions to be revisited, not require it.
