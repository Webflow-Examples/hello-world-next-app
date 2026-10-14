# Claims Guardrails

**Sources:** `Compremium_Estimate_SEO_Localisation_Social (final).xlsx` (sheets `SEO & AEO Implementation
(WS-D)`, `Localisation & hreflang`, `Page & Metadata Register`, `Social - LinkedIn & YouTube`) and
`WS-C_ Brand & Visual System and UX_UI Design.xlsx`.

compremium.ch presents a regulated medical device. Wording on this site is governed by market-specific
Instructions for Use and cleared by QARA/Regulatory and Clinical/Medical. This file collects the binding
rules verbatim. It is a production input: **it does not approve any claim and does not replace
Regulatory, Clinical or Legal review.**

---

## Rules for anyone — human or agent — producing content or markup

These are the operational consequences of the rules quoted below. Read them before writing a single
title, heading, slug, alt text, schema field or piece of body copy.

1. **Never invent, paraphrase, translate, shorten or "improve" clinical, evidence, regulatory or economic
   wording.** Copy the approved string exactly, or stop and ask. This applies to body copy, headings,
   title tags, meta descriptions, URL slugs, alt text, schema values, button labels, form labels, error
   messages, breadcrumbs, OpenGraph fields, video titles and transcripts.
2. **Metadata is a claim surface.** A title tag, meta description or slug is reproduced verbatim in search
   results and AI answers, detached from the page that qualified it. It passes the same review as body
   copy.
3. **Respect the gate on every page.** `LOW` may be produced now. `MEDIUM` requires Product/Technical
   confirmation. `HARD` is blocked until QARA/Regulatory and Clinical/Medical clear the specific wording.
   `RESERVED` nodes are not built, not indexed and not linked. Gates are listed per page in
   `page-register.md`.
4. **Never move a permission across markets.** Each locale is governed by its own IFU. Wording approved
   for `/us/` is prohibited on `/` and `/de/`, and the reverse. See `locales.md`.
5. **Never delete a slot to solve a locale problem.** Substitute it. Deleting produces divergent page
   structures and breaks the hreflang cluster.
6. **Never reorder a mandatory slot.** The boundary slot and the definition block cannot move below a
   product block. See `templates.md`.
7. **Placeholder copy is prohibited on gated surfaces.** Do not ship lorem ipsum, invented statistics,
   sample reviewer names, example citations or stand-in meta descriptions on any page carrying a clinical,
   evidence, regulatory or economic slot — not even behind a feature flag or in a preview deployment.
   Use an empty slot with an explicit `TODO` owned by the SEO & AEO Lead.
8. **When a required string is missing, stop.** Report the gap; do not fill it.

---

## Publication dependency (verbatim, WS-D)

> Important Dependency: no page carrying a clinical, evidence, regulatory or economic slot may publish
> before the Claims SSOT is formally approved within WS-B and signed off by QARA/Regulatory and
> Clinical/Medical.

> STRICT RULE: metadata is a claim surface. Title tags, meta descriptions, H1s and URL slugs are quoted
> verbatim in search results and in AI answers, and pass through the same claims review as body copy. Two
> live case-report slugs make surgical-timing and fasciotomy statements at URL level and must be cleared
> before migration, not after.

## Gate semantics (verbatim, Page & Metadata Register)

> STATUS COLUMN: LOW gate pages may be produced now. MEDIUM requires Product/Technical confirmation. HARD
> is blocked until QARA/Regulatory and Clinical/Medical clear the specific wording. RESERVED nodes are
> held in the tree and are not built, not indexed and not linked.

> METADATA CONTROL RULE   A title tag, a meta description and a URL slug are external statements. They are
> quoted in search results, shared in messages and reproduced verbatim in AI answers, where they detach
> from the page that qualified them. Each one passes the same claims review as body copy, and the
> prohibited list applies in full: diagnostic framing, outcome claims, treatment and timing claims, trend
> language, "approved" in relation to FDA, risk stratification and economic claims.

### Globally prohibited formulations

Diagnostic framing · outcome claims · treatment and timing claims · trend language · "approved" in
relation to FDA · risk stratification · economic claims.

Per-locale permitted and prohibited language is narrower still — see `locales.md`.

## Locale rules (verbatim, Localisation & hreflang)

> Each market is governed by its own Instructions for Use and no market may import another market's
> permissions.

> SUBSTITUTION RULE: where a market does not permit a statement, the slot is substituted, never deleted.
> Deleting a slot produces divergent page structures across locales and breaks the hreflang cluster.

> CLUSTER RULE   Every locale carries a self-referencing canonical and a complete, reciprocal hreflang
> cluster including x-default. No automatic geo-redirection: the user chooses the locale and the choice is
> remembered. A locale that cannot yet carry a page serves the substituted slot, not a 404.

> The German surface remains a live decision point: the tree is identical to the root, but publication is
> gated on German-language claims review.

> Controlled vocabulary and status values remain in English - they are an interface, not copy.

## Evidence attribution (verbatim, WS-D)

> STRICT RULE: the Sellei 2020 performance figures relate to a predecessor device and protocol.
> Transferring them to CPMX1 in any extractable block is prohibited.

> Guardrail: evidence attributed by device layer - method, predecessor device, current device.

> Three evidence layers, why they must not be merged, what counts as a basis for an external statement and
> how our medical review process works.

## Internal linking (verbatim, WS-D)

> Three permitted cross-silo routes only: clinical question to product entity, claim to evidence object,
> any page to evaluation. STRICT RULE: no link from the research horizon back into a product benefit slot.

> Guardrail: orphan count 0; the clinical silo sits beside the product silo, never beneath it.

## Entity naming (verbatim, WS-D)

> VeinPress, CPMX1, CPM#1 and Compremium Quantis ST currently compete as four device names. Consolidation
> into one platform graph precedes any amplification. Architecture is fixed: Compremium AG -> COMPREMIUM
> QUANTIS -> Compremium Quantis ST / Veno CVP -> Ortho Trauma / Sports / Military.

> Persistent @id for soft-tissue compressibility and CP Value, cited by every clinical and product page.
> These are the two most citable objects on the property.

## Indexation holds (verbatim, WS-D and register)

> Guardrail: the case-report layer is currently noindexed although it is the only first-party clinical
> proof on the property; indexation is restored only after the claims review of the two affected slugs.

- `/evidence/white-papers/<slug>` — "Noindex until rebuilt". "The existing white paper requires a full
  claims rebuild before reuse."
- `/evidence/case-reports/<slug>` — "Index, follow after review".
- `/evidence/health-economics` — reserved, `GATED`: "The communication framework can be designed now; no
  quantitative economic statement may be published."
- `/quantis/st/ai-and-analytics` — reserved: "the page is not created before confirmed capability and
  market-specific clearance."

## Visual system rules (verbatim, WS-C)

> Color system — STRICT RULE: No red/green traffic-light risk scales.

> Schematic illustrations — STRICT RULES: No visualization of direct intracompartmental pressure or visual
> declarations that tissue is safe for surgery.

> Graphic language for corporate & products — Guardrail: Focus on objective measurement (digital
> palpation).

> Web UI Kit & Tokens — Guardrail: High-contrast medical readability.

> Current Website UX/UI Audit — Mapping regulatory compliance risks (removal of "Proven & Approved",
> illegal claims), UX bottlenecks, duplicate icon usage, and broken card layouts.

Implementation consequence: the semantic colour scale must not encode clinical risk. A red/amber/green
status ramp is prohibited for anything representing a measurement, a patient state or a risk level.
Status colours for non-clinical UI (form validation, system messages) remain permitted.

## Owned social surfaces (verbatim, Social sheet)

> CHANNEL RULE   A social channel may not be the first place a statement appears. Every clinical or
> regulatory statement published on LinkedIn or YouTube exists first on a reviewed page on compremium.ch,
> and the post links to it. This keeps the claim, its qualifiers and its review date together.

> Training videos — Unlisted, access-controlled, surfaced only from /training/onboarding. Excluded from
> the public channel, from sitemaps and from VideoObject markup.

## Review cadence

> Metadata claims QA gate (review cycles) — Two structured review cycles with QARA/Regulatory and
> Clinical/Medical covering titles, descriptions, H1s and slugs. Reviewer functions are the authority on
> claim boundaries, not the document version number.
