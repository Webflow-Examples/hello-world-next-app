# SEO / AEO Implementation Requirements

**Source of truth:** `docs/Compremium_Estimate_SEO_Localisation_Social (final).xlsx`,
sheet `SEO & AEO Implementation (WS-D)`. Hour columns are omitted here; read them in the spreadsheet.

Generated verbatim. The `Output / Guardrail` column is the acceptance criterion for each item.

> This estimation covers the WS-D (Search & Answer Architecture) implementation workstream on compremium.ch. It DOES NOT include clinical or evidence content authoring, medical writing, MLR review time, video production, or the localisation and social scopes, which are estimated on their own tabs. Important Dependency: no page carrying a clinical, evidence, regulatory or economic slot may publish before the Claims SSOT is formally approved within WS-B and signed off by QARA/Regulatory and Clinical/Medical. STRICT RULE: metadata is a claim surface. Title tags, meta descriptions, H1s and URL slugs are quoted verbatim in search results and in AI answers, and pass through the same claims review as body copy. Two live case-report slugs make surgical-timing and fasciotomy statements at URL level and must be cleared before migration, not after.


## Technical foundation

| Work item | Output / Guardrail |
|---|---|
| URL tree implementation (5 silos, click depth ≤3) | SEO: target tree finalised per IA Node Map v0.1 (A Corporate & platform, B Product hubs, C Clinical applications, D Evidence & research, E Evaluation, training & support), nesting rules, depth control, orphan acceptance. Dev: build of the tree in the CMS. Guardrail: orphan count 0; the clinical silo sits beside the product silo, never beneath it. |
| Redirect map build and QA (301 / 410) | SEO: legacy to target mapping including /solution to /quantis/st/, /cvp/quantis-cvp to /quantis/cvp/, /clinical-evidence to /evidence/, /publications, /white-papers, /case-reports, /career, /training-resources, and the three legal pages consolidated to two; two placeholder training pages and two test case-report pages removed with 410; chain and loop QA on staging and after launch. Dev: implementation of the rules at server level. |
| Canonical, pagination and indexation rules | SEO: rules and an indexation matrix by page type, self-referencing canonicals on every locale. Dev: implementation in templates. Guardrail: the case-report layer is currently noindexed although it is the only first-party clinical proof on the property; indexation is restored only after the claims review of the two affected slugs. |
| Server-side rendering of evidence and counter components | SEO: requirement definition and verification in served HTML, not in the rendered DOM. Dev: the rendering work itself. The existing evidence counters are JavaScript-only and render as zero to crawlers and to AI answer engines. |
| XML sitemap set, robots.txt and IndexNow | SEO: sitemap partitioning by locale, lastmod discipline, exclusion list, IndexNow configuration. Dev: generation and serving. Reserved nodes are excluded from the sitemap until they are built. |
| Core Web Vitals and rendering remediation | SEO: audit across the nine templates, prioritised defect list, re-measurement and acceptance on field data. Dev: the optimisation work. LCP, INP and CLS pass measured on the template, not on a single sample page. |
| Internal linking implementation and cross-silo routes | SEO: route matrix, anchor rules, acceptance. Dev: implementation of the link modules. Three permitted cross-silo routes only: clinical question to product entity, claim to evidence object, any page to evaluation. STRICT RULE: no link from the research horizon back into a product benefit slot. |

## On-page and metadata

| Work item | Output / Guardrail |
|---|---|
| Metadata pattern system per template (9 templates) | SEO: title, description, H1, breadcrumb and Open Graph patterns for corporate-home, product-hub, entity, clinical-question, evidence-item, trust, conversion, listing, research-horizon-item. Title <=60 characters, description 140-155. Dev: template fields and rendering. |
| Metadata production - 38 launch pages, root locale | SEO: Written to the pattern system and screened against the prohibited claims list. Dev: CMS entry support and bulk upload. See the Page & Metadata Register tab for the drafted set. |
| Answer-first block implementation | SEO: Definition or direct answer in the first block, two to three sentences, before any product mention. Applies to every entity and clinical-question page. Dev: component build. |
| Provenance and medical-review signature component | SEO: field requirements and Person / Physician schema mapping. Dev: component build. Author, medical reviewer, publication date and review date rendered on every clinical page, each linking to /company/people/<slug>. Without the reviewer layer no clinical content can publish. |
| Boundary slot component ("what this does not do") | SEO: format, mandatory-placement rule and acceptance on visual weight. Dev: component build. A mandatory, non-collapsible slot on every clinical-question and entity page. The boundary carries the same visual weight as the permission. |

## Structured data and entity graph

| Work item | Output / Guardrail |
|---|---|
| Schema architecture and implementation | SEO: type-to-template mapping, field definitions and test payloads for Organization, WebSite, MedicalDevice, MedicalWebPage, DefinedTerm, Person / Physician, MedicalScholarlyArticle, NewsArticle, JobPosting, ContactPage, BreadcrumbList, VideoObject. Dev: implementation. |
| Stable @id entity graph for the measurement vocabulary | SEO: entity register and @id scheme. Dev: persistence in templates. Persistent @id for soft-tissue compressibility and CP Value, cited by every clinical and product page. These are the two most citable objects on the property. |
| Entity consolidation and disambiguation | SEO: audit of the competing names and the replacement plan. Dev: execution across templates. VeinPress, CPMX1, CPM#1 and Compremium Quantis ST currently compete as four device names. Consolidation into one platform graph precedes any amplification. Architecture is fixed: Compremium AG → COMPREMIUM QUANTIS → Compremium Quantis ST / Veno CVP → Ortho Trauma / Sports / Military. |
| Schema validation and regression tests | Automated validation in CI so a template change cannot silently drop a reviewer or a citation field. |

## Answer engine optimisation

| Work item | Output / Guardrail |
|---|---|
| Citation-ready definition and comparison blocks | SEO: specification of the extractable definition, comparison and protocol blocks on the entity and clinical-question templates. Dev: component build.  Guardrail: evidence attributed by device layer - method, predecessor device, current device. |
| Answer-surface testing and prompt set | A fixed prompt set run across the major assistants and SERP features to observe how the platform is described and which source is cited. |
| Evidence attribution controls in extractable copy | STRICT RULE: the Sellei 2020 performance figures relate to a predecessor device and protocol. Transferring them to CPMX1 in any extractable block is prohibited. |

## Measurement and governance

| Work item | Output / Guardrail |
|---|---|
| Analytics, Search Console and event model | GA4, Google Search Console and Bing Webmaster across all locales; event model for the evaluation routes: pilot programme, lighthouse centres, request demonstration, collaborate on evidence. |
| Rank, entity and answer-visibility monitoring | Tracking split by category term, clinical question and branded entity, so category progress is not masked by brand traffic. |
| Reporting dashboard | One dashboard covering search, answer surfaces and the social channels estimated on the Social tab. |
| Metadata claims QA gate (review cycles) | Two structured review cycles with QARA/Regulatory and Clinical/Medical covering titles, descriptions, H1s and slugs. Reviewer functions are the authority on claim boundaries, not the document version number. |

## Page briefs and copy

| Work item | Output / Guardrail |
|---|---|
| Page briefs / structural wireframes (38 pages) | One brief per launch page, and the brief IS the structural wireframe: block order, mandatory slots and their sequence, what sits above the fold, what may not collapse, internal links out, target cluster and intent, answer-first formulation, prohibited formulations for that page. Includes the template block-order layer for the nine templates, produced once in the first pass and inherited by every page on that template. Guardrail: block order is a search requirement, not a design preference - the boundary slot and the definition block cannot be reordered below a product block at design stage. Output is the input to design and to development; visual design is not in this scope. |
| Body copy - non-clinical pages | Body copy written to the brief for pages carrying no clinical, evidence, regulatory or economic slot: corporate and platform, evaluation, training and support, conversion, listing and trust pages. ASSUMPTION: approximately 16 of the 38 launch pages. If the split differs after the brief stage, this line is re-quoted per page. Clinical and evidence body copy is written by medical writing in WS-B. |
| Total SEO & AEO implementation | Excludes clinical and evidence content authoring, medical writing, MLR, UX and visual design, localisation and social. |
| of which SEO specification, review and acceptance |  |
| of which development implementation |  |

## Owned social surfaces (entity graph inputs)

Source sheet: `Social - LinkedIn & YouTube`. Relevant to the frontend because profile names, descriptions
and links feed `Organization.sameAs`, and because on-site video embedding carries `VideoObject`.

> Channel architecture and metadata control for the two owned social surfaces. Both are treated as extensions of the entity graph, not as separate brands: profile names, descriptions and links feed the Organization schema through sameAs, and an inconsistency here reproduces the entity fragmentation the website programme is built to resolve. This estimation covers channel build, metadata and tracking. It DOES NOT include video production, filming, CGI or motion graphics, which are held behind the CEO review gate, nor editorial content writing, which sits in the approved LinkedIn channel strategy. STRICT RULE: a social post is external-facing copy. The prohibited claims list applies in full, and a caption may not carry a statement that the corresponding website page is not permitted to carry.

> CHANNEL RULE   A social channel may not be the first place a statement appears. Every clinical or regulatory statement published on LinkedIn or YouTube exists first on a reviewed page on compremium.ch, and the post links to it. This keeps the claim, its qualifiers and its review date together.

| Work item | Output / Guardrail |
|---|---|
| LinkedIn page rebuild and entity alignment | Name, tagline, description, products, custom button, sameAs registration. |
| LinkedIn editorial operations setup | Category templates for LI-A to LI-H, scheduling workflow, the claims check step and the 12-week calendar loaded. |
| LinkedIn post template production | Covered by the social media templates line on the ST Brand & Visual System (WS-C) tab. Not re-estimated here. |
| YouTube channel build | Branding, handle, sections, playlist architecture mirroring the five silos, channel description and keywords. |
| Video metadata, chapters, transcripts and captions | Per a launch set of ten videos, EN plus DE captions. Transcripts screened against the prohibited claims list. |
| VideoObject schema and on-site embedding component | A reusable embed that carries VideoObject markup, transcript and the link back to the source page. |
| UTM taxonomy and social-to-site attribution | One taxonomy across both channels, wired into the reporting dashboard built in WS-D. |
| Cross-channel entity and sameAs register | Single register of owned profiles and third-party listings, reconciled against the Organization schema. |
| Channel reporting | Reporting split by post category and by playlist so category building is visible separately from brand reach. |
| Total social | Excludes video production, filming, CGI and motion graphics. |
