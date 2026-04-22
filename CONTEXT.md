# CONTEXT — hello-world-next-app

Orientation for contributors to this **Next.js** Hello World example for
[Webflow Cloud](https://developers.webflow.com/webflow-cloud). Keep this file
current when structure or workflows change — the repo should stay readable
end-to-end.

## What this is

A minimal, branded **Hello, world** page built with **Next.js 16 (App Router)**
and deployed on Cloudflare Workers via Webflow Cloud. This is the **vanilla**
variant (no bindings — UI only).

The page shows a Webflow brand hero, gradient logo, and curated doc cards
pointing at the Webflow Cloud documentation.

## Stack

- Framework: **Next.js 16** (App Router, React 19)
- Styling: Tailwind v4 + `wf-*` brand tokens (see `src/app/globals.css`)
- Deploy target: Cloudflare Workers via **Webflow Cloud** (`wrangler.json`)

## Repo layout

```
src/app/
  page.tsx           ← page content, hero, DOC_LINKS
  layout.tsx         ← root layout + metadata
  globals.css        ← Tailwind + .wf-* design tokens
  components/
    WebflowLogo.tsx
    DocCard.tsx
next.config.ts
package.json
tsconfig.json
```

## Running locally

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
```

Build output lands in `.next/`.

## Editing the UI

All UI lives in a single page plus one stylesheet. Keep changes there so the
app stays readable top-to-bottom.

- **Page content (hero, CTAs, doc cards):** `src/app/page.tsx`
- **Doc card list:** search for `DOC_LINKS` in `src/app/page.tsx`
- **Brand tokens and `.wf-*` styles:** `src/app/globals.css`

## Deploying to Webflow Cloud

1. Push this repo to GitHub.
2. In your Webflow Cloud project, connect the repo and pick a mount path
   (e.g. `/my-app`). The app runs under any prefix.
3. Webflow Cloud builds with `npm run build` on deploy.

See [Deployments](https://developers.webflow.com/webflow-cloud/deployments)
and [Environments](https://developers.webflow.com/webflow-cloud/environments).

## Contributing

- Keep the **Webflow brand tone**: blue gradient (`#4353FF` → `#146EF5`), dark
  background, minimal copy. Reuse the existing `.wf-*` CSS tokens.
- This is a Hello World. Do **not** add extra pages, client-state libraries,
  or UI kits. Small and readable beats clever.
- Run `npm run build` before opening a PR.
- Keep **cross-app parity**: if you change shared copy or doc links, update
  the sibling `hello-world-*-app[-bindings]` apps too.

## Related docs

- [Webflow Cloud overview](https://developers.webflow.com/webflow-cloud)
- [Getting started](https://developers.webflow.com/webflow-cloud/getting-started)
- [Storing data (SQLite, KV, R2)](https://developers.webflow.com/webflow-cloud/storing-data/overview)
- [Environments](https://developers.webflow.com/webflow-cloud/environments)
- [Deployments](https://developers.webflow.com/webflow-cloud/deployments)
- [Configuration](https://developers.webflow.com/webflow-cloud/environment/configuration)
- [Node.js compatibility](https://developers.webflow.com/webflow-cloud/environment/nodejs-compatibility)
- [Limits](https://developers.webflow.com/webflow-cloud/limits)
