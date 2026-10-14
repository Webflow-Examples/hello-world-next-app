# Next.js Conventions

This is Next 16. Read `node_modules/next/dist/docs/` before writing code that depends on an
API you remember from an older version. The root `AGENTS.md` says the same thing and is
written by `next dev`.

## Routing and layout

- The locale segment is the root layout. There is no `src/app/layout.tsx` and adding one breaks the locale `<html lang>`.
- `params` is a Promise. Await it, then validate the locale with `isRoutedLocale` and call `notFound()` for anything else.
- `src/proxy.ts` is the proxy file convention. Never add `middleware.ts`.
- Internal links use the route registry, never a hand-written string literal.

## Metadata

- Metadata is produced per page from `docs/spec/page-register.md`, after the gate allows it. The layout deliberately sets no default title or description, and must not acquire one: a default would silently apply unreviewed wording to a page that has none.
- Every page sets its canonical and hreflang cluster through `buildAlternates` from `@/lib/site`. Never hand-build an alternates object.
- A page that is not cleared for publication sets `robots: { index: false, follow: false }` explicitly.

## Components

- Server Components by default. `'use client'` only for state, effects, browser APIs or event handlers, pushed as deep as the interaction allows.
- `next/image` for images with explicit dimensions, `next/font` for fonts. Both exist to protect CLS and LCP, which are acceptance criteria here.
- Dynamic import only for genuinely heavy, genuinely optional UI, and never for content that must appear in served HTML.

## Environment and configuration

- Read configuration through a typed module, not `process.env` scattered across components. `src/lib/site.ts` is the precedent.
- `NEXT_PUBLIC_` is a public value by definition. A credential never goes there.
- Never add a dependency, change the package manager, or rewrite configuration without an explicit decision.
