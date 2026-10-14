# Slots And Block Order

Block order on this property is a search and regulatory requirement. WS-D: "block order is a
search requirement, not a design preference". The page brief, not the designer and not the
component author, owns it.

## Three mandatory slots

| Slot | Required on | Rule |
|---|---|---|
| Answer-first block | every `entity` and `clinical-question` page | The definition or direct answer is the first block, two to three sentences, before any product mention. |
| Provenance / medical-review signature | every clinical page | Author, medical reviewer, publication date and review date, each linking to `/company/people/<slug>`. Without the reviewer layer no clinical content can publish. |
| Boundary slot, "what this does not do" | every `clinical-question` and `entity` page | Mandatory and non-collapsible, carrying the same visual weight as the permission. |

## What this forbids

- The boundary slot must never be collapsed, placed behind a tab or accordion, moved below the fold relative to the permission content, or visually de-emphasised by size, contrast or colour.
- The definition block and the boundary slot must never be reordered below a product block.
- A slot is never removed to make a layout work, and never removed because a locale cannot carry it. It is substituted. Removing it diverges structure across locales and breaks the hreflang cluster.
- A design that cannot accommodate a mandatory slot is the design that changes, not the slot.

## States to specify

For every template, before implementation:

- The slot is present and filled.
- The slot is present and its content is substituted for this locale.
- The slot is present and empty because the claims gate has not cleared it. Specify what the page looks like; do not specify a placeholder sentence.
- Loading, empty, error and recovery states for anything backed by the CMS.
