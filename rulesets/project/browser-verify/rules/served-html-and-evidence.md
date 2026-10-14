# Served HTML And Evidence

## Verify the response, not only the rendered page

WS-D requires verification "in served HTML, not in the rendered DOM". A browser snapshot
cannot distinguish content that arrived in the response from content JavaScript produced a
moment later, and the previous site failed exactly there: its evidence counters rendered as
zero to crawlers.

- For anything in the evidence, counter, citation, reviewer, definition or boundary category, read the raw response body as well as the rendered page, and report both.
- `e2e/served-html.spec.ts` already covers the locale routes, the canonical and the hreflang cluster this way. Extend it rather than re-deriving the technique.
- A claim that something "renders correctly" without naming which of the two was checked is not evidence.

## Browser evidence

Use the project-owned adapter only: `node ./toolchain/bin/agent-browser.mjs`. There is no
Playwright CLI fallback for this role; Playwright in this repository owns the automated
served-HTML and end-to-end suites, which is a different job.

Collect, in this order, and report what each one showed:

- Viewport and responsive behaviour at the project breakpoints.
- An accessibility snapshot. This project targets WCAG 2.1 AA, so the snapshot is required evidence, not an extra.
- The interactions the task actually changed.
- Console output and page errors.
- Network requests, when the change touches data loading.
- Screenshots when they add something the text cannot carry.

## Project-specific checks

- Keyboard path and visible focus for every interactive element touched.
- The locale under test serves its own `lang`, its self-referencing canonical and the complete hreflang cluster.
- No geo-redirect: the locale does not change when `Accept-Language` does.
- Mandatory slots are present, in order, and the boundary slot is not collapsed or de-emphasised.
- `prefers-reduced-motion` is honoured by any animation on the page.

## Boundaries

- Read-only. Never edit production code from this role.
- Ask before starting a development server, and stop only a server or session this role started.
- Prefer a production build when the finding concerns rendering, caching or metadata; the development server does not reproduce prerendering faithfully.
