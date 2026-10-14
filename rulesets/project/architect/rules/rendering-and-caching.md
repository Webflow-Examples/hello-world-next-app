# Rendering And Caching

## Server rendering is a search requirement, not a preference

WS-D records that the previous site's evidence counters were JavaScript-only and reached
crawlers and AI answer engines as zero. Acceptance is defined "in served HTML, not in the
rendered DOM".

- Evidence figures, citations, reviewer and review-date fields, definition blocks, boundary slots and answer-first blocks must be present in the initial HTML response, for every locale.
- Never place any of them behind `useEffect`, a client-side fetch, an intersection observer, a tab that mounts on click, or a dynamic import without a server-rendered fallback.
- Prefer Server Components. Add `'use client'` only for state, effects, browser APIs or event handlers, and push the boundary as deep as the interaction allows.

## Rendering strategy by page kind

Decide per template, not per page, and record the decision in `specs/architecture.md`.

- Pages whose content is fixed at build time are static.
- Pages backed by the Webflow CMS are statically generated and revalidated. Choose revalidation by content type; a gated clinical page must not go stale in a way that outlives a claims change.
- Never make a page dynamic merely to avoid thinking about cache invalidation. A dynamic page costs field Core Web Vitals, which are measured per template.

## Cache Components

`next.config.ts` has `cacheComponents: true`. This is the Next 16 caching model, not the
pre-16 defaults.

- Read `node_modules/next/dist/docs/` before relying on remembered caching behaviour. The APIs in this version differ from older Next.
- Dynamic data access must sit inside an explicit cache or suspense boundary. A build error here is the model working, not an obstacle to route around.
- Never disable `cacheComponents` to make something compile. If it genuinely does not fit, raise it as an architecture decision with the failing case.

## Core Web Vitals

- LCP, INP and CLS pass "measured on the template, not on a single sample page", across the nine templates that carry the metadata pattern system.
- Budget before building: a looping hero video, a carousel, GSAP and an embedded video player are the known heavy items in this brief.
- Any animation honours `prefers-reduced-motion`. The theme already sets `respectReducedMotion`.
