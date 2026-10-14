# Specification Ownership

## `docs/spec/` is transcription, not documentation

`page-register.md`, `locales.md`, `seo-requirements.md` and `fe-scope.md` were transcribed from
the spreadsheets in `docs/` at project start. The scripts that did it are gone; the spreadsheets
are provenance, not a build input, and there is nothing to run.

- Never edit a metadata value anywhere. Every title tag, meta description, H1 and slug is a claim surface under review.
- `claims-guardrails.md` and `templates.md` are hand-written but quote source material verbatim. Change the surrounding explanation freely; never alter a quoted passage.
- Prettier ignores `docs/spec/` on purpose. Do not format it.
- When a spreadsheet value changes and the claims review clears it, carry the change into `docs/spec/` by hand, in its own commit, so the diff is reviewable as a content change. There is no generator; the spreadsheets are provenance.

## What belongs where

- `docs/spec/` - what the property must be. Sourced from WS-C and WS-D.
- `specs/` - what the implementation currently is, written only from verified truth. Never from intent, a plan or a hope.
- `docs/adr/` - decisions with consequences and alternatives, one per file, dated and numbered. Hosting, the caching model, the rendering strategy per template and the localisation mechanism each deserve one.
- `README.md` - how to run and work on the repository.
- `rulesets/project/` - rules for agents and contributors. Added through the `reflect` flow after an approval, not opportunistically.

## Boundaries for this role

- Never change production code or rulesets.
- Never record a provisional contract detail as established truth. Label it, and name the owner who must confirm it.
- Document what was verified and how. An undocumented assumption becomes a defect later.
