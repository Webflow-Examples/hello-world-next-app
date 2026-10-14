# Project Specification

Machine-readable specification for the compremium.ch rebuild, extracted from the estimate spreadsheets in
`docs/`. This directory is the input that agents and developers read before touching routing, templates,
metadata, schema or copy.

## Files

| File | Contents | Origin |
|---|---|---|
| [claims-guardrails.md](claims-guardrails.md) | Binding regulatory and editorial rules. **Read first.** | Hand-written from verbatim quotes |
| [page-register.md](page-register.md) | 51 register entries: URL, template, H1, title, description, schema, indexation, claims gate, timing, locale scope | Transcribed from the estimate spreadsheet |
| [templates.md](templates.md) | 23 template names mapped to pages; mandatory slots; block order; SSR requirement | Derived |
| [locales.md](locales.md) | Locale control matrix, hreflang cluster rules, substitution rule | Transcribed from the estimate spreadsheet, plus hand-written notes |
| [fe-scope.md](fe-scope.md) | FE-01 to FE-18: our work breakdown, required inputs, acceptance criteria and the cross-team dependencies they wait on | Transcribed from the Action Log, plus a hand-written assessment |
| [seo-requirements.md](seo-requirements.md) | WS-D work breakdown with the `Output / Guardrail` acceptance criterion per item | Transcribed from the estimate spreadsheet |

## Provenance, and how these files change now

These documents were transcribed once, at project start, from the spreadsheets in `docs/`:

| Spreadsheet | Transcribed into |
|---|---|
| `Compremium_Estimate_SEO_Localisation_Social (final).xlsx` | `page-register.md`, `locales.md`, `seo-requirements.md`, and `src/shared/config/page-register.ts` |
| `Compremium AG · Phase 2 Action Log.xlsx` | `fe-scope.md` |

The scripts that did it have been removed. The transcription was a one-off; there is no build
step, nothing to install and nothing to re-run. The spreadsheets stay in `docs/` as provenance
— the record of where a value came from and who approved it — not as a build input.

**Editing a value here is a specification change, not a text edit.** Every title tag, meta
description, H1 and slug is a claim surface under QARA/Regulatory and Clinical/Medical review.
That rule has not changed; only the mechanism has. Change one when the review clears it, note
the source, and keep the change in its own commit so the diff reads as a content change.

`src/shared/config/page-register.ts` holds the same rows in typed form and is maintained the
same way. It describes the pages the project *plans*; what this deployment actually serves is
`src/shared/config/built-routes.ts`. See `docs/adr/0002-built-routes-gate.md`.

## Scope at a glance

| | |
|---|---|
| Property | compremium.ch (rebuild and migration of an existing site) |
| Silos | 5 — A Corporate & platform, B Product hubs, C Clinical applications, D Evidence & research, E Evaluation & training |
| Launch pages | 38, click depth <= 3, orphan count 0 |
| Register entries | 51 (includes `reserved` nodes and multi-slug entries) |
| Our scope | FE-01 to FE-18, 64-95 h, page 1 (homepage) only |
| Templates | 23 names in the register; 9 carry the metadata pattern system and CWV acceptance |
| Locales | `/` (x-default, en) · `/de/` (de-DE, de-CH, gated) · `/us/` (en-US, substitution layer) · `/sa-en/` (shell only, TBD) |
| Entity anchors | Stable `@id` for soft-tissue compressibility and the CP Value |

## What is not in these documents

- **Approved copy.** The register holds *drafted* metadata. Body copy for clinical and evidence pages is
  produced in WS-B by medical writing and is not available here.
- **Brand tokens.** Colours, type scale and icon set come from WS-C (Figma handoff), weeks 1-4.
- **Hosting decision.** The ` Infrastructure costs` sheet in the SEO estimate is an unrelated leftover
  template dated 11/2023 ("XXX Estimate", Azure) and must not be read as a hosting decision.
- **Webflow plan limits.** CMS collection counts and locale limits depend on the plan tier; account
  pending.
- **Approved redirect map.** WS-D names specific legacy-to-target pairs (see `seo-requirements.md`), but
  the full map is produced in that workstream.
