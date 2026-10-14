/**
 * Public API of the shared SEO slice.
 *
 * `redirects` is intentionally not re-exported here: `next.config.ts` imports it directly and
 * must stay free of application imports.
 */

export { ENTITY_IDS, SAME_AS, type EntityId } from './ids';
export { JsonLd } from './JsonLd';
export {
  MissingProvenanceError,
  breadcrumbList,
  definedTerm,
  medicalScholarlyArticle,
  medicalWebPage,
  organization,
  website,
  type Citation,
  type JsonLdNode,
  type Provenance,
} from './schema';
export {
  localeScopeIsKnown,
  localesForEntry,
  publishableLocales,
  publishedUrls,
  sitemapEntries,
  sitemapForLocale,
  sitemapLocales,
  sitemapUrls,
  type SitemapRecord,
} from './sitemap';
