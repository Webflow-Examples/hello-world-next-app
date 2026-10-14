# FE-02: Localisation platform requirements

**Task:** FE-02 — i18n / localization scaffold (EN root) · `docs/spec/fe-scope.md`
**Type:** requirements pass. No architecture is selected, no platform is chosen, no production code changes.
**Source document:** `docs/Compremium — требования к локализации на Webflow.md` (Russian, 25 numbered requirements, written to evaluate the native Webflow Localize add-on).
**Reconciled against:** `AGENTS.md`, `docs/spec/locales.md`, `docs/spec/seo-requirements.md`, `docs/spec/page-register.md`, `docs/spec/templates.md`, `docs/spec/fe-scope.md`, `docs/spec/claims-guardrails.md`, `docs/spec/README.md`, `docs/adr/0001-url-trailing-slash.md`, `docs/adr/0002-built-routes-gate.md`.

**Date:** 2026-10-14

---

## 1. What this document is for

The source document asks one question — _can a localisation platform carry compremium.ch?_ — and
answers it as a feature list. This document turns that list into two things the project can act on:

1. **A testable contract** against which any localisation platform can be evaluated, including the
   Webflow Localize add-on the document names. Every requirement below states what is observed,
   where, and how it is proven.
2. **A statement of what our own Next.js application must satisfy regardless of which platform is
   chosen.** Several requirements are already ours under `docs/spec/seo-requirements.md` and
   `docs/spec/locales.md`. Where a platform also offers them, the duplication is named, not resolved.

This document does **not** select a platform, an architecture, a plan tier or a locale status. Where
the source document and the specification disagree, both readings are recorded and the conflict is
escalated. Where a decision belongs to a human, it is listed in §9.

### Claims boundary for this task

No locale copy, claim, title tag, meta description, H1, slug, alt text, schema value or any other
user-visible string is drafted, translated or paraphrased here. The requirements themselves are
platform requirements and translating them from the Russian source is in scope; the content they
govern is not. Prohibited and permitted formulations are referred to by pointer into
`docs/spec/locales.md`, never reproduced as examples. See `docs/spec/claims-guardrails.md` rules 1, 2 and 8.

---

## 2. Reading key

### Traceability

`RU-01` … `RU-25` map one-to-one onto the numbered items in the Russian source document, in its order.
The client document and this task stay mappable by that number.

### Owning layer

| Code   | Layer                           | Meaning                                                               |
| ------ | ------------------------------- | --------------------------------------------------------------------- |
| `PLAT` | Localisation platform           | The add-on or service being evaluated.                                |
| `CMS`  | Webflow CMS modelling           | Collection, field and variant structure inside Webflow.               |
| `APP`  | Our Next.js application         | Routing, rendering, metadata, served HTML.                            |
| `PROC` | Content and translation process | Human workflow: authoring, transcreation, claims review, publication. |

A requirement may carry several. Where a layer is listed in **bold**, it owns the acceptance criterion
even if another layer also offers the capability.

### Strength

Everything below is **MUST** except `RU-05`, which the source document itself marks optional
("желательно… не обязательно"). No other requirement is downgraded: each one traces to a verbatim rule
in `claims-guardrails.md`, `locales.md` or `seo-requirements.md`, and those are regulatory or search
boundaries rather than preferences. Where a MUST has a narrower form than the source document implies,
the narrowing is stated in the requirement, not applied silently.

### Duplication marker

**[DUP]** marks a requirement that is already ours under `docs/spec/seo-requirements.md` or
`docs/spec/locales.md` even if the platform also implements it. Marking it is the deliverable; choosing
which implementation wins is an architecture decision and is out of scope here (§9, D-06).

### Claims boundary marker

**[CLAIMS]** marks the five requirements the brief identifies as claims-boundary requirements rather
than conveniences: `RU-08`, `RU-09`, `RU-10`, `RU-11`, `RU-21`. Each states what a failure would allow
onto a published page. `RU-12` carries the same class of risk and is noted as such, but is not counted
among the five.

### Acceptance criteria

`AC-01` … `AC-37`, numbered once across the document. Total: **37**.

---

## 3. The carrier question, stated once

The source document evaluates **Webflow Localize as a Webflow-hosted add-on**: Webflow stores the
content, Webflow renders the page, Webflow serves the HTML. This project does not work that way.
`AGENTS.md` and `docs/spec/README.md` describe Webflow as a **headless CMS consumed through the Data
API**, with rendering in Next.js (`src/app/[locale]/`, `src/proxy.ts`, `src/shared/i18n/`).

Under a headless carrier the 25 requirements split into three groups. This is the single largest
finding in this pass, and it changes what the platform is actually being evaluated for.

### 3.1 Requirements that stop being the platform's responsibility

Delivery-side behaviour. Whatever the platform emits is discarded, because the platform does not serve
the response. These are **`APP`** and already ours:

`RU-01` (public URL shape) · `RU-06` (redirects) · `RU-15` (hreflang) · `RU-16` (canonical) ·
`RU-18` (noindex emission) · `RU-19` (sitemap) · `RU-20` (JSON-LD emission) · `RU-21` (served HTML) ·
`RU-22` (pagination URLs) · `RU-23` (switcher target) · `RU-24` (no geo-redirect) · `RU-25` (in-locale links).

That is **12 of 25**. If the platform is bought primarily for this group, it is bought for features
this project cannot use.

### 3.2 Requirements that change meaning

| #       | Under a Webflow-hosted carrier                             | Under a headless carrier                                                                                                                                                                                                                           |
| ------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RU-02` | The platform's page tree is identical per locale.          | Parity is a property of our route table crossed with CMS data. The platform must expose enough per-locale state for us to prove parity; it cannot enforce it.                                                                                      |
| `RU-03` | An unpublished locale is simply not served.                | The platform stores a publish state we read. **Not serving it is our decision**, taken from that field.                                                                                                                                            |
| `RU-04` | A draft item is absent from the published site.            | A draft item is still returned by the Data API under the right token. **We** must not render it, and must not fall back to root copy when we skip it.                                                                                              |
| `RU-05` | A localised slug produces a localised URL.                 | A localised slug is a CMS field we map onto a route. The platform stores it; our routing publishes it.                                                                                                                                             |
| `RU-07` | The platform localises components, forms and assets.       | Components and forms are **ours** (`src/shared/i18n/locales/*`). The platform owns CMS content, images, alt text and PDF references only.                                                                                                          |
| `RU-09` | The platform omits a hidden block from the HTML it serves. | A platform-side visibility toggle is **meaningless to us** if a single API key returns every locale's fields. The requirement becomes: the platform must mark the prohibited block in a machine-readable way, and **our** server must not emit it. |
| `RU-13` | Export is a platform feature for translators.              | Export may be ours, built on the Data API. The platform must still supply stable per-string identifiers.                                                                                                                                           |
| `RU-14` | Preview renders the platform's own page.                   | Editor permissions stay with the platform; **preview rendering is ours**, because the platform cannot render our page.                                                                                                                             |
| `RU-17` | The platform stores and emits metadata.                    | The platform stores it; **we** emit it.                                                                                                                                                                                                            |

### 3.3 Requirements that remain the platform's, under either carrier

`RU-03` (locale existence), `RU-04` (per-locale publish state as stored data), `RU-05` (per-locale slug
field), `RU-07` (per-locale storage for CMS content and assets), `RU-08` (variant model), `RU-10`
(non-inheriting page), `RU-11` (inheritance control), `RU-12` (machine-translation switch), `RU-13`
(export identifiers), `RU-14` (per-locale editor permissions).

That is **10 of 25**, and they are all editorial-model requirements. A fair evaluation of Webflow
Localize for this project is an evaluation against this group, with §3.2 as the integration surface.

> **Unverified.** Whether the Webflow Data API exposes per-locale publish state, per-locale slugs,
> slot-level variants and a machine-readable "prohibited in this locale" marker is **not established
> in this repository** and was not verified in this pass. It is the central question for
> `/api-integration` (§9, D-07).

---

## 4. Conflicts surfaced, not settled

These are recorded for a human decision. No criterion below silently adopts one side.

### C-01 · Volume

| Quantity          | Source document | `docs/spec/`                                                       | Note                                                                                                                                                      |
| ----------------- | --------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Launch pages      | 43              | 38 (`README.md`, `locales.md`, `seo-requirements.md`)              | The register holds **51 entries**, including `reserved` nodes and multi-slug rows. 43 is neither figure.                                                  |
| Templates         | 12              | 23 names / 9 carrying the metadata pattern system (`templates.md`) | `fe-scope.md` DEP-01 also says **"12 templates / launch pages"**. The document's 12 therefore agrees with the Action Log and disagrees with the register. |
| CMS content types | 9               | not stated as a CMS figure                                         | WS-D's "9" is the count of **templates** carrying the metadata pattern system, not of CMS collections. The two may have been conflated.                   |

`AGENTS.md` records the open decision: _"Whether the register's 23 template names are 23 templates or
variants of the 9 that carry the metadata pattern system."_ This conflict adds a third candidate (12)
with an independent source, and adds the question of whether "CMS content type" and "template" are the
same axis. **Unresolved.** Every per-template and per-collection requirement below (`RU-04`, `RU-07`,
`RU-08`, `RU-22`) is quantified against whichever figure is confirmed; none assumes one.

### C-02 · hreflang values and `/sa-en/`

| Locale    | Source document                                 | `docs/spec/locales.md`                         | `src/shared/config/locales.ts` today              |
| --------- | ----------------------------------------------- | ---------------------------------------------- | ------------------------------------------------- |
| `/`       | `en`, `x-default`                               | `x-default`, `en`                              | `['x-default', 'en']`                             |
| `/de/`    | `de`                                            | `de-DE`, `de-CH`                               | `['de-DE', 'de-CH']`, `htmlLang: 'de'`            |
| `/us/`    | `en-US`                                         | `en-US`                                        | `['en-US']` — agrees                              |
| `/sa-en/` | _none_; folder exists; "reserve, not published" | **TBD**; "shell only"; controlling IFU unknown | `status: 'shell'`, `hreflang: []`, **not routed** |

Two distinct conflicts:

- **`/de/` granularity.** `de` and `de-DE`+`de-CH` are different clusters. The spec value is narrower
  and is the one implemented. The document's value would change cluster membership on every page.
- **`/sa-en/` existence.** The document gives it a **folder**, which implies a served URL space. The
  spec gives it **shell only**, and the code does not route it — a request to `/sa-en/` today does not
  resolve. "A folder that exists but is not published" and "a locale that is registered but not routed"
  are not the same state, and the difference is observable. Its controlling IFU is unknown in both.

**Unresolved.** `AC-23` and `AC-05` are written so that either outcome can be asserted, but neither is
assumed.

### C-03 · Carrier

See §3. Stated here so the conflict register is complete: the document evaluates a Webflow-hosted
add-on; this project consumes Webflow headlessly. 12 of the 25 requirements stop being the platform's
responsibility and 9 change meaning.

### C-04 · Plan tier

`AGENTS.md`: _"Webflow plan tier, and therefore CMS collection and locale limits"_ is an open decision.
The requirements that cannot be evaluated or costed until it is resolved:

`RU-01` (four locales exist at all) · `RU-03` (an unpublished locale still consumes a locale slot) ·
`RU-04` (per-locale draft state) · `RU-05` (per-locale slug field) · `RU-07` (per-locale asset and PDF
storage) · `RU-08` (variant model) · `RU-10` (non-inheriting pages) · `RU-11` (inheritance control) ·
`RU-12` (machine-translation controls) · `RU-13` (export/API access) · `RU-14` (per-locale roles) ·
`RU-18` (per-locale indexation flags).

That is **12 of 25 gated on one commercial decision**, including the whole of §3.3 except `RU-13`'s
identifier requirement. A platform evaluation run before the tier is known produces a verdict that the
tier can invalidate.

### C-05 · `RU-09` against the substitution rule

Raised separately in §6 because it is a direct tension between two binding rules, not a conflict
between documents.

### C-06 · Trailing slash

`docs/adr/0001-url-trailing-slash.md` is open, and `canonicalPath()` in
`src/shared/config/locales.ts` currently picks the slashless form provisionally. Every criterion that
asserts a **URL string** — `AC-01`, `AC-10`, `AC-23`, `AC-24`, `AC-28`, `AC-29`, `AC-33`, `AC-36` —
asserts the form that ADR-0001 settles. They are written against "the single form chosen by
`canonicalPath()`" so they do not have to be rewritten when it is settled, but they cannot be run as
acceptance until it is.

---

## 5. Requirements

### Structure and URL

---

#### RU-01 · Locales as subfolders on one domain, with our folder names

**MUST** · Layer: **`APP`** · `PLAT` (headless: see §3.1) · **[DUP]**

Already ours under `seo-requirements.md` ("URL tree implementation") and implemented in
`src/shared/config/locales.ts` + `src/proxy.ts`. Under a Webflow-hosted carrier this would be the
platform's; under a headless carrier the platform's folder naming is an API addressing concern only.

- **AC-01** — For every routed locale, a request to `https://<host><prefix>/<path>` returns `200` and
  the response carries `<html lang>` equal to that locale's registry `htmlLang` (not its locale id:
  `us` → `en-US`). The default locale is served unprefixed; `/en/...` returns a single `308` to the
  unprefixed form. No locale is served from a subdomain, a ccTLD or a query parameter. _Proven by:_
  served-HTML assertion per locale in the e2e suite, against the URL form settled by ADR-0001 (C-06).
- **AC-02** — The platform exposes each locale as a stable, addressable identifier that can be passed
  on a content request, and that identifier is independent of the public folder name, so a folder
  rename does not change content addressing. _Proven by:_ two content requests for the same item in two
  locales returning different field values under the same item id; platform API documentation naming
  the identifier as stable.

---

#### RU-02 · Identical page tree in every locale; no locale returns 404 for a page another locale has

**MUST** · Layer: **`APP`**, `CMS`, `PROC`

`locales.md` CLUSTER RULE: _"A locale that cannot yet carry a page serves the substituted slot, not a
404."_ `locales.md` scoped work: _"Structural parity check across locales: same slots, substituted
content, no missing pages."_

A precision the source document does not make, and that `docs/adr/0002-built-routes-gate.md` forces:
a route that is **not built at all** legitimately returns 404 — in _every_ locale. The requirement is
not "nothing 404s", it is "no locale differs from another".

- **AC-03** — For every published register URL, a request to that path in each routed locale returns
  `200` and the response contains the same mandatory slots in the same order as the root locale
  (`docs/spec/templates.md`, "Mandatory slots" and "Block order"). No locale returns `404`, and none
  returns a redirect to another locale. _Proven by:_ automated per-locale structural parity check over
  served HTML — the "per-locale QA and hreflang regression" item in `locales.md`.
- **AC-04** — For every path **not** in the built-route set, every routed locale returns the identical
  status. A path that 404s in one locale 404s in all. _Proven by:_ the same parity check, asserting
  status equality across locales rather than `200`.

---

#### RU-03 · A locale can exist without being published

**MUST** · Layer: `PLAT`, **`APP`**, `PROC`

`locales.md`: `/de/` is `GATED` pending German-language claims review; `/sa-en/` is shell only.
`src/shared/config/locales.ts` already models this as `live | gated | shell`, and
`src/shared/seo/sitemap.ts` already restricts sitemap partitions to `live`.

- **AC-05** — A locale marked not-published produces **no sitemap partition**, appears in **no**
  sitemap index, and none of its URLs is submitted for indexing; a single registry status field is the
  only switch that changes this, and flipping it requires the locale-level review named in
  `locales.md`. _Proven by:_ sitemap output assertion plus a unit test that the publishable-locale set
  is derived from status alone.

> **Open (§9, D-03).** Whether a gated locale is served publicly with `noindex` or is not served at
> all is **not stated in any spec**. `AC-05` asserts only sitemap and indexing exclusion, which holds
> under both readings. The question interacts with `RU-14`: reviewers need to see the gated locale
> somewhere.

---

#### RU-04 · Staged publication inside a locale: individual pages and CMS items held as draft per locale

**MUST** · Layer: **`PLAT`**, `CMS`, `APP`, `PROC`

Required because the gate axis and the locale axis are independent: `page-register.md` carries a per-page
claims gate (`LOW`/`MEDIUM`/`HARD`/`RESERVED`) and `locales.md` carries a per-locale gate. A page may be
clear at root and not clear in German. Without per-locale draft state, a locale publishes all-or-nothing.

Gated on plan tier (C-04).

- **AC-06** — A single CMS item can be in a published state for one locale and a draft state for
  another at the same time, and that state is readable per locale through the content API. _Proven by:_
  editor-side demonstration plus an API response showing divergent per-locale publish state for one
  item id.
- **AC-07** — When an item is draft in a locale, that locale's page serves **the substituted slot**:
  it does not return `404`, does not redirect, and **does not fall back to the root locale's text**.
  _Proven by:_ served-HTML assertion for the draft locale showing the slot present, the root string
  absent, and no placeholder copy (`claims-guardrails.md` rule 7).

> Silent root fallback is the dangerous default here. A platform that fills an unpublished locale from
> the root version is importing one market's permissions into another — the failure `RU-10` and `RU-11`
> exist to prevent. A platform whose draft behaviour is "fall back to the primary locale" fails `AC-07`
> even though it passes `AC-06`.

---

#### RU-05 · Localised (German) slugs for `/de/` pages and CMS items

**SHOULD** (capability) · **MUST** (control, if the capability is adopted) · Layer: `PLAT`, `CMS`, `APP`, `PROC`

The only requirement the source document marks optional: _"желательно, если платформа позволяет; не
обязательно."_ It is recorded as SHOULD on that authority alone — no spec line downgrades it.

The control on it is not optional. `claims-guardrails.md` rule 2 and the register's METADATA CONTROL
RULE make a slug an external statement subject to the same review as body copy. `locales.md` adds:
_"Controlled vocabulary and status values remain in English — they are an interface, not copy."_

- **AC-08** — _(SHOULD)_ If per-locale slugs are supported: a per-locale slug field exists, and
  changing it updates that locale's canonical, its entry in every other locale's hreflang cluster, its
  sitemap entry and every internal link to it **in the same publish**, with a single-hop `301` from the
  previous form. _Proven by:_ served-HTML assertion on all four surfaces plus a redirect check. If not
  supported, the English slug is used in `/de/` and that is recorded as an accepted limitation, not a defect.
- **AC-09** — _(MUST, conditional)_ No localised slug is published without passing the claims review
  cycle named in `seo-requirements.md` ("Metadata claims QA gate"). A slug field that any editor can
  change without that step fails this criterion regardless of `AC-08`. _Proven by:_ the publication
  workflow definition plus `RU-14`'s permission model.

---

#### RU-06 · 301 redirects that work for addresses inside locales

**MUST** · Layer: **`APP`** (headless) / `PLAT` (hosted) · **[DUP]**

Already ours under `seo-requirements.md` ("Redirect map build and QA (301 / 410)") and partly
implemented in `src/shared/seo/redirects.ts` and `src/proxy.ts`.

- **AC-10** — Every rule in the approved redirect map resolves in **one hop** to a `200` target, and
  the same rule applies within each routed locale prefix as it does at the root. No chain, no loop, no
  redirect into a different locale. The four URLs WS-D retires with `410` return `410` in every locale.
  _Proven by:_ an automated crawl of the full redirect map, per locale, on staging and again after
  launch, asserting status and `Location` per hop.

> **Gap found.** `src/shared/seo/redirects.ts` is consulted in `src/proxy.ts` against the raw
> `pathname`, which for a prefixed locale still carries `/de` or `/us`. Whether the legacy map is
> expected to match inside a locale prefix at all is not stated in `seo-requirements.md` — the map is
> written as root-relative legacy paths. For `/architect`: the question is whether legacy URLs ever
> existed under a locale prefix on the old site. If they did not, `AC-10`'s per-locale clause is
> satisfied vacuously and should be recorded as such rather than built.

---

### Content

---

#### RU-07 · Localisation of static pages, CMS collections, components, forms, images, alt text and PDFs

**MUST** · Layer: **`PLAT`**, **`CMS`**, `APP`, `PROC`

Each market is governed by its own IFU, so each asset class can carry market-specific content. Alt
text, form labels, button labels and error messages are named claim surfaces in
`claims-guardrails.md` rule 1. The PDF class is the sharpest: `page-register.md` carries
`/training/instructions-for-use` at locale scope _"Per-market IFU, never shared"_.

Gated on plan tier (C-04). Under a headless carrier, components and forms are ours
(`src/shared/i18n/locales/<locale>/*.json`, already in place for all four locale ids), and the
platform's share is CMS content, images, alt text and PDF references.

- **AC-11** — For each of: static page text, CMS collection fields, component text, form labels and
  validation messages, and image alt text — a per-locale value can be stored, retrieved and rendered,
  and the served HTML of a locale contains **only** that locale's value for every one of the five
  classes. _Proven by:_ one worked example per class, asserted in served HTML for at least two locales.
- **AC-12** — A binary asset (image, PDF) can be bound per locale, and the IFU document linked from a
  locale's page resolves to that market's controlling document as named in `locales.md` (EU IFU v11.0
  §5 for `/` and `/de/`, US IFU v15.0 §5.1 for `/us/`). _Proven by:_ asserting the `href` of the
  document link per locale and confirming the bound file identity with the document owner.

> Serving the wrong market's IFU is a regulatory failure of the same class as `RU-10`, even though the
> brief does not list `RU-07` among the five claims-boundary items. It is flagged here rather than
> reclassified.

---

#### RU-08 · Slot-level substitution: same position, different content; the rest of the page inherits

**MUST** · **[CLAIMS]** · Layer: **`PLAT`**, **`CMS`**, `APP`, `PROC`

`locales.md` SUBSTITUTION RULE, verbatim: _"where a market does not permit a statement, the slot is
substituted, never deleted. Deleting a slot produces divergent page structures across locales and
breaks the hreflang cluster."_ `locales.md` scoped work: _"/us/ claims substitution layer in the CMS —
Slot-level variant management so a US page inherits the root structure and substitutes only the gated
slots. Built once, used by every future page."_

**What a failure allows onto a page.** Without slot-level substitution the team has two options, and
both are prohibited. Either the root slot renders unchanged in `/us/` — which puts the EU-permitted
time-based wording listed in the `locales.md` prohibited column for `/us/` onto a US page governed by
US IFU v15.0 §5.1 — or the slot is deleted to avoid that, which violates `claims-guardrails.md` rule 5,
produces divergent page structures and breaks the hreflang cluster. This single requirement is the
mechanism that makes the `/us/` locale possible at all; `locales.md` gates the entire locale on it
("HARD GATE: substitution list for every time-based slot signed off by QARA/Regulatory before the
locale opens").

Gated on plan tier (C-04).

- **AC-13** — For a slot marked substituted in a locale, the **entire served response body** for that
  locale contains the substituted string and **zero occurrences** of the root string — including
  `<head>`, meta and Open Graph values, JSON-LD, `data-` attributes, inline scripts and any
  serialised hydration payload. _Proven by:_ full-response-body assertion, not a DOM query, and not a
  visible-text query.
- **AC-14** — A substitution defined once at slot or template level applies to every page on that
  template with no per-page re-entry: adding a new page on the template inherits the substitution
  automatically. _Proven by:_ creating a new instance on a template that carries a substitution and
  asserting the substituted value in its served HTML without further configuration.

---

#### RU-09 · Server-side hiding of a block in a locale: prohibited wording must not reach that locale's HTML at all

**MUST** · **[CLAIMS]** · Layer: **`PLAT`**, **`APP`**, `CMS`

**What a failure allows onto a page.** A prohibited formulation present in the HTML of a market whose
IFU forbids it, merely not visible. `display:none`, a hidden attribute, a collapsed accordion or a
client-side filter all fail: crawlers, AI answer engines, view-source, reader modes, assistive
technology and content scrapers all read it, and it is published wording in that market. The whole
premise of `seo-requirements.md` — that served HTML is what search and answer engines consume — makes
"hidden but present" indistinguishable from "published".

**See §6 for the tension between this requirement and the substitution rule. It is material and is not
settled here.**

Under a headless carrier this requirement largely migrates to `APP`: a platform-side visibility toggle
protects nothing if our single API credential returns every locale's fields and our renderer decides
what to emit (§3.2).

- **AC-15** — For each formulation on a locale's prohibited list in `docs/spec/locales.md`, the served
  response body for every URL in that locale contains **zero occurrences**, across markup, attributes,
  metadata, JSON-LD and any inline or serialised payload. _Proven by:_ a per-locale prohibited-string
  scan over the full response body of every published URL, run in CI, with the term list sourced from
  `locales.md` and never from a developer's reading of it.
- **AC-16** — The same response still carries the slot in its mandated order position: the response
  that proves `AC-15` also passes the structural parity check of `AC-03`. A response that satisfies
  `AC-15` by removing the slot fails. _Proven by:_ running both assertions over one captured response.

---

#### RU-10 · Whole pages with their own market text and no inheritance from the root

**MUST** · **[CLAIMS]** · Layer: **`PLAT`**, **`CMS`**, `PROC`

`page-register.md` carries locale scope values _"Per-market IFU, never shared"_ and _"Per-market
wording, never shared"_ — regulatory-status and instructions-for-use pages are not variants of a root
page, they are different documents.

**What a failure allows onto a page.** The EU regulatory-status wording, governed by EU IFU v11.0 §5,
served at a `/us/` URL — a statement about regulatory status made to a market whose status is governed
by a different document and whose prohibited list includes _"approved" in relation to FDA_. This is the
most direct possible form of the failure `AGENTS.md` names as a non-negotiable: _"No permission crosses
a market."_ It is also the hardest to detect after the fact, because the page looks correct — it is
simply the wrong market's document.

Gated on plan tier (C-04).

- **AC-17** — For a page flagged never-shared, editing the root version produces **no change** in any
  other locale's served HTML, and a locale for which no version has been authored serves no root text:
  it serves the substituted state or the page does not publish in that locale at all.
  _Proven by:_ edit the root version, re-fetch every locale, assert byte-equality of the other locales'
  responses against their pre-edit capture.

---

#### RU-11 · Inheritance control: a root edit does not silently propagate, or the drift is visible

**MUST** · **[CLAIMS]** · Layer: **`PLAT`**, `PROC`

**What a failure allows onto a page.** A page that QARA/Regulatory and Clinical/Medical have cleared
changing its wording after clearance, without anyone being told. The review in
`seo-requirements.md` ("Two structured review cycles … Reviewer functions are the authority on claim
boundaries") attaches to a specific string at a specific time. Silent propagation detaches the approval
from the text it approved, and — because nobody can enumerate which locales drifted — it also destroys
the ability to re-review only what changed. The result is a published German or US page carrying
wording no reviewer has seen, with no signal that this is the case.

The source document offers a weaker fallback ("или хотя бы видно, что изменилось" — or at least the
change is visible). That fallback is accepted as satisfying this requirement, because a visible,
enumerable drift state preserves the re-review path. Invisible propagation does not.

Gated on plan tier (C-04).

- **AC-18** — After a reviewed root string is changed, each other locale either (a) shows no change in
  its served HTML, or (b) enters an explicit "source changed, needs review" state that is visible in
  the editor **and** queryable through the API before publication, naming the field that drifted.
  A platform that propagates with no such state fails. _Proven by:_ capture every locale's response,
  change the root string, re-capture; assert (a) byte-equality, or (b) the drift state present in the
  API response and the locale not publishable until it is cleared.

---

#### RU-12 · Machine translation and automatic translation updates can be switched off

**MUST** · Layer: **`PLAT`**, `PROC`

`claims-guardrails.md` rule 1: _"Never invent, paraphrase, **translate**, shorten or 'improve' clinical,
evidence, regulatory or economic wording."_ `locales.md`: the German surface is _"transcreated, not
translated"_, against a locked German controlled vocabulary.

Not counted among the five `[CLAIMS]` items per the brief, but it carries the same class of risk: a
machine translation of an approved clinical sentence is, by definition, unapproved clinical wording in
a regulated market. A default-on auto-translate feature is an active hazard, not a neutral convenience.

Gated on plan tier (C-04).

- **AC-19** — Machine translation and automatic re-translation on source change are disabled at site
  level, cannot be re-enabled per field or per item by an editor without an administrator action, and
  no field in any locale has ever been written by an automated translation job. _Proven by:_ the
  platform's settings export or admin screen, plus an audit log or field-provenance query showing no
  machine-written values.

---

#### RU-13 · Import and export of text for the translator (CSV, API or TMS)

**MUST** · Layer: **`PLAT`**, `PROC`, `APP` (headless: the export may be ours)

Required by the volume of transcreation in `locales.md` (the full launch set for `/de/`) and by the
fact that claims review happens **outside** the CMS: reviewers work on documents, and their approval
has to be traceable back to the exact field it approved.

Gated on plan tier (C-04) for API access.

- **AC-20** — A complete per-locale export of every localisable string — static text, CMS fields,
  metadata, alt text — round-trips: re-importing an unmodified export produces an empty diff, keys are
  stable across exports of the same content, and every exported string carries a stable identifier that
  resolves back to one field on one item in one locale. _Proven by:_ export → re-import → assert empty
  diff; export twice across an unrelated edit → assert key stability; resolve three identifiers back to
  their fields.

---

#### RU-14 · Per-locale editor permissions, and locale preview before publication

**MUST** · Layer: **`PLAT`**, `APP` (preview rendering, headless), `PROC`

`AGENTS.md`: _"No permission crosses a market."_ That is stated as a content rule; a per-locale editor
role is the operational control that keeps a well-meaning editor from implementing it incorrectly.
Preview is required by `locales.md`: German publication is gated on a review that has to happen before
publication, which means the reviewer must see the page in a non-published state.

Gated on plan tier (C-04) — per-locale roles are typically a higher-tier feature.

- **AC-21** — A user granted access to one locale cannot edit or publish content in any other locale:
  the attempt fails with a permission error in the editor **and** over the API using that user's
  credentials. _Proven by:_ attempt both paths with a scoped test account and capture the refusals.
- **AC-22** — A reviewer can view a gated locale's page as it will publish — same server-rendered
  output, same slots, same substitutions — at a URL that is not indexable and not present in any
  sitemap. _Proven by:_ fetch the preview URL, assert slot and substitution parity with the intended
  published output, assert `noindex` and sitemap absence.

> Under a headless carrier `AC-22` is **ours**: the platform cannot render our page. This is the
> integration point where `RU-14` and `RU-03` meet, and it is the practical reason D-03 (§9) has to be
> answered.

---

### SEO

---

#### RU-15 · Reciprocal hreflang on every page, including `x-default`

**MUST** · Layer: **`APP`** · **[DUP]**

Already ours. `locales.md` CLUSTER RULE: _"Every locale carries a self-referencing canonical and a
complete, reciprocal hreflang cluster including x-default."_ `seo-requirements.md` scopes "hreflang
cluster implementation and return-tag validation … automated regression check". Implemented in
`buildAlternates()` (`src/shared/config/site.ts`), consumed in `src/app/[locale]/layout.tsx`.

- **AC-23** — The served HTML of every published URL in every routed locale carries a complete,
  reciprocal hreflang cluster: every member links to every other member, every member links back
  (return tags), exactly one `x-default` exists per cluster, and every advertised URL returns `200`.
  Cluster membership is exactly the set confirmed under C-02 — the `/de/` granularity and the
  `/sa-en/` membership question must be settled before this runs as acceptance. _Proven by:_ automated
  hreflang regression over served HTML, asserting reciprocity by fetching each advertised URL.

---

#### RU-16 · Self-referencing canonical in every locale

**MUST** · Layer: **`APP`** · **[DUP]**

Already ours. `locales.md` CLUSTER RULE and `seo-requirements.md` ("self-referencing canonicals on
every locale").

- **AC-24** — Each locale URL's served HTML carries **exactly one** `<link rel="canonical">`, equal to
  its own absolute URL in its own locale, in the single form chosen by `canonicalPath()`. No locale
  canonicalises to another locale, and no page canonicalises to a different path. _Proven by:_
  served-HTML assertion over every published URL per locale. Blocked as acceptance by C-06.

---

#### RU-17 · Localisable title, description, H1, Open Graph and `html lang`

**MUST** · Layer: **`PLAT`**, **`CMS`** (storage), **`APP`** (emission) · **[DUP]**

Partly ours. `claims-guardrails.md` rule 2 and the METADATA CONTROL RULE make all four text surfaces
claim surfaces; `AGENTS.md` makes "no permission crosses a market" absolute. These therefore **must**
be per-locale: a shared title tag is a shared claim. Note that `page-register.md` holds drafted
metadata for the **root locale only** — no localised metadata exists anywhere in this repository.

`src/app/[locale]/layout.tsx` already declines to set a title or description at layout level, on
exactly this reasoning.

- **AC-25** — Title, meta description, H1 and Open Graph fields are each storable and served per
  locale, and `<html lang>` equals the registry `htmlLang` for that locale, not its locale id or its
  folder name. _Proven by:_ served-HTML assertion per locale for all five.
- **AC-26** — No locale inherits another locale's title, description, H1 or Open Graph value by
  fallback. A locale with no authored value for one of them yields an explicit empty state with a
  `TODO` owned by the SEO & AEO Lead, never a root fallback and never placeholder text
  (`claims-guardrails.md` rules 7 and 8). _Proven by:_ remove a per-locale value in a staging copy and
  assert the served HTML neither carries the root value nor invents one.

> `AC-26` is the metadata form of `AC-07` and `AC-17`. Fallback-to-source is the normal, sensible
> default of every i18n system in existence, and on this project it is a claims breach. It needs to be
> an explicit, tested negative on every text surface.

---

#### RU-18 · Page-level `noindex` within a specific locale

**MUST** · Layer: `PLAT`, `CMS` (flag), **`APP`** (emission) · **[DUP]**

Required by `seo-requirements.md` ("Canonical, pagination and indexation rules … an indexation matrix
by page type") and by the live indexation holds in `claims-guardrails.md`: the white-paper layer is
noindex until rebuilt, the case-report layer is noindex until two slugs clear review. A locale that
cannot carry the cleared version of a page needs the flag independently of the root.

Gated on plan tier (C-04).

- **AC-27** — Setting `noindex` for one locale's instance of a page emits the robots meta directive in
  **that locale's served HTML only**, leaves every other locale's response byte-identical, and removes
  that URL from that locale's sitemap partition in the same publish. _Proven by:_ set the flag,
  re-fetch all locales, assert the directive present in one and absent in the others, and assert the
  sitemap partition no longer lists it.

---

#### RU-19 · Sitemap partitioned by locale, with correct `lastmod` and a clean exclusion list

**MUST** · Layer: **`APP`** · **[DUP]**

Already ours. `seo-requirements.md`: _"sitemap partitioning by locale, lastmod discipline, exclusion
list, IndexNow configuration … Reserved nodes are excluded from the sitemap until they are built."_
Implemented in `src/app/sitemap.ts` and `src/shared/seo/sitemap.ts`.

- **AC-28** — Each publishable locale produces its own partition. Every URL in a partition returns
  `200`, is indexable, is published, is not reserved and is not a utility route. No gated or shell
  locale produces a partition at all. Each entry's `lastmod` reflects the last content change **of that
  locale's version**, not the root's. _Proven by:_ fetch each partition, fetch every URL it lists,
  assert status and robots directive; assert partition set equals the publishable-locale set; assert a
  root-only edit does not move another locale's `lastmod`.

> The per-locale `lastmod` clause is the part a platform most often gets wrong and the part this
> repository has not yet implemented: a shared `lastmod` tells crawlers that every locale changed
> whenever any locale changed, and re-submits unreviewed gated content for crawling.

---

#### RU-20 · Per-locale JSON-LD with identical entity `@id`s

**MUST** · Layer: **`APP`** · **[DUP]**

Already ours. `seo-requirements.md`: _"Stable @id entity graph for the measurement vocabulary …
Persistent @id for soft-tissue compressibility and CP Value, cited by every clinical and product page.
These are the two most citable objects on the property."_ Implemented in `src/shared/seo/ids.ts` and
`src/shared/seo/schema.ts`.

- **AC-29** — For the same page in two locales, the emitted JSON-LD differs in `url`, `inLanguage` and
  every text-bearing field, while the `@id` values for soft-tissue compressibility, the CP Value and
  the Organization are **byte-identical**. _Proven by:_ extract JSON-LD from both locales' served HTML
  and diff, asserting the `@id` set equal and the text set disjoint.
- **AC-30** — No JSON-LD text field in a locale carries a string drawn from another locale's permitted
  list. Schema values are claim surfaces under `claims-guardrails.md` rule 1 and are subject to the
  same per-market boundary as body copy. _Proven by:_ running the `AC-15` prohibited-string scan over
  the extracted JSON-LD payloads specifically, not only over the rendered markup.

---

#### RU-21 · All locale content is delivered in the server HTML, with no JS loading

**MUST** · **[CLAIMS]** · Layer: **`APP`** · **[DUP]**

Already ours, and an `AGENTS.md` non-negotiable: _"Evidence, counters, citations, reviewer fields and
definition blocks must be in the initial HTML response. The previous site shipped JavaScript-only
counters that reached crawlers as zero."_ `templates.md`: verified _"in served HTML, not in the
rendered DOM"_.

**What a failure allows onto a page.** Two distinct failures, and the second is the serious one.

1. The known regression: evidence counters that reach crawlers and answer engines as zero, so the
   property's only quantified proof is invisible to the surfaces it was written for.
2. **The claims failure:** if the locale-correct substitution is applied _after_ hydration, the initial
   HTML response carries the **root** wording. Every consumer that does not execute JavaScript —
   crawlers, AI answer engines, scrapers, reader modes, curl, anyone with JS disabled or blocked —
   receives the EU-permitted text at a `/us/` URL. The substitution layer of `RU-08` is then decorative:
   it fixes the page for humans with working JavaScript and leaves the prohibited wording in the
   document that search and answer engines actually index and quote. `AC-13` and `AC-15` are assertions
   about the **initial response body** for exactly this reason.

- **AC-31** — For every locale, the initial HTML response contains: evidence figures and counters,
  citations, reviewer and provenance fields, the definition block, the boundary slot, and all body
  copy. _Proven by:_ `curl` of the URL, or a browser fetch with JavaScript disabled — asserted against
  the response body, never against the rendered DOM.
- **AC-32** — Locale resolution requires no client JavaScript: the initial response for a locale URL is
  already in that locale, with no flash of root content and no client-side text swap. _Proven by:_
  fetching with JavaScript disabled and asserting locale-correct content, plus a hydration-stability
  check that the text does not change after hydration.

---

#### RU-22 · Indexable collection pagination in every locale

**MUST** · Layer: **`APP`**, `CMS` · **[DUP]**

`seo-requirements.md`: "Canonical, pagination and indexation rules … an indexation matrix by page
type". Applies to the register's templated URLs — publications, studies, case reports, white papers,
news, careers, people.

- **AC-33** — Each collection page _N_ in each locale is a distinct crawlable URL returning `200`, with
  a **self-referencing** canonical (never canonicalised back to page 1), its own complete hreflang
  cluster pointing at page _N_ in every other locale, and an entry in that locale's sitemap partition
  where the indexation matrix allows it. Item ordering is stable across locales, so page _N_ holds the
  same items in every locale — a direct consequence of the parity rule in `AC-03`. _Proven by:_
  served-HTML assertion on canonical and hreflang for pages 1..N per locale, plus a cross-locale
  item-identity comparison for one page _N_.

> Ordering stability is the part the source document does not ask for and parity requires. If `/de/`
> sorts a collection differently — by a localised title, say — page 2 holds different items than the
> root's page 2, and the hreflang pair at page 2 links two pages that are not translations of each
> other.

---

### Locale switching and analytics

---

#### RU-23 · The language switcher goes to the same page in the other locale, not to the home page

**MUST** · Layer: **`APP`** · **[DUP]**

Already ours. `locales.md` scoped work: _"Locale routing and language switcher — Manual locale
selection with persistence."_ `localePath()` in `src/shared/config/locales.ts` already computes the
target.

- **AC-34** — From any published URL, operating the switcher lands on the same path under the target
  locale's prefix and returns `200`. If the target locale's version is not published, it lands on that
  locale's substituted page — never on `/`, never on a `404`, never on a cross-locale redirect.
  _Proven by:_ e2e traversal of a representative URL set in both directions between every locale pair,
  asserting path equality under prefix substitution.

---

#### RU-24 · No automatic redirects by IP or browser language

**MUST** · Layer: **`APP`** · **[DUP]** · _Settled constraint — carried in, not re-opened_

`AGENTS.md` non-negotiable: _"No geo-redirection and no `Accept-Language` negotiation, ever. The
visitor chooses the locale."_ `locales.md` CLUSTER RULE and the guardrail: _"no IP-based auto-redirect
— it hides locale-specific claims boundaries from the reader and from crawlers."_ Already honoured in
`src/proxy.ts` and `src/shared/i18n/settings.ts`, both of which document the prohibition at the point
where the behaviour would otherwise be added.

- **AC-35** — Across a matrix of `Accept-Language` values and geo-indicating headers
  (`CF-IPCountry`, `X-Forwarded-For`, and any CDN equivalent in use), requests to the same URL return
  the identical status, the identical locale content and no `Location` header. No HTML response carries
  `Vary: Accept-Language`. No shipped client bundle contains a geo- or language-based redirect.
  _Proven by:_ a header-matrix request suite in e2e asserting response equality, plus a bundle scan.

---

#### RU-25 · The visitor stays in the chosen locale; all internal links stay in-locale; no JS redirects

**MUST** · Layer: **`APP`** · **[DUP]** · _Settled constraint — carried in, not re-opened_

`locales.md`: _"the user chooses the locale and the choice is remembered."_

- **AC-36** — In a locale's served HTML, every internal link target carries that locale's prefix —
  navigation, footer, breadcrumbs, in-body links, the three permitted cross-silo routes, JSON-LD `url`
  values, the canonical and `og:url`. The only element that targets another locale is the switcher.
  _Proven by:_ extract every internal URL from the served HTML of each locale and assert prefix
  conformance; a single escape to another locale fails the criterion.
- **AC-37** — Persistence records only an **explicit** choice, made through the switcher. It is never
  written from a geo or `Accept-Language` signal, and it never produces a redirect: a visitor who
  requests `/de/<path>` directly is served `/de/<path>`, whatever is stored. _Proven by:_ request a
  locale URL with a conflicting stored preference and assert `200` at the requested URL with no
  redirect and no content swap.

> `AC-37` closes the loophole that persistence normally opens. "Remember the choice and apply it on the
> next visit" is one line of code away from "redirect the visitor away from the URL they asked for",
> which is `RU-24`'s prohibition arriving through a different door — and it would break every shared
> link, every crawl and every hreflang return-tag check.

---

## 6. `RU-09` against the substitution rule — reported, not settled

The brief asks that item 9 be checked against the substitution rule. There is a real tension.

**`RU-09` says:** a block prohibited for a market must not reach that locale's HTML, _even hidden_ —
which reads as a request for a **server-side removal** capability.

**`claims-guardrails.md` rule 5 and the `locales.md` SUBSTITUTION RULE say:** the slot is substituted,
**never deleted**; deleting produces divergent page structures across locales and breaks the hreflang
cluster. `AGENTS.md` repeats it as a non-negotiable.

The two are compatible under exactly one reading, and incompatible under the obvious one:

| Reading                                                                                                                                                                                                                                                                                                                                              | Outcome                                                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Compatible.** `RU-09` is a statement about the **string**; the substitution rule is a statement about the **slot**. The slot stays, in its mandated order position; its prohibited content is replaced server-side and the prohibited string is absent from the response. `RU-09` is then the negative half of `RU-08`, not a separate capability. | Satisfies `AC-15` **and** `AC-16`.                                                                                                                                    |
| **Incompatible — platform-side visibility toggle.** The platform implements "hiding" as `display:none`, a hidden attribute or a client-side filter.                                                                                                                                                                                                  | Fails `AC-15`: the prohibited wording is in the HTML of a market whose IFU forbids it.                                                                                |
| **Incompatible — structural removal.** The platform implements "hiding" as dropping the block from the locale's page.                                                                                                                                                                                                                                | Fails `AC-16` and `AC-03`: divergent structure across locales, which the substitution rule exists to prevent and which `locales.md` says breaks the hreflang cluster. |

`AC-15` and `AC-16` are deliberately written as a **pair that must pass on one captured response**, so
that a platform cannot satisfy one by breaking the other. That is the testable form of the tension.

What is **not** settled here: whether a block exists on these templates that has _no_ valid substitute
in some market — a block that can only be removed, because there is nothing permitted to say in its
place. `templates.md` names three mandatory slots (answer-first block, provenance/medical-review
signature, boundary slot) and none of them can be absent. If such a block is found during content
production, this tension stops being theoretical and becomes a question for QARA/Regulatory and the
SEO & AEO Lead jointly. **Escalated, not resolved** (§9, D-05).

---

## 7. Settled constraints carried into the criteria

These were given as settled and are not re-opened anywhere above. Each is recorded with the criterion
that enforces it, so a later reader can see it was carried rather than assumed.

| Settled constraint                                                                                     | Source                                                                 | Enforced by                                                                     |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| No geo-redirection, no `Accept-Language` negotiation; the visitor chooses and the choice is remembered | `AGENTS.md`; `locales.md` CLUSTER RULE; source items 24, 25            | `AC-35`, `AC-37`                                                                |
| Locale parity is structural: same slots, same order, content substituted, never deleted, never a 404   | `claims-guardrails.md` rules 5, 6; `locales.md`; source items 2, 8, 10 | `AC-03`, `AC-04`, `AC-07`, `AC-13`, `AC-16`, `AC-17`                            |
| Evidence, counters, citations, definition blocks and all locale content in the initial HTML response   | `AGENTS.md`; `templates.md`; source item 21                            | `AC-31`, `AC-32`; and as the response-body basis of `AC-13`, `AC-15`            |
| No market imports another market's permissions; `/de/` and `/us/` are HARD-gated                       | `AGENTS.md`; `locales.md`; `claims-guardrails.md` rule 4               | `AC-05`, `AC-07`, `AC-11`, `AC-12`, `AC-17`, `AC-18`, `AC-21`, `AC-26`, `AC-30` |

---

## 8. Coverage map

| RU  | Short title                                               | Strength                 | Layers                       | Markers             | ACs          |
| --- | --------------------------------------------------------- | ------------------------ | ---------------------------- | ------------------- | ------------ |
| 01  | Locale subfolders, our folder names                       | MUST                     | **APP**, PLAT                | DUP                 | AC-01, AC-02 |
| 02  | Identical tree, no per-locale 404                         | MUST                     | **APP**, CMS, PROC           |                     | AC-03, AC-04 |
| 03  | Locale exists but unpublished                             | MUST                     | PLAT, **APP**, PROC          |                     | AC-05        |
| 04  | Per-locale draft for pages and items                      | MUST                     | **PLAT**, CMS, APP, PROC     |                     | AC-06, AC-07 |
| 05  | Localised German slugs                                    | SHOULD / MUST-if-adopted | PLAT, CMS, APP, PROC         |                     | AC-08, AC-09 |
| 06  | 301s that work inside locales                             | MUST                     | **APP** / PLAT               | DUP                 | AC-10        |
| 07  | Localise pages, CMS, components, forms, images, alt, PDFs | MUST                     | **PLAT**, **CMS**, APP, PROC |                     | AC-11, AC-12 |
| 08  | Slot-level substitution                                   | MUST                     | **PLAT**, **CMS**, APP, PROC | **CLAIMS**          | AC-13, AC-14 |
| 09  | Server-side absence of prohibited wording                 | MUST                     | **PLAT**, **APP**, CMS       | **CLAIMS**          | AC-15, AC-16 |
| 10  | Non-inheriting per-market pages                           | MUST                     | **PLAT**, **CMS**, PROC      | **CLAIMS**          | AC-17        |
| 11  | Inheritance control / visible drift                       | MUST                     | **PLAT**, PROC               | **CLAIMS**          | AC-18        |
| 12  | Machine translation switched off                          | MUST                     | **PLAT**, PROC               | _(same risk class)_ | AC-19        |
| 13  | Import/export for translation                             | MUST                     | **PLAT**, PROC, APP          |                     | AC-20        |
| 14  | Per-locale permissions and preview                        | MUST                     | **PLAT**, APP, PROC          |                     | AC-21, AC-22 |
| 15  | Reciprocal hreflang with x-default                        | MUST                     | **APP**                      | DUP                 | AC-23        |
| 16  | Self-referencing canonical                                | MUST                     | **APP**                      | DUP                 | AC-24        |
| 17  | Localisable title, description, H1, OG, html lang         | MUST                     | PLAT, **CMS**, **APP**       | DUP                 | AC-25, AC-26 |
| 18  | Per-locale page noindex                                   | MUST                     | PLAT, CMS, **APP**           | DUP                 | AC-27        |
| 19  | Per-locale sitemap, lastmod, exclusions                   | MUST                     | **APP**                      | DUP                 | AC-28        |
| 20  | Per-locale JSON-LD, shared @id                            | MUST                     | **APP**                      | DUP                 | AC-29, AC-30 |
| 21  | All locale content in served HTML                         | MUST                     | **APP**                      | **CLAIMS**, DUP     | AC-31, AC-32 |
| 22  | Indexable per-locale pagination                           | MUST                     | **APP**, CMS                 | DUP                 | AC-33        |
| 23  | Switcher targets the same page                            | MUST                     | **APP**                      | DUP                 | AC-34        |
| 24  | No IP or browser-language redirect                        | MUST                     | **APP**                      | DUP                 | AC-35        |
| 25  | Stay in locale; in-locale links only                      | MUST                     | **APP**                      | DUP                 | AC-36, AC-37 |

**Totals.** 25 requirements · 37 acceptance criteria · 24 MUST + 1 SHOULD (with a conditional MUST) ·
5 `[CLAIMS]` + 1 same-risk-class · 15 `[DUP]`.

---

## 9. Open questions requiring a human decision

None of these is resolved in this document, and none is resolved by an agent.

| #    | Question                                                                                                                                                                                                                                                  | Owner                                       | Blocks                                                                 |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------- |
| D-01 | **Platform choice.** Is Webflow Localize adopted, is another platform adopted, or is per-locale modelling built on plain Webflow collections plus our own layer? §3 shows that under a headless carrier the add-on is evaluated on 10 of 25 requirements. | Project lead + SEO & AEO Lead               | `RU-03`, `RU-04`, `RU-05`, `RU-07`, `RU-08`, `RU-10`–`RU-14`           |
| D-02 | **Webflow plan tier** (`AGENTS.md` open decision). Four locales, the CMS content-type count and per-locale draft state all depend on it.                                                                                                                  | Client + project lead                       | 12 requirements, see C-04                                              |
| D-03 | **Gated-locale serving.** Is a gated locale served publicly with `noindex`, or not served at all? No spec states it, and `RU-14`'s reviewer preview needs an answer.                                                                                      | SEO & AEO Lead + QARA/Regulatory            | `AC-05`, `AC-22`, `AC-27`                                              |
| D-04 | **`/sa-en/` status and hreflang.** Folder-but-unpublished (document) or shell-and-unrouted (spec and code)? Controlling IFU and hreflang value are TBD in both.                                                                                           | QARA/Regulatory + SEO & AEO Lead            | `AC-01`, `AC-05`, `AC-23`                                              |
| D-05 | **`RU-09` tension.** Does any mandatory block exist that has no permitted substitute in some market? If yes, §6's compatible reading fails and the rule needs an authority decision.                                                                      | QARA/Regulatory + SEO & AEO Lead            | `AC-15`, `AC-16`                                                       |
| D-06 | **Duplication resolution.** For the 15 `[DUP]` requirements, does our implementation own the surface outright and the platform's equivalent get switched off? Naming the duplication was this task's job; choosing is an architecture decision.           | `/architect`                                | `RU-01`, `RU-06`, `RU-15`–`RU-25`                                      |
| D-07 | **Webflow Data API locale contract.** Does it expose per-locale publish state, per-locale slugs, slot-level variants, a machine-readable prohibited-block marker and stable string identifiers? Not established in this repository.                       | `/api-integration`                          | `AC-02`, `AC-06`, `AC-08`, `AC-13`, `AC-15`, `AC-20`                   |
| D-08 | **`/de/` hreflang granularity** (C-02): `de`, or `de-DE` + `de-CH`? The code implements the spec value; the client document says otherwise.                                                                                                               | SEO & AEO Lead                              | `AC-23`                                                                |
| D-09 | **Volume reconciliation** (C-01): 38 or 43 launch pages; 9, 12 or 23 templates; whether "CMS content type" and "template" are the same axis.                                                                                                              | SEO & AEO Lead                              | sizing of `RU-04`, `RU-07`, `RU-08`, `RU-22`                           |
| D-10 | **Trailing slash** — ADR-0001 is open (C-06). Every URL-string criterion asserts the form it settles.                                                                                                                                                     | SEO & AEO Lead + `/architect`               | `AC-01`, `AC-10`, `AC-23`, `AC-24`, `AC-28`, `AC-29`, `AC-33`, `AC-36` |
| D-11 | **German review timing.** `locales.md` makes `/de/` publication gated on German-language claims review and on the German controlled-vocabulary lock, which must be fixed _before any page is translated_. No date exists for either.                      | QARA/Regulatory + Clinical/Medical (DEP-08) | `RU-05`, `RU-11`, `RU-12`, `RU-14`, and all `/de/` content             |
| D-12 | **US substitution list.** `locales.md`: the `/us/` locale does not open until every time-based slot's substitution is signed off by QARA/Regulatory. `RU-08` is the mechanism; the list is the data, and it does not exist yet.                           | QARA/Regulatory (DEP-08)                    | `RU-08`, `RU-10`, and all `/us/` content                               |

---

## 10. Readiness

### Ready to hand to `/architect` now

Requirements that are entirely ours, trace to a settled spec line, and need no platform or commercial
decision first. They still inherit D-06 and D-10 as inputs, which is architecture's own work:

`RU-01` · `RU-02` · `RU-06` · `RU-15` · `RU-16` · `RU-19` · `RU-21` · `RU-22` · `RU-23` · `RU-24` ·
`RU-25`, plus the **emission half** of `RU-17`, `RU-18` and `RU-20`.

That is **AC-01, AC-03, AC-04, AC-10, AC-23, AC-24, AC-25, AC-27, AC-28, AC-29, AC-31–AC-37** — 17 of
the 37 — and it is the set that can be specified and regression-tested before any platform is chosen.

### Needs a human decision before it can be specified

`RU-03` · `RU-04` · `RU-05` · `RU-07` · `RU-08` · `RU-09` · `RU-10` · `RU-11` · `RU-12` · `RU-13` ·
`RU-14`, plus the **storage half** of `RU-17`, `RU-18` and `RU-20`, plus the cluster-membership input
to `RU-15`.

Mapped to §9: D-01 (platform), D-02 (plan tier), D-03 (gated-locale serving), D-04 (`/sa-en/`),
D-05 (`RU-09` tension), D-07 (Data API contract), D-08 (`/de/` hreflang), D-09 (volume),
D-11 (German review timing), D-12 (US substitution list).

### What `FE-02` in `docs/spec/fe-scope.md` is still missing

`fe-scope.md` states FE-02's required input as _"Locale strategy / route conventions from localisation
scope + confirmed EN-root architecture"_ and its acceptance criterion as _"Wires up the translation
layer and locale-ready markup for the EN copy on this page; actual /de and /us content and routing stay
in the Localisation tab."_

The current-state table in the same file already assesses FE-02's **acceptance criteria as met** — the
translation layer, the locale-ready markup and the unprefixed EN root exist in `src/shared/i18n/`,
`src/shared/config/locales.ts` and `src/proxy.ts`. What is missing is therefore not the scaffold. It is
the **required input**, which was never delivered, and which this document is the first half of.

Still missing before FE-02 can be closed rather than assessed:

1. **The locale strategy as a decision, not a description.** This document contracts what a platform
   must do. It does not say which platform, and `RU-08`'s substitution layer — the thing `/us/` depends
   on entirely — cannot be scaffolded against an unchosen model. (D-01, D-02, D-07)
2. **Cluster membership.** `buildAlternates()` emits a cluster today from the registry. Whether `/de/`
   advertises one tag or two, and whether `/sa-en/` is in the cluster at all, are open. Until they are,
   every page the project ships emits an hreflang cluster nobody has confirmed. (D-04, D-08)
3. **The URL form.** ADR-0001 is open and `canonicalPath()` is a provisional choice applied everywhere
   a URL leaves the application. Every canonical, hreflang value, sitemap entry and redirect target on
   the site currently depends on an unmade decision. (D-10)
4. **The gated-locale serving decision.** `/de` and `/us` routes exist and build today. What they
   should return to a public request has never been stated. (D-03)
5. **A non-fallback contract for the i18n layer.** `src/shared/i18n/settings.ts` currently sets
   `fallbackLng` and `fallbackNS` to the default locale. For interface strings that is conventional and
   probably correct; §5 `AC-26`, `AC-07` and `AC-17` establish that on **any** claim surface it is a
   breach. The boundary between "interface string, may fall back" and "claim surface, must not" is
   documented in `src/shared/i18n/locales/README.md` as a rule for humans. It is not enforced by
   anything. Deciding whether it should be is architecture's call.
6. **Approved EN copy for the homepage.** FE-02's own criterion is about wiring the layer "for the EN
   copy on this page", and that copy does not exist: FE-06 to FE-16 are all blocked on approved copy and
   assets, and `fe-scope.md` records DEP-08 as the only dependency marked `Gated`. FE-02 can be
   mechanically complete while having nothing approved to render.

Items 1–4 are human decisions. Item 5 is architecture. Item 6 is DEP-08 and is outside this project's
control.

---

## 11. Non-goals of this task

- No platform is selected, scored or recommended.
- No architecture, routing model, data-fetching strategy or CMS schema is designed.
- No conflict in §4 is settled; each is recorded for its named owner.
- No locale copy, claim, title, description, H1, slug, alt text or schema value is drafted, translated
  or paraphrased, in any language.
- No file outside `tasks/FE-02/` is created or modified.
