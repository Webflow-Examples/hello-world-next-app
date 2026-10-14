# 5. `cacheComponents` is off, because it hangs every React route on the Workers runtime

- Status: **Accepted**, and expected to be revisited. Follows from
  `docs/adr/0004-hosting-webflow-cloud.md`.
- Date: 2026-10-14

## Context

`next.config.ts` carried `cacheComponents: true` and `partialPrefetching: true`, and
`src/shared/i18n/server.ts` used the `use cache` directive that the first flag enables.

Webflow Cloud's framework documentation lists, under Next.js limitations:

> **Composable caching:** The `use cache` directive isn't yet supported

"Isn't yet supported" reads like a feature that quietly does nothing. It is not what happens.

Measured on `@opennextjs/cloudflare` 1.20.11, Next 16.3.8, `wrangler dev --local`:

| URL                 | With `cacheComponents` | Without it | `next start`, same build |
| ------------------- | ---------------------- | ---------- | ------------------------ |
| `/`                 | 500                    | 200        | 200                      |
| `/de`               | 500                    | 200        | 200                      |
| `/us`               | 500                    | 200        | 200                      |
| `/nonexistent-page` | 500                    | 404        | 404                      |
| `/en`               | 308                    | 308        | 308                      |
| `/robots.txt`       | 200                    | 200        | 200                      |

The runtime log carries no stack, only:

> Uncaught Error: The Workers runtime canceled this request because it detected that your
> Worker's code had hung and would never generate a response.

The two rows that survive are the two that render no React: the proxy answers `/en` before the
server function is reached, and `robots.txt` is a route handler. Everything that renders a
component hangs. That is what made the cause findable at all - a failure that spared exactly
the non-rendering routes pointed at rendering, not at routing, i18n, or configuration.

Two hypotheses were tested and rejected before this one. The template-literal dynamic import in
`src/shared/i18n/server.ts` was replaced with a statically analysable registry - correct in its
own right on the Workers runtime, and no effect on the hang. Pinning Next to 16.3.8 fixed a
different, real defect (`docs/adr/0006-next-version-pin-for-opennext.md`) and turned
`/robots.txt` from 500 into 200, and the React routes still hung.

`partialPrefetching` is not a separate decision. Next refuses to build without the other flag:

> Error: `partialPrefetching` requires `cacheComponents` to be enabled.

## Decision

Both flags are removed from `next.config.ts`, and `use cache` is removed from `loadResources`
in `src/shared/i18n/server.ts`.

The loading stays in a function of its own rather than being inlined into `getTranslation`, so
restoring the directive is a one-line change when the platform supports it. The i18next
instance is deliberately outside it: the instance is stateful and must not be shared between
renders.

Restore both flags **together**, and only after a preview deployment proves React routes
render. The condition is OpenNext shipping composable-caching support and Webflow Cloud picking
it up - neither is in hand, and the upstream issue is open.

## Consequences

- **No partial prerendering and no partial prefetching.** The locale routes changed from
  `◐ (Partial Prerender)` to `● (SSG)` in the build output: they are now fully prerendered
  static HTML. For this property that is closer to what WS-D asks for, not further from it -
  `docs/spec/seo-requirements.md` requires evidence, counters and definition blocks to be in
  the initial HTML response, and a fully prerendered page satisfies that unconditionally.
- **The cost lands later, not now.** Partial prerendering earns its keep when a page mixes
  cached shell with per-request content. The homepage has no such content today. FE-16's news
  carousel and anything reading the Webflow Data API will, and that is the point at which this
  decision should be re-examined rather than assumed.
- **Uncached async work in a Server Component is no longer a prerender error.** With
  `cacheComponents` on, Next refuses to prerender a component that awaits uncached work; off,
  it renders dynamically instead. The guardrail that kept data fetching honest is gone, so a
  slow upstream now shows up as a slow page rather than as a build failure. The 20 s request
  timeout and 30 s CPU limit are the remaining backstop, and they are much further out.
- **This is the project's first hosting-shaped constraint on application code.** It will not be
  the last; `docs/adr/0004-hosting-webflow-cloud.md` lists the others that are coming.
