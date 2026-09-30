# hello-world-next-app

A minimal **Next.js** starter deployed on [**Webflow Cloud**](https://webflow.com/cloud).

This is the vanilla variant — it's the exact output of `npx create-next-app@latest`, styled with a branded landing page and a few doc links to get you going.

> Looking for the variant with Cloudflare bindings (D1, R2, KV)?
> See [`hello-world-next-app-bindings`](https://github.com/Webflow-Examples/hello-world-next-app-bindings).

[![Deploy to Webflow](https://webflow.com/img/deploy-dark.svg)](https://webflow.com/dashboard/cloud/deploy?repo=https://github.com/Webflow-Examples/hello-world-next-app)

## Quickstart

```bash
# Install
npm install

# Run locally
npm run dev
# → http://localhost:3000

# Production build
npm run build
npm start
```

## Deploy to Webflow Cloud

1. Fork this repo (or click **Use this template**).
2. In your Webflow site, open **Apps → Webflow Cloud → Create new app**.
3. Connect your GitHub account and select this repository.
4. Pick a mount path (e.g. `/next`) and click **Deploy**.

Full walkthrough: <https://developers.webflow.com/webflow-cloud/quickstart>.

## What's included

- Next.js 16 (App Router) + React 19
- Tailwind CSS v4
- Branded landing page with links to the Webflow Cloud docs
- Zero extra deps beyond the framework

## Customizing

The landing page lives in `src/app/page.tsx`. Styles are in
`src/app/globals.css` under the `wf-*` prefix. Swap in your own content,
routes, and APIs — everything below `src/app` is yours.

## Learn more

- [Webflow Cloud docs](https://developers.webflow.com/webflow-cloud)
- [Next.js on Webflow Cloud](https://developers.webflow.com/webflow-cloud/frameworks/next-js)
- [Next.js documentation](https://nextjs.org/docs)

---

Built with Next.js · Deployed on Webflow Cloud.

## Branch naming convention

This repo is the canonical `hello-world-<framework>-app` example. Every framework
version and variant lives on a branch here, not in a separate repo:

| Branch | Contents |
| --- | --- |
| `main` | Current default example. Advances to the latest framework version once dependent pipelines are updated. |
| `vN` | Framework major version N, no storage bindings (for example `v6`). |
| `vN-with-bindings` | Version N plus D1, R2, and KV bindings and a `/api/binding-status` health check. |
| `sentry` | Latest version with bindings, plus a working Sentry setup. |

### Adding a new framework version

When a new major version M ships:

1. Create `vM` from the new plain app and `vM-with-bindings` from its bindings variant.
2. Point `sentry` at the latest version with bindings.
3. Leave `main` until the pipelines that consume this repo (webflow-cli,
   infrastructure/cosmic-builder, cosmic-test) are updated, then advance `main` to `vM`.
4. Keep older `vN` / `vN-with-bindings` branches so pinned references keep working.

Version branches (`vN`, `vN-with-bindings`, `sentry`) are protected: they can't be
deleted or force-pushed.
