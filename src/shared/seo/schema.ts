import type { LocaleId } from '@/shared/config/locales';
import { absoluteUrl } from '@/shared/config/site';

import { ENTITY_IDS, SAME_AS } from './ids';

/**
 * Structured data builders. Rendered by `JsonLd.tsx`.
 *
 * Two constraints shape this module.
 *
 * 1. WS-D requires CI validation "so a template change cannot silently drop a reviewer or a
 *    citation field". Here that is a type-level requirement plus a runtime assertion, both
 *    covered by tests: a clinical page cannot be built without its provenance.
 * 2. Nothing here invents text. Every human-readable string passed in comes from an approved
 *    source. These builders only decide shape. See docs/spec/claims-guardrails.md.
 */

export interface JsonLdNode {
  readonly '@context'?: 'https://schema.org';
  readonly '@type': string;
  readonly '@id'?: string;
  readonly [key: string]: unknown;
}

const CONTEXT = 'https://schema.org' as const;

/** A person who authored or medically reviewed a clinical page. */
export interface Provenance {
  /** Approved display name. */
  readonly name: string;
  /** `/company/people/<slug>` - the reviewer layer the page links to. */
  readonly profileUrl: string;
  /** Qualification string, verbatim from the approved source. */
  readonly qualification?: string;
  /** True for a clinician; maps to Physician rather than Person. */
  readonly isPhysician?: boolean;
}

export interface Citation {
  readonly name: string;
  readonly url?: string;
  /**
   * Which evidence layer the citation belongs to. WS-D keeps the three layers separate, and
   * merging them in markup is the same defect as merging them in copy.
   */
  readonly layer: 'method' | 'predecessor-device' | 'current-device';
}

function person(entry: Provenance): JsonLdNode {
  return {
    '@type': entry.isPhysician ? 'Physician' : 'Person',
    '@id': absoluteUrl(entry.profileUrl),
    name: entry.name,
    ...(entry.qualification ? { honorificSuffix: entry.qualification } : {}),
    url: absoluteUrl(entry.profileUrl),
  };
}

function citation(entry: Citation): JsonLdNode {
  return {
    '@type': 'CreativeWork',
    name: entry.name,
    ...(entry.url ? { url: entry.url } : {}),
  };
}

export function organization(input: { name: string; url?: string }): JsonLdNode {
  return {
    '@context': CONTEXT,
    '@type': 'Organization',
    '@id': ENTITY_IDS.organization,
    name: input.name,
    url: absoluteUrl(input.url ?? '/'),
    ...(SAME_AS.length > 0 ? { sameAs: SAME_AS } : {}),
  };
}

export function website(input: { name: string; locale: LocaleId }): JsonLdNode {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    '@id': ENTITY_IDS.website,
    name: input.name,
    url: absoluteUrl('/'),
    inLanguage: input.locale,
    publisher: { '@id': ENTITY_IDS.organization },
  };
}

export function breadcrumbList(items: ReadonlyArray<{ name: string; path: string }>): JsonLdNode {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * A `DefinedTerm` carrying one of the stable entity identifiers.
 *
 * `id` is deliberately restricted to the registry: an ad-hoc identifier for soft-tissue
 * compressibility or the CP Value would fragment the two most citable objects on the property.
 */
export function definedTerm(input: {
  id: typeof ENTITY_IDS.softTissueCompressibility | typeof ENTITY_IDS.cpValue;
  name: string;
  description: string;
  path: string;
}): JsonLdNode {
  return {
    '@context': CONTEXT,
    '@type': 'DefinedTerm',
    '@id': input.id,
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
  };
}

export class MissingProvenanceError extends Error {
  constructor(what: string) {
    super(
      `Structured data for a clinical page is missing ${what}. ` +
        'WS-D: without the reviewer layer no clinical content can publish. ' +
        'Supply the approved value or do not render the page.',
    );
    this.name = 'MissingProvenanceError';
  }
}

/**
 * A clinical page: `MedicalWebPage` with its mandatory provenance.
 *
 * Author, medical reviewer, publication date and review date are required by WS-D on every
 * clinical page. They are required here too, at the type level and at runtime, so a template
 * change cannot drop one without failing.
 */
export function medicalWebPage(input: {
  name: string;
  description: string;
  path: string;
  locale: LocaleId;
  author: Provenance;
  reviewedBy: Provenance;
  datePublished: string;
  dateReviewed: string;
  citations?: readonly Citation[];
  about?: { type: string; id?: string; name: string };
}): JsonLdNode {
  if (!input.author?.name) throw new MissingProvenanceError('an author');
  if (!input.reviewedBy?.name) throw new MissingProvenanceError('a medical reviewer');
  if (!input.datePublished) throw new MissingProvenanceError('a publication date');
  if (!input.dateReviewed) throw new MissingProvenanceError('a review date');

  return {
    '@context': CONTEXT,
    '@type': 'MedicalWebPage',
    '@id': absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: input.locale,
    author: person(input.author),
    reviewedBy: person(input.reviewedBy),
    datePublished: input.datePublished,
    lastReviewed: input.dateReviewed,
    publisher: { '@id': ENTITY_IDS.organization },
    ...(input.about
      ? {
          about: {
            '@type': input.about.type,
            ...(input.about.id ? { '@id': input.about.id } : {}),
            name: input.about.name,
          },
        }
      : {}),
    ...(input.citations?.length ? { citation: input.citations.map(citation) } : {}),
  };
}

/**
 * An evidence item: publication, study or case report.
 *
 * At least one citation is required. An evidence page without attribution is the defect the
 * evidence-layer rule exists to prevent.
 */
export function medicalScholarlyArticle(input: {
  name: string;
  description: string;
  path: string;
  locale: LocaleId;
  datePublished: string;
  citations: readonly Citation[];
  reviewedBy?: Provenance;
}): JsonLdNode {
  if (input.citations.length === 0) throw new MissingProvenanceError('a citation');
  if (!input.datePublished) throw new MissingProvenanceError('a publication date');

  return {
    '@context': CONTEXT,
    '@type': 'MedicalScholarlyArticle',
    '@id': absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: input.locale,
    datePublished: input.datePublished,
    citation: input.citations.map(citation),
    publisher: { '@id': ENTITY_IDS.organization },
    ...(input.reviewedBy ? { reviewedBy: person(input.reviewedBy) } : {}),
  };
}
