# Review Checklist

Prioritise findings by consequence. On this property a regulatory or search defect outranks
a style preference by a wide margin.

## Blocking

- Any clinical, evidence, regulatory or economic wording that was authored, paraphrased, translated or shortened rather than copied from an approved source.
- A title tag, meta description, H1, slug, alt text or schema value that does not match `docs/spec/page-register.md`, or that was placed on a page whose gate has not cleared.
- Placeholder copy on a gated surface, including in a preview deployment.
- A mandatory slot missing, collapsed, de-emphasised or reordered below a product block.
- A slot deleted rather than substituted for a locale.
- A red/amber/green ramp encoding risk, a measurement or a patient state.
- Geo-redirection, `Accept-Language` negotiation, or a cross-locale redirect for missing content.
- A missing or non-reciprocal hreflang cluster, a missing `x-default`, or a canonical that is not self-referencing.
- Evidence, a counter, a citation, a reviewer field or a definition block that is not in the served HTML.
- A credential reachable from the client, including anything in a `NEXT_PUBLIC_` variable.
- A `reserved` page built, linked or indexed.
- Regulated wording placed in a translation file instead of coming from the CMS.
- A change to `page-register.ts` mixed into an unrelated commit, or a drafted H1, title or description emitted into application code.
- An edited accelerator payload file.

## Required

- `@mantine/*` imported outside `src/shared/`, or an `eslint-disable` added to permit it.
- A compound JSX form where a flat export exists.
- A hard-coded colour, spacing value, radius or font size instead of a theme token.
- A route path as a string literal instead of the registry.
- An import that crosses an FSD layer upward, or an `eslint-disable` added to permit one.
- An import that reaches inside another slice instead of using its `index.ts`, or a cross-slice import within the same layer.
- Composition or business logic in `src/app/**` instead of a screen.
- Language detection, or a translation resource fetched again on the client.
- An unvalidated CMS or form payload crossing into application types.
- A WCAG 2.1 AA regression: contrast, keyboard reachability, focus visibility, heading order, label association, motion preference.
- A new dependency, package-manager change or configuration rewrite without an explicit decision.
- A provider-specific API that makes the application non-portable while hosting is undecided.

## Context

- Does the change respect the rendering strategy recorded for that template?
- Does it add weight to a template whose Core Web Vitals are already at risk?
- Is a provisional contract detail labelled as provisional rather than written up as truth?
- Does `npm run verify` pass, and `npm run test:e2e` where routing or metadata changed?

## Reporting

- Cite file and line, state the consequence, and distinguish what you verified from what you inferred.
- Review the diff that exists. Never request work the task did not ask for.
- Pull requests are opened on Bitbucket by a human. Never claim to have opened one.
