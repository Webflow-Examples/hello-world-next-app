# Routing And Locales

## The URL tree is specified, not designed

`docs/spec/page-register.md` holds every URL. `docs/spec/templates.md` maps templates to
pages.

- Never invent, shorten or prettify a URL. A slug is a claim surface.
- Five silos, click depth at most 3, orphan count 0. The clinical silo sits beside the product silo, never beneath it.
- `reserved` nodes are held in the tree but not created, not indexed, not linked and not in the sitemap.
- Route paths belong in a typed registry, not inlined in components. `src/lib/locales.ts` is the precedent; add the page registry beside it rather than scattering string literals.

## Locale rules

Implemented in `src/lib/locales.ts`, `src/lib/site.ts` and `src/proxy.ts`. Changing any of
them changes a regulatory boundary.

- `/` is the default locale, unprefixed, advertising `x-default` and `en`. `/de` and `/us` are prefixed. `/sa-en` is registered as a shell and is not routed.
- `/en` redirects 308 to `/`. The default locale has exactly one URL.
- No geo-redirection and no `Accept-Language` negotiation, ever. The visitor chooses the locale and the choice is remembered. This hides claims boundaries from readers and crawlers if broken, so it is covered by an e2e test.
- Every locale carries a self-referencing canonical and the complete reciprocal hreflang cluster including `x-default`.
- A locale that cannot yet carry a page serves the substituted slot. Never a 404, never a redirect to another locale.
- Structural parity across locales: the same slots in the same order. Only slot content is substituted.
- Controlled vocabulary and status values stay in English. They are an interface, not copy.

## Localisation mechanics

- `/us` inherits the root structure and substitutes only the gated slots. Design the slot-variant model once; every future page uses it.
- `/de` is transcreated, not translated, and publication is gated on German-language claims review. Build the routes; do not publish copy.
- Webflow's MCP server cannot create localised CMS items. Localised content goes through the Data API directly. Do not plan a flow that depends on the MCP for this.
