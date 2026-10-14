# Pull Request Checklist

This file is the source of the checklist. Paste it into the pull-request description.

It was written for Bitbucket, which does not read a template from the repository. GitHub does:
copying this content to `.github/pull_request_template.md` would make it the default
description for every pull request. That has not been done yet - it would leave two copies to
keep in step, and which one is authoritative is a decision, not a cleanup.

---

## What and why

<!-- What changed, and why. Link the task or the page in docs/spec/page-register.md. -->

## Claims

- [ ] No clinical, evidence, regulatory or economic wording was authored, paraphrased, translated or shortened. Every such string was copied from an approved source.
- [ ] Title tags, meta descriptions, H1s and slugs match `docs/spec/page-register.md`.
- [ ] The gate of every page touched allows what this PR does (`LOW` / `MEDIUM` confirmed / `HARD` cleared). `RESERVED` pages are untouched.
- [ ] No placeholder copy on a gated surface, including in the preview deployment.
- [ ] Mandatory slots present, in order; the boundary slot is not collapsed or de-emphasised.

## Locales

- [ ] Slots substituted, never deleted.
- [ ] Self-referencing canonical and the complete reciprocal hreflang cluster including `x-default`.
- [ ] No geo-redirect, no `Accept-Language` negotiation, no cross-locale redirect for missing content.
- [ ] Structural parity across locales: the same slots in the same order.

## SEO and rendering

- [ ] Evidence, counters, citations, reviewer fields and definition blocks are in the served HTML, not produced client-side.
- [ ] Indexation matches the register. Pages not cleared for publication are `noindex`.
- [ ] Structured data validates and still carries the reviewer and citation fields.
- [ ] Internal links respect the three permitted cross-silo routes.

## Accessibility — WCAG 2.1 AA

- [ ] Contrast, keyboard operability, visible focus, heading order, label association.
- [ ] Motion honours `prefers-reduced-motion`.
- [ ] Accessibility snapshot captured for UI changes.

## Code

- [ ] Mantine imported only in `src/shared/`. No `eslint-disable` added to permit otherwise.
- [ ] Flat Mantine exports, no compound JSX form.
- [ ] Theme tokens, not hard-coded values.
- [ ] Route registry, not string literals. A change to `page-register.ts` is a reviewed specification change, in its own commit.
- [ ] FSD layer direction respected (`app -> screens -> widgets -> features -> entities -> shared`), slices imported through their `index.ts`.
- [ ] `src/app/**` stays thin: params, metadata, render a screen.
- [ ] Translation files contain interface strings only, no regulated wording. No language detection.
- [ ] No credential reachable from the client.
- [ ] No accelerator payload file modified.
- [ ] No new dependency, package-manager change or configuration rewrite without a decision.

## Verification

- [ ] `npm run verify`
- [ ] `npm run test:e2e` — required when routing, metadata, canonicals, hreflang or server rendering changed
- [ ] `node ./toolchain/bin/doctor.mjs` is not `BLOCKED`

## Still open

<!-- Provisional contracts, assumptions, and who must confirm each one. -->
