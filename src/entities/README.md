# Entities

Business entities of the domain, each as an isolated slice with a public API in `index.ts`.

Candidates from `docs/spec/page-register.md`: publication, study, case report, white paper,
product, clinical question, reviewer/person, news item, open research question.

An entity owns its type, its validation at the CMS boundary, and the presentational pieces
that are meaningful without a use case. It may import only from `shared`.
