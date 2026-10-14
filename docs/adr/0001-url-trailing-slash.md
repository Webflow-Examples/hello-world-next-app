# 1. URL trailing slash

- Status: **Open.** A provisional form is implemented so the build is self-consistent; the decision belongs to the SEO & AEO Lead.
- Date: 2026-10-09

## Context

`docs/spec/page-register.md` uses two URL notations:

| Kind          | Example                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------- |
| Section index | `/quantis/`, `/quantis/st/`, `/company/`, `/evidence/`, `/clinical-applications/ortho-trauma/` |
| Leaf          | `/why-quantify`, `/quantis/st/how-it-works`, `/company/quality-and-regulatory`                 |

Next.js cannot serve both. `trailingSlash` is a single global switch: either every URL carries
a trailing slash or none does.

Left at the framework default (`false`), `/quantis/st/` answers `308` to `/quantis/st`. This
was not theoretical. The e2e check for redirect chains caught it: the legacy redirect
`/solution -> /quantis/st/` became a two-hop chain, which is exactly what WS-D requires be
found before launch ("chain and loop QA on staging and after launch"). The same defect was
also putting redirecting URLs into the sitemap, where only final canonical URLs belong.

## Decision

Provisionally, the application serves and publishes the **slashless** form. A single helper,
`canonicalPath` in `src/shared/config/locales.ts`, normalises every URL that leaves the
application: canonical, hreflang cluster, sitemap entries and redirect destinations. No two
of them can disagree.

This form was chosen because it needs no configuration and matches the notation the register
uses for the majority of its entries.

## Consequences

- Hub URLs differ from the register by one character: `/quantis/st` rather than `/quantis/st/`.
- `canonicalPath` is the single point of change. Switching to `trailingSlash: true` means
  changing that helper, setting the flag in `next.config.ts`, and updating the tests that pin
  the current form. No call site changes.
- Tests pin the current behaviour: `src/shared/config/site.test.ts` for the helper,
  `src/shared/seo/redirects.test.ts` for destinations that would redirect again, and
  `e2e/seo.spec.ts` for the one-hop guarantee against a running server.

## What must be decided, and by whom

The SEO & AEO Lead must confirm which form the **legacy site** serves today.

A migration that changes the shape of every hub URL loses the equity of those URLs unless the
redirect map covers both forms. If the legacy site uses trailing slashes, the right answer is
probably `trailingSlash: true` plus leaf-URL adjustments in the register, not this.

## Alternatives considered

- **`trailingSlash: true`.** Serves `/quantis/st/` as the register writes it, but adds a slash
  to every leaf: `/why-quantify/`, which the register does not write.
- **Per-route control.** Not available in Next.js; the switch is global.
- **Rewrites that serve both forms.** Two URLs for one page, which is the duplicate-content
  problem the self-referencing canonical rule exists to prevent.
