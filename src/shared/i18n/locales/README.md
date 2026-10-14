# Translation resources

One directory per locale id from `src/shared/config/locales.ts`, one JSON file per namespace.

## What belongs here

Interface strings only: navigation labels, button text, form labels and validation messages,
state descriptions, visually hidden text.

## What must never be here

Clinical, evidence, regulatory or economic wording, and anything quoted from an Instructions
for Use. That text is reviewed per market and per page, and a shared JSON file is exactly the
mechanism that would move a permission from one market to another. Page content comes from the
CMS. See `docs/spec/claims-guardrails.md`.

`us` and `sa-en` are markets rather than languages. They carry English interface strings and
differ from the root only where a market requires it.
