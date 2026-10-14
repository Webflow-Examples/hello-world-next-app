# Frontend Scope: FE-01 to FE-18

**Source of truth:** `docs/Compremium AG · Phase 2 Action Log.xlsx`, sheet `Action Log`.

Transcribed verbatim from the Action Log at project start. Our range is the `Front-End Development`
stream: FE-01 to FE-18, which covers **page 1 (the homepage)** only. Everything after it
reuses the foundation these items establish.

Acceptance criteria and required inputs are the contract. Do not paraphrase them, and do
not start an item whose required input does not exist - say which input is missing.

## Items (18, 64-95 h)

| ID | Cluster | WBS item | Hrs | Prio | Status |
|---|---|---|---|---|---|
| FE-01 | FE · Foundation | Project setup (scaffolding, routing, env, tooling) | 4.0-6.0 | P1 | In Progress |
| FE-02 | FE · Foundation | i18n / localization scaffold (EN root) | 2.0-4.0 | P1 | To Confirm |
| FE-03 | FE · Foundation | Design tokens & base component library (Figma -> code) | 2.0-6.0 | P2 | To Confirm |
| FE-04 | FE · Core Navigation & Global Components | Header & navigation | 6.0-8.0 | P2 | To Confirm |
| FE-05 | FE · Core Navigation & Global Components | Footer component | 4.0-6.0 | P2 | To Confirm |
| FE-06 | FE · Hero & Value Definition | Hero section (video loop, CTA, certification badges, partner logos) | 6.0-8.0 | P3 | To Confirm |
| FE-07 | FE · Hero & Value Definition | Stats bar (3 metric tiles + disclaimer) | 2.0-4.0 | P3 | To Confirm |
| FE-08 | FE · Hero & Value Definition | "Blind spot" content block (text + bullets + image) | 4.0-6.0 | P3 | To Confirm |
| FE-09 | FE · Hero & Value Definition | Compressibility definition block (intro + 4-card grid + image) | 4.0-6.0 | P3 | To Confirm |
| FE-10 | FE · Process & Engagement | Compression-to-value process block (media + 3-step list) | 2.0-3.0 | P3 | To Confirm |
| FE-11 | FE · Process & Engagement | Testimonial / quote block | 1.0-2.0 | P3 | To Confirm |
| FE-12 | FE · Process & Engagement | "What it gives the clinician" card grid | 2.0-3.0 | P3 | To Confirm |
| FE-13 | FE · Process & Engagement | Products section (1 featured + 2 "coming soon" cards) | 2.0-3.0 | P3 | To Confirm |
| FE-14 | FE · Metrics, Research & News | Key metrics section (cited stat tiles) | 2.0-3.0 | P3 | To Confirm |
| FE-15 | FE · Metrics, Research & News | Published-research card grid | 2.0-3.0 | P3 | To Confirm |
| FE-16 | FE · Metrics, Research & News | News carousel (prev/next controls) | 4.0-6.0 | P3 | To Confirm |
| FE-17 | FE · Lead Gen & Technical Docs | Contact/demo lead-gen section | 14.0-16.0 | P3 | To Confirm |
| FE-18 | FE · Lead Gen & Technical Docs | Project Technical Documentation (FE share) | 1.0-2.0 | P4 | To Confirm |

## Required input and acceptance criteria

### FE-01 - Project setup (scaffolding, routing, env, tooling)

- **Required input:** Confirmed frontend stack/CMS + repository/environment access + agreed technical architecture.
- **Acceptance criteria:** Framework/CMS scaffolding, routing, env config and lint/build tooling for the first real page - everything after this reuses the same skeleton.

### FE-02 - i18n / localization scaffold (EN root)

- **Required input:** Locale strategy / route conventions from localisation scope + confirmed EN-root architecture.
- **Acceptance criteria:** Wires up the translation layer and locale-ready markup for the EN copy on this page; actual /de and /us content and routing stay in the Localisation tab.

### FE-03 - Design tokens & base component library (Figma -> code)

- **Required input:** Innowise Design · Approved Innowise Web UI Kit / design tokens and asset exports.
- **Acceptance criteria:** Ports the brand colors/type scale into code plus every primitive this page actually uses: primary/ghost buttons, tags ('Coming soon'), form inputs, checkboxes, dropdowns, cards, icon set. Widest line here because it's page one - every later page draws on this library for free.  If need custom components, we can use some popular library (ex. Mantine, MUI) than put 20/26h

### FE-04 - Header & navigation

- **Required input:** Approved sitemap/navigation + approved header design + DEP-02 SEO/IA requirements + locale/search trigger behavior.
- **Acceptance criteria:** Logo, nav items with the dropdown submenus under Quantis ST/CVP/Clinical Evidence/Company, the EN language switcher, a search trigger and the mobile hamburger menu. Assumes the search results/indexing themselves are out of scope - this only wires the trigger icon.

### FE-05 - Footer component

- **Required input:** Approved footer design + final navigation/legal links + DEP-02 SEO/IA requirements.
- **Acceptance criteria:** Four link columns, newsletter/social row and the legal links - built once, every page reuses it.

### FE-06 - Hero section (video loop, CTA, certification badges, partner logos)

- **Required input:** Approved Homepage high-fi + approved hero copy/badges/logos + DEP-04 Header Loop + DEP-05 web-ready CGI assets.
- **Acceptance criteria:** Headline, CTA, the looping background video with its play control, the certification badges and the partner-logo strip underneath.

### FE-07 - Stats bar (3 metric tiles + disclaimer)

- **Required input:** Approved metrics/citations + medical/QARA approval + approved Homepage design.
- **Acceptance criteria:** Three metric tiles plus the 'verified by the medical department' disclaimer line - quick once the tokens exist.

### FE-08 - "Blind spot" content block (text + bullets + image)

- **Required input:** Approved problem-framing copy + image asset + Homepage high-fi.
- **Acceptance criteria:** Two-column block: problem-framing copy, an icon-bulleted list, a 'Read more' link and an image slot.

### FE-09 - Compressibility definition block (intro + 4-card grid + image)

- **Required input:** Approved definition copy/terminology + illustration/image assets + Homepage high-fi.
- **Acceptance criteria:** Intro paragraph with a 'Full definition' link, four definition cards (Controlled Pressure/Objective Metric/CP Value/Displacement Data) and an image slot.

### FE-10 - Compression-to-value process block (media + 3-step list)

- **Required input:** Approved process copy/layout + required media/CGI asset + Homepage high-fi.
- **Acceptance criteria:** Media panel with a play control paired with the numbered 1-2-3 process list (Sensor Integration/Standardised Protocol/Real-Time CP Value).

### FE-11 - Testimonial / quote block

- **Required input:** Approved quote + attribution/permission + Homepage high-fi.
- **Acceptance criteria:** Pull-quote plus attribution - a simple content block, no interaction.

### FE-12 - "What it gives the clinician" card grid

- **Required input:** Approved clinician-value copy + icons/video thumbnail assets + Homepage high-fi.
- **Acceptance criteria:** Four-card grid: one larger card with a video thumbnail, three standard icon cards. Same card primitive as the products/research grids, just a different mix.

### FE-13 - Products section (1 featured + 2 "coming soon" cards)

- **Required input:** Approved product copy + regulatory/status labels + product imagery + Homepage high-fi.
- **Acceptance criteria:** Three product cards: one 'featured' card with an image, a feature list and a CTA (Quantis CVP), two lighter 'Coming soon' cards (ICP, IT) with a disabled-style badge.

### FE-14 - Key metrics section (cited stat tiles)

- **Required input:** Approved metrics + source citations + QARA/medical sign-off + Homepage high-fi.
- **Acceptance criteria:** Two rows of three stat tiles (diagnostic accuracy, reproducibility) - every tile carries its own citation caption plus a shared footnote disclaimer. Fiddlier than a plain stat bar because of the per-tile citation typography.

### FE-15 - Published-research card grid

- **Required input:** Approved research/evidence content + links/citations + Homepage high-fi.
- **Acceptance criteria:** Three cards: icon, title, short copy, a couple of inline stats and a 'Read the article' link each.

### FE-16 - News carousel (prev/next controls)

- **Required input:** Confirmed news content model / data source + approved card design + Homepage ...
- **Acceptance criteria:** Three-card row with working prev/next controls - assumes a simple slide, not autoplay or swipe gestures.

### FE-17 - Contact/demo lead-gen section

- **Required input:** Approved form design/copy + HubSpot API/webhook access + field mapping + cons...
- **Acceptance criteria:** The heaviest block: the Product/Partnership tab switcher, the full lead form (name, email, phone, country, institution, job title, message, consent checkbox) with validation, the HubSpot hookup, and the adjacent contact-info panel.

### FE-18 - Project Technical Documentation (FE share)

- **Required input:** Implemented frontend foundation/components + final component inventory and ar...
- **Acceptance criteria:** If needed README plus a short inventory of the base components this page introduced, for whoever builds page 2.

## Cross-team dependencies

Sheet `Cross-Team Dependencies`. An FE item whose dependency is open is not ready to
start, however simple the item looks.

| Dep | From | To | Deliverable | Needed by | Status | Gate |
|---|---|---|---|---|---|---|
| DEP-01 | VOKA CMO / SEO-AEO | Innowise UX/UI Design | Page briefs + structural wireframes, including mandatory block order for 12 templates / launch pages | Before each template enters high-fi design | To Confirm | SEO brief accepted for design input |
| DEP-02 | VOKA CMO / SEO-AEO | Innowise Web Dev | Metadata pattern system, schema/SEO requirements, URL tree, indexation/canonical rules | Before technical SEO implementation / relevant FE build | To Confirm | Technical specification frozen |
| DEP-03 | VOKA / SEO-AEO + Innowise Dev lead | Innowise PM / Resource Plan | Ownership and split of the 116–170h WS-D Development implementation | Before capacity and execution timeline are baselined | Open | Owner / overlap decision |
| DEP-04 | VOKA 3D Production | Innowise Web Dev | Homepage Header Loop / web-ready CGI video asset | Before Homepage final integration / QA | Planned | Kickoff choice: Standard vs Fast-track remains available |
| DEP-05 | VOKA 3D Production | Innowise UX/UI + Web Dev | Approved hero frames / high-resolution stills and relevant CGI/3D assets for web use | Before final design/FE QA where those assets are used | Planned | Asset list and web-ready formats confirmed |
| DEP-06 | Innowise Brand / UX/UI | VOKA 3D Production + Innowise Web Dev | Approved brand direction, typography, color system and design tokens | Before CGI look-dev lock and FE tokens-to-code | To Confirm | Brand direction approved |
| DEP-07 | Innowise UX/UI | VOKA 3D Production | Approved Homepage structure / high-fi layout and media placement requirements | Before final web asset render specs are locked | To Confirm | Homepage media slots approved |
| DEP-08 | Client QARA / Clinical / Patrick | VOKA SEO/AEO + Innowise UX/UI / Web | Claims approvals and consolidated feedback | Before publishing affected pages/metadata/content | Gated | Formal claims sign-off |

### Risk if late (verbatim)

- **DEP-01:** Design rework if visual layouts are produced before mandatory structure is frozen.
- **DEP-02:** Rework or missed SEO requirements if FE architecture is built without confirmed specs.
- **DEP-03:** Incorrect capacity plan, duplicated estimation or unowned technical work.
- **DEP-04:** Hero remains placeholder or launch readiness slips.
- **DEP-05:** Late asset replacement can trigger design and FE rework.
- **DEP-06:** CGI or FE may need rework if visual direction changes after production starts.
- **DEP-07:** Rendered CGI may not fit the final Homepage layout and require rerender/re-edit.
- **DEP-08:** Publication blocked; timeline extends when client-dependent approvals are late.

---

## Current state against this scope

Hand-written assessment. Re-check it against the repository rather than trusting it.

| Item | State | Evidence |
|---|---|---|
| FE-01 Project setup | **Acceptance criteria met.** Framework scaffolding, routing, env config and lint/build tooling are in place and every later page reuses the skeleton. | `src/`, `eslint.config.mjs`, `package.json` scripts, `.env.example` |
| FE-02 i18n / localization scaffold (EN root) | **Acceptance criteria met.** Translation layer wired, locale-ready markup, EN root unprefixed. `/de` and `/us` routes exist but carry no content, which is where the localisation scope leaves them. | `src/shared/i18n/`, `src/shared/config/locales.ts`, `src/proxy.ts` |
| FE-03 Design tokens & base component library | **Partially met; colour only.** The palette landed on 2026-10-13 and is in code, contrast-proven and recorded in ADR-0003: ten approved values, two neutrals added to close WCAG gaps, `blue` as the primary at shade 9, no dark scheme. Typography, spacing, radii, the icon set and every base component remain **blocked on DEP-06** and are still `TODO(WS-C)`. The estimate's own note applies to the component library: choosing one moves that part to roughly 20-26 h. | `src/shared/theme/colors.ts`, `src/shared/theme/theme.ts`, `src/shared/theme/colors.test.ts`, `docs/adr/0003-colour-palette.md` |
| FE-04 Header & navigation | Not started. Needs an approved sitemap and header design, plus **DEP-02** frozen. | - |
| FE-05 Footer | Not started. Needs approved design and final legal links, plus **DEP-02**. | - |
| FE-06 Hero | Not started. Needs **DEP-04** and **DEP-05**: the Header Loop and web-ready CGI assets. | - |
| FE-07, FE-14 Metric and stat tiles | Not started. Both require QARA/medical sign-off on the metrics and citations, which is **DEP-08**, the only dependency marked `Gated`. | - |
| FE-08 to FE-13, FE-15 to FE-17 | Not started. Each waits on approved copy and assets for its block; FE-17 additionally needs HubSpot access, field mapping and consent wording. | - |
| FE-18 Technical documentation | Partly ahead of schedule: `README.md`, `docs/spec/`, `docs/adr/` and `rulesets/project/` already exist. The component inventory this item asks for comes last, once the components exist. | `README.md`, `docs/` |

### Work done that is not in this scope

The repository also carries work the Action Log does not itemise, because it protects items
that come later: the specification transcription in `docs/spec/`, the typed page register, the
SEO layer with structured data and the redirect map, the agent workflow and project rules, and
the test suites. It is foundation in the sense FE-01 means: "everything after this reuses the
same skeleton."

### What is ready to start today

Only work that needs no approved copy, no approved design and no asset. In practice that means
structure, mechanisms and tests, not visible content. An item whose required input is missing
is reported as blocked, not approximated. See `claims-guardrails.md` rule 8.
