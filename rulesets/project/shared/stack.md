# Stack

Facts about this repository. Confirm against the files before relying on anything here.

## Application

- Next.js 16 App Router, React 19, TypeScript strict, `src/` layout, npm. No Tailwind.
- Mantine 9 with `postcss-preset-mantine`. Breakpoint variables in `postcss.config.cjs` mirror `DEFAULT_THEME.breakpoints`.
- There is no `src/app/layout.tsx`. The locale segment `src/app/[locale]/layout.tsx` is the root layout, so `<html lang>` can carry the locale.
- `src/proxy.ts`, not `middleware.ts`. The `middleware` file convention is deprecated in Next 16.
- `next.config.ts` has `cacheComponents: true` and `partialPrefetching: true`, the create-next-app defaults for this version.

## Scripts

`dev`, `build`, `start`, `lint`, `lint:fix`, `typecheck`, `format`, `format:check`, `test`,
`test:watch`, `test:e2e`, `verify`.

- `verify` is lint + typecheck + unit tests. Run it before reporting work complete.
- `test:e2e` builds first, then runs Playwright against the production server.
- The accelerator Stop hook runs `lint`. Keep that script working.

## CI

`bitbucket-pipelines.yml` on Node 24, matching `toolchain/manifest.json`.

- The gate is the same `npm run verify` a developer runs locally. Never add a CI-only check nobody can reproduce, and never let CI skip something the local gate enforces.
- A served-HTML step builds, starts the production server and runs Playwright against it. It needs no browser binary; the request fixture reads raw responses.
- A Lighthouse step asserts the Core Web Vitals budgets in `.lighthouserc.json`. Locally it needs `CHROME_PATH` pointing at a Chrome binary.
- The SEO category score is deliberately not asserted: pages that have not cleared their claims gate are `noindex`, which Lighthouse scores as a defect. SEO correctness is asserted precisely in `e2e/seo.spec.ts` instead.

## Accelerator payload

`.claude/`, `.agents/`, `rulesets/` and `toolchain/` are installed payload verified against
`.frontend-accelerator/installation.json`.

- Never edit, reformat or autofix a payload file. ESLint and Prettier already ignore them; keep it that way. A changed payload file makes `frontend-accelerator update` report a conflict and refuse to write.
- `rulesets/project/` is the exception: it is team-owned and is where project rules belong.

## Not decided yet

Stop and ask rather than assuming any of these.

- Hosting. The application is deliberately hosting-neutral. No Vercel-only, Cloudflare-only or AWS-only API without an explicit decision.
- Webflow plan tier, and therefore CMS collection and locale limits.
- The WS-C design tokens. `src/shared/theme/theme.ts` is a skeleton of `TODO(WS-C)` entries.
- Whether the register's 23 template names are 23 templates or variants of the 9 that carry the metadata pattern system.
