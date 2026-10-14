# 2. The page register is a plan; a separate list says what is built

- Status: **Accepted.**
- Date: 2026-10-12

## Context

`PAGE_REGISTER` is a verbatim transcription of the estimate's Page & Metadata Register: 51
rows, each with an `Indexation` column stating what the finished page should do. The SEO layer
read it as if it described the deployment.

On a production build and server, that produced:

| Artefact                       | What it said                                       | What was true                                                            |
| ------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------ |
| `/sitemap/en.xml`              | 35 URLs, every one well-formed and absolute        | 34 answered `404`; one route segment exists, `src/app/[locale]/page.tsx` |
| the one URL that resolved, `/` | `<loc>https://compremium.ch/</loc>` — index this   | `<meta name="robots" content="noindex, nofollow">` — do not              |
| `robots.txt`                   | `Sitemap: https://compremium.ch/sitemap/en.xml`    | pointed a crawler at the above                                           |
| `/solution`                    | `301` to `/quantis/st`, per the WS-D migration map | `/quantis/st` answered `404`                                             |

Three tests covered this area and none of them failed. `sitemap › contains only absolute
canonical-origin URLs` checked the _shape_ of each `<loc>`, never that anything was behind it.
`seo.spec.ts:27 › resolves in one hop, with no chain` asserted only that the landing status was
neither `301` nor `308`; a `404` satisfies both. The register's `Indexation` column was doing
work it cannot do: `Index, follow` is a statement about a page that exists.

A sitemap entry is an instruction to a crawler. Pointing 34 of them at `404` wastes crawl
budget, reports as a sitemap error in Search Console, and — on a regulated medical device
property — advertises page structure for pages whose claims nobody has cleared. A `301` onto a
`404` is worse than no redirect: it spends the legacy URL's equity on nothing and reads, to
anyone auditing the map, as a finished migration.

## Decision

`src/shared/config/built-routes.ts` holds `BUILT_ROUTES`: what this deployment actually serves.
It is hand-maintained, no generator writes it, and adding a row is the act of publishing a page.
Each entry carries `indexable`, and a reason whenever indexing is held.

Three consumers read it, so they cannot disagree with each other:

- `sitemapForLocale` filters per URL through `isPublished` — built **and** indexable. The
  register predicates stay as the first gate; they describe the plan, which is still the thing
  that decides whether a built page _may_ be indexed.
- The route segment's `generateMetadata` takes its `robots` from `robotsForPath`, instead of
  hard-coding `noindex`. The page and the sitemap now read one value.
- `next.config.ts` serves `activeRedirects()` — the approved pairs whose destination is built.
  The rest are withheld and named in the build output by `heldRedirects()`.

A publishable locale with nothing published produces no sitemap partition rather than an empty
`<urlset>`, and `robots.txt` advertises the same set.

Today `BUILT_ROUTES` holds one entry, `/`, held `noindex` because its title tag and meta
description have not cleared metadata claims QA. So the correct sitemap is empty, the correct
`robots.txt` advertises no partition, and all three legacy pairs are withheld.

## Consequences

- `/solution`, `/cvp/quantis-cvp` and `/clinical-evidence` answer `404` instead of redirecting
  into one. The pairs stay on record in `LEGACY_REDIRECTS`; each activates by itself the moment
  its target enters `BUILT_ROUTES`, so nothing has to be remembered at cut-over, and until then
  `next build` prints which pairs are withheld and why.
- Building a page is two steps: add the route segment, then add its `BUILT_ROUTES` entry. The
  second step is what publishes it. Forgetting it leaves the page served and uncrawled, which is
  the safe direction to fail in.
- Clearing a page's metadata is one edit: flip `indexable` to `true`. The page's robots meta and
  its sitemap entry both follow from it.
- `src/shared/seo/redirects.ts` is no longer import-free. It is loaded by `next.config.ts`, so
  the constraint is now explicit: no environment access, and no import of a module that has any.
  It imports `built-routes` by relative path, because the `@/` alias is not guaranteed to resolve
  outside the application's module graph.
- The tests assert resolution rather than shape. `e2e/seo.spec.ts` fetches every URL the sitemap
  advertises and requires `200` plus the absence of `noindex`; it also fetches every entry in
  `BUILT_ROUTES` directly, so the sitemap check cannot pass by being empty.
