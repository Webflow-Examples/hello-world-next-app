# Page Templates

**Derived from:** `page-register.md` (transcribed from the spreadsheet) plus the mandatory-slot and
block-order requirements stated in `seo-requirements.md`.

Two template counts exist in the source material and they are **not** the same thing:

- The register assigns **23 distinct template names** across its 51 entries (table below).
- WS-D scopes a *metadata pattern system* for **9 templates**: `corporate-home`, `product-hub`,
  `entity`, `clinical-question`, `evidence-item`, `trust`, `conversion`, `listing`,
  `research-horizon-item`. Core Web Vitals acceptance is also defined against "the nine templates".

**TBD:** whether the remaining 14 names are separate templates or variants of the nine. Resolve with the
SEO & AEO Lead before building the route layer. Until then treat the nine as the acceptance surface and
the 23 as the routing surface.

## Template → pages

| Template | Pages | URLs | Schema | Gates |
|---|---|---|---|---|
| `application-hub` | Ortho Trauma | `/clinical-applications/ortho-trauma/` | MedicalWebPage · about MedicalSpecialty | HARD |
| `clinical-question` | Acute compartment syndrome<br>Soft tissue assessment<br>Compartment pressure measurement | `.../acute-compartment-syndrome`<br>`.../soft-tissue-assessment`<br>`.../compartment-pressure-measurement` | MedicalWebPage<br>MedicalWebPage · about MedicalCondition @id | HARD |
| `conversion` | Contact<br>Collaborate on evidence<br>Pilot programme<br>Lighthouse centres<br>Request demonstration | `/contact`<br>`/research-horizon/collaborate`<br>`/evaluate/pilot-programme`<br>`/evaluate/lighthouse-centres`<br>`/evaluate/request-demonstration` | ContactPage<br>WebPage | LOW, MEDIUM |
| `conversion-hub` | Evaluate hub | `/evaluate/` | WebPage | LOW |
| `corporate-home` | Homepage | `/` | Organization + WebSite | LOW |
| `entity` | Compressibility<br>CP Value<br>System: CPMX1 + CP Probe | `/quantis/st/compressibility`<br>`/quantis/st/cp-value`<br>`/quantis/st/system` | DefinedTerm in MedicalWebPage, stable @id<br>DefinedTerm, stable @id<br>MedicalDevice (components) | HARD, MEDIUM |
| `evidence-item` | Publications<br>Studies<br>Case reports<br>White papers | `/evidence/publications/<slug>`<br>`/evidence/studies/<slug>`<br>`/evidence/case-reports/<slug>`<br>`/evidence/white-papers/<slug>` | Article<br>MedicalScholarlyArticle<br>MedicalScholarlyArticle · citation · reviewedBy | HARD |
| `hub` | Company | `/company/` | AboutPage | LOW |
| `legal` | Legal | `/legal/privacy · /legal/data-protection` | WebPage | LOW |
| `listing` | Careers | `/company/careers/<slug>` | JobPosting | LOW |
| `news` | News | `/news/<slug>` | NewsArticle | MEDIUM |
| `person` | People / Reviewers | `/company/people/<slug>` | Person · Physician for clinicians only | HARD |
| `platform-hub` | Quantis platform | `/quantis/` | WebPage + BreadcrumbList | MEDIUM |
| `platform-pillar` | Why Quantify? | `/why-quantify` | WebPage | LOW |
| `product-hub` | Quantis ST<br>Quantis CVP (Veno) | `/quantis/st/`<br>`/quantis/cvp/` | MedicalDevice<br>MedicalDevice + BreadcrumbList | HARD |
| `provenance` | How we build evidence | `/evidence/how-we-build-evidence` | WebPage | MEDIUM |
| `research-horizon-item` | Open question | `/research-horizon/<question-slug>` | MedicalWebPage | HARD |
| `reserved` | AI & analytics<br>Sports medicine<br>Military / field care<br>Health economics<br>Audience entries | `/quantis/st/ai-and-analytics`<br>`.../sports-medicine/`<br>`.../military-field-care/`<br>`/evidence/health-economics`<br>`/for/surgeons · /for/procurement · /for/clinical-research` | — | HARD, LOW, MEDIUM |
| `silo-hub` | Clinical applications hub<br>Evidence hub<br>Research horizon<br>Training hub | `/clinical-applications/`<br>`/evidence/`<br>`/research-horizon/`<br>`/training/` | CollectionPage<br>MedicalWebPage<br>WebPage | HARD, LOW, MEDIUM |
| `spec` | Specifications | `/quantis/st/specifications` | MedicalDevice · additionalProperty | MEDIUM |
| `spoke` | How it works<br>Connectivity<br>CVP how it works<br>Measurement protocol<br>Onboarding | `/quantis/st/how-it-works`<br>`/quantis/st/connectivity`<br>`/quantis/cvp/how-it-works`<br>`/training/measurement-protocol`<br>`/training/onboarding` | MedicalWebPage<br>MedicalWebPage · HowTo<br>WebPage | HARD, LOW, MEDIUM |
| `trust` | Quality & Regulatory<br>Editorial policy<br>Regulatory status<br>CVP regulatory status<br>References<br>Instructions for use | `/company/quality-and-regulatory`<br>`/company/editorial-policy`<br>`/quantis/st/regulatory-status`<br>`/quantis/cvp/regulatory-status`<br>`/evidence/references`<br>`/training/instructions-for-use` | WebPage<br>WebPage · citation[] | HARD, LOW, MEDIUM |
| `workflow` | Measurement in the care pathway | `.../measurement-in-the-care-pathway` | MedicalWebPage | MEDIUM |

## Mandatory slots

Three components are mandatory on the templates named below. They are structural requirements, not
design options.

| Slot | Required on | Rule (verbatim from WS-D) |
|---|---|---|
| Answer-first block | every `entity` and `clinical-question` page | "Definition or direct answer in the first block, two to three sentences, before any product mention." |
| Provenance / medical-review signature | every clinical page | "Author, medical reviewer, publication date and review date rendered on every clinical page, each linking to `/company/people/<slug>`. Without the reviewer layer no clinical content can publish." |
| Boundary slot — "what this does not do" | every `clinical-question` and `entity` page | "A mandatory, non-collapsible slot on every clinical-question and entity page. The boundary carries the same visual weight as the permission." |

## Block order

> Guardrail: block order is a search requirement, not a design preference - the boundary slot and the
> definition block cannot be reordered below a product block at design stage.

Consequences for implementation:

- Block order is owned by the page brief (WS-D produces one brief per launch page, and "the brief IS the
  structural wireframe"), not by the component author and not by the designer.
- The boundary slot must not be collapsible, must not be behind a tab or accordion, and must not be
  visually de-emphasised relative to the permission/benefit content on the same page.
- A template change that reorders or drops a mandatory slot is a regression. See the schema regression
  requirement in `seo-requirements.md`: "Automated validation in CI so a template change cannot silently
  drop a reviewer or a citation field."

## Citation-ready blocks

> SEO: specification of the extractable definition, comparison and protocol blocks on the entity and
> clinical-question templates. Guardrail: evidence attributed by device layer - method, predecessor
> device, current device.

The three evidence layers must stay separate in markup and in copy. See `claims-guardrails.md`.

## Server rendering

> The existing evidence counters are JavaScript-only and render as zero to crawlers and to AI answer
> engines.

Requirement: evidence and counter components are verified "in served HTML, not in the rendered DOM".
Any numeric evidence, citation, reviewer field or definition block must be present in the initial HTML
response for every locale.

## Reserved nodes

`reserved` is not a template. Per the register's status rules: "RESERVED nodes are held in the tree and
are not built, not indexed and not linked." They are excluded from the sitemap until built, and they must
not be reachable from navigation or internal links.
