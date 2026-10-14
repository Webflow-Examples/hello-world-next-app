# SEO And Locale Invariants

Most defects on this property are invisible in the UI: a missing hreflang, a canonical
pointing at a preview origin, a counter that only exists after hydration, a reordered slot.
They surface in search results and AI answers, weeks later. Tests are the only early warning.

## Split by tool

- Vitest for pure logic: URL construction, the hreflang cluster, locale resolution, schema builders, validation of CMS payloads.
- Playwright against a production build for anything whose correctness depends on what the server actually sent.

## Invariants worth a test

- Every routed locale emits a self-referencing canonical and the complete reciprocal hreflang cluster including `x-default`. Covered in `src/lib/site.test.ts`; extend it when the locale set changes.
- The default locale is unprefixed and `/en` redirects to `/`.
- `Accept-Language` does not change which locale is served.
- A locale registered as a shell is not routed.
- A `reserved` page is not reachable, not linked and not in the sitemap.
- Mandatory slots are present in the served HTML, in the specified order, for every template that requires them.
- A page that is not cleared for publication is `noindex`.
- Structured data validates and still carries the reviewer and citation fields. WS-D requires this as a CI regression check so "a template change cannot silently drop a reviewer or a citation field".
- Redirect rules resolve in one hop, with no chains and no loops.

## How to write them

- Assert on the raw response body for server-rendering invariants. A DOM assertion passes for content that arrived client-side, which is the bug.
- Test behaviour and contracts, not implementation detail. A test that breaks when a class name changes costs more than it protects.
- Never put approved clinical copy in a fixture. Use obviously synthetic strings, or assert on structure rather than wording.
