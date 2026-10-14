# i18n And Routes

## Translation scope

i18next covers **interface strings only**: navigation labels, button text, form labels and
validation messages, state descriptions, visually hidden text. Page content comes from the CMS.

- Never put clinical, evidence, regulatory or economic wording in a translation file. That text is reviewed per market and per page, and a JSON file reused across locales is exactly the mechanism that moves a permission from one market to another. See [Claims And Gates](../../shared/claims-and-gates.md).
- Controlled vocabulary and status values stay in English. They are an interface, not copy.
- `us` and `sa-en` are markets, not languages. They carry English interface strings. A locale id is not a BCP 47 tag; the `lang` attribute comes from `htmlLang` in the locale registry.
- Never add a language outside `src/shared/config/locales.ts`. The i18next language set is derived from that registry so routing and translation cannot drift.

## How to translate

- Server Components: `const { t } = await getTranslation(locale, ns)` from `@/shared/i18n`.
- Client Components: wrap the subtree in `I18nProvider` with the resources the server already loaded, then use `useTranslation`. Never fetch resources again on the client; it adds a request to the critical path of a page whose Core Web Vitals are an acceptance criterion.
- `cacheComponents` is on. Resource loading sits behind `use cache` in `src/shared/i18n/server.ts` and the instance is initialised synchronously from plain JSON. Never introduce an i18next backend plugin that loads at render time: that is uncached async work and it blocks prerendering.
- No language detection of any kind. The locale comes from routing. Detection would reintroduce the behaviour the cluster rule prohibits.
- Add a namespace when a surface genuinely owns its vocabulary. Not one per component.

## Routes

- Every URL comes from the page register. `src/shared/config/page-register.ts` holds the rows; `routes.ts` adds the lookups and predicates. The register is the plan; `built-routes.ts` is what the deployment serves.
- Never write a URL as a string literal. A slug is a claim surface: it changes only as a reviewed specification change, carried into `page-register.ts` by hand and in its own commit.
- The register deliberately omits H1, title tag and meta description. They are drafted claim surfaces and must not sit one import away from being rendered. Read them from `docs/spec/page-register.md` when an approved source exists.
- `page` in a register entry is an internal label for identifying a row. Never render it.
- Use `isReserved` and `isIndexable` rather than re-reading the status strings. A reserved node is never routed, linked or placed in the sitemap.
- Some register URLs are relative, written as `.../slug`. `unresolvedUrls()` lists them. Resolving a parent path is an open question for the SEO & AEO Lead; guessing one invents a slug.
