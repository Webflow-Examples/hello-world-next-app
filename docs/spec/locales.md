# Locale Control Matrix

**Source of truth:** `docs/Compremium_Estimate_SEO_Localisation_Social (final).xlsx`, sheet `Localisation & hreflang`.

Transcribed verbatim from the spreadsheet at project start. The permitted/prohibited language columns are regulatory boundaries,
not style guidance. See `claims-guardrails.md`.

> Locale control matrix for compremium.ch. The core story is global; some verbs are not. Each market is governed by its own Instructions for Use and no market may import another market's permissions. SUBSTITUTION RULE: where a market does not permit a statement, the slot is substituted, never deleted. Deleting a slot produces divergent page structures across locales and breaks the hreflang cluster. The German surface remains a live decision point: the tree is identical to the root, but publication is gated on German-language claims review.

## Matrix

| Locale | hreflang | Market / region | Controlling source | Permitted language | Prohibited language | Tree scope | Status | Gate |
|---|---|---|---|---|---|---|---|---|
| / | x-default, en | EU and Switzerland, international baseline | EU IFU v11.0 §5 | Controlled definitions of compressibility and the CP Value; monitoring over time within the EU controlled wording; role as a complement to clinical examination and imaging. | Diagnostic framing; outcome, treatment and surgical-timing claims; risk stratification; economic claims; "from triage to discharge" pending resolution against the US IFU. | Full tree, all five silos | NOW | None for LOW-gate pages; 12 of 38 pages can build immediately. |
| /de/ | de-DE, de-CH | DACH priority region: Germany, Switzerland, Austria | EU IFU v11.0 §5, rendered in German clinical terminology | EU permissions expressed in German clinical terminology, against a locked German controlled vocabulary. | Importing US or Saudi wording; any term not present in the German controlled vocabulary; translated marketing adjectives. | Identical to the root tree | GATED | HARD GATE: German-language claims review - QARA/Regulatory and Clinical/Medical. Surface decision still open. |
| /us/ | en-US | United States | US IFU v15.0 §5.1 | Repeat capture under a consistent protocol for documentation and comparison. Clearance stated by its correct term. | Trend, progression, recovery, improvement or change over time; longitudinal tracking; "FDA approved"; risk thresholds. | Identical tree; the time-based slot is substituted, never removed | NOW | HARD GATE: substitution list for every time-based slot signed off by QARA/Regulatory before the locale opens. |

## Cluster rules (verbatim)

> CLUSTER RULE   Every locale carries a self-referencing canonical and a complete, reciprocal hreflang cluster including x-default. No automatic geo-redirection: the user chooses the locale and the choice is remembered. A locale that cannot yet carry a page serves the substituted slot, not a 404.

## Scoped work and guardrails (verbatim)

| Work item | Output / Guardrail |
|---|---|
| hreflang cluster implementation and return-tag validation | x-default, reciprocal tags, per-locale canonicals, automated regression check. |
| Locale routing and language switcher | Manual locale selection with persistence. Guardrail: no IP-based auto-redirect - it hides locale-specific claims boundaries from the reader and from crawlers. |
| German terminology glossary and controlled vocabulary lock | German clinical terminology fixed before any page is translated. Controlled vocabulary and status values remain in English - they are an interface, not copy. |
| /de/ transcreation of the launch set | 38 pages transcreated, not translated. Publication remains gated on German-language claims review. |
| /us/ claims substitution layer in the CMS | Slot-level variant management so a US page inherits the root structure and substitutes only the gated slots. Built once, used by every future page. |
| Per-locale QA and hreflang regression | Structural parity check across locales: same slots, substituted content, no missing pages. |
| Total localisation | Covers /de/ and /us/. /sa-en/ is shell only. |

## Notes and open points

- The matrix above lists three locales. A fourth, `/sa-en/`, appears only in the totals row of the
  estimate: "Covers /de/ and /us/. /sa-en/ is shell only." Its hreflang value, controlling IFU and
  permitted language are **TBD**.
- `/de/` publication is gated. The tree is built, the routes exist, but no German page publishes before
  German-language claims review clears it.
- Locale selection is manual and persisted. IP-based auto-redirect is prohibited.
- A locale that cannot yet carry a page serves the substituted slot, not a 404, and not a redirect to the
  root locale.
- Parity is structural: every locale carries the same slots in the same order. Only slot content is
  substituted.
