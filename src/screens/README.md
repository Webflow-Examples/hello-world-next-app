# Screens

The FSD "pages" layer, renamed to avoid colliding with Next.js routing vocabulary. One slice
per page or template from `docs/spec/templates.md`, each with a public API in `index.ts`.

`src/app/**` stays thin: a route segment resolves params, produces metadata and renders a
screen. The screen owns composition; the route owns routing.

A screen may import from `widgets`, `features`, `entities` and `shared`.
