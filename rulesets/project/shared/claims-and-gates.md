# Claims And Gates

compremium.ch presents a regulated medical device. Wording is governed by market-specific
Instructions for Use and cleared by QARA/Regulatory and Clinical/Medical. The full rule set is
`docs/spec/claims-guardrails.md`; read it before producing any user-visible string.

## Never author regulated wording

- Never invent, paraphrase, translate, shorten or improve clinical, evidence, regulatory or economic wording. Copy the approved string exactly or STOP.
- This covers body copy, headings, title tags, meta descriptions, URL slugs, alt text, schema values, button and form labels, error messages, breadcrumbs, OpenGraph fields, video titles and transcripts.
- Metadata is a claim surface: a title, description or slug is reproduced verbatim in search results and AI answers, detached from the page that qualified it.
- Globally prohibited: diagnostic framing, outcome claims, treatment and timing claims, trend language, "approved" in relation to FDA, risk stratification, economic claims.
- Placeholder copy is prohibited on any page carrying a clinical, evidence, regulatory or economic slot. No lorem ipsum, invented statistics, sample reviewer names or stand-in descriptions, not even behind a flag or in a preview deployment. Leave the slot empty with an explicit `TODO(WS-D)`.
- When an approved string is missing, report the gap and STOP. Do not fill it.

## Honour the page gate

Every page in `docs/spec/page-register.md` carries a gate. Check it before implementing.

- `LOW` - may be produced now.
- `MEDIUM` - requires Product/Technical confirmation first.
- `HARD` - blocked until QARA/Regulatory and Clinical/Medical clear the specific wording. Structure and components may be built; approved copy may not be placed.
- `RESERVED` - not built, not indexed, not linked, not added to the sitemap.

## Structural rules that carry regulatory weight

- Never delete a slot to solve a locale problem. Substitute it. Deleting diverges page structure across locales and breaks the hreflang cluster.
- Never reorder a mandatory slot. The boundary slot and the definition block cannot move below a product block.
- Never move a permission across markets. Wording approved for `/us/` is prohibited on `/` and `/de/`, and the reverse.
- Never merge the three evidence layers: method, predecessor device, current device.
- Never transfer Sellei 2020 performance figures to CPMX1 in any extractable block.
- Only three cross-silo link routes exist: clinical question to product entity, claim to evidence object, any page to evaluation. Never link from the research horizon into a product benefit slot.
