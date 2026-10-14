import { describe, expect, it } from 'vitest';

import { ENTITY_IDS } from './ids';
import {
  MissingProvenanceError,
  breadcrumbList,
  definedTerm,
  medicalScholarlyArticle,
  medicalWebPage,
  organization,
  website,
  type Citation,
  type Provenance,
} from './schema';

/**
 * WS-D: "Automated validation in CI so a template change cannot silently drop a reviewer or a
 * citation field." These are that check.
 */

const author: Provenance = {
  name: 'Test Author',
  profileUrl: '/company/people/test-author',
};

const reviewer: Provenance = {
  name: 'Test Reviewer',
  profileUrl: '/company/people/test-reviewer',
  qualification: 'MD',
  isPhysician: true,
};

const citations: readonly Citation[] = [
  { name: 'Test reference', layer: 'current-device', url: 'https://example.org/a' },
];

const clinicalPage = {
  name: 'Structure only',
  description: 'Structure only',
  path: '/quantis/st/how-it-works',
  locale: 'en' as const,
  author,
  reviewedBy: reviewer,
  datePublished: '2026-01-01',
  dateReviewed: '2026-02-01',
};

describe('the entity graph', () => {
  it('anchors the two most citable objects on stable identifiers', () => {
    expect(ENTITY_IDS.softTissueCompressibility).toBe(
      'https://compremium.ch/#soft-tissue-compressibility',
    );
    expect(ENTITY_IDS.cpValue).toBe('https://compremium.ch/#cp-value');
  });

  it('keeps an identifier locale-independent', () => {
    // One concept has one identity across markets, even where the wording differs.
    const term = definedTerm({
      id: ENTITY_IDS.cpValue,
      name: 'CP Value',
      description: 'Structure only',
      path: '/quantis/st/cp-value',
    });

    expect(term['@id']).toBe(ENTITY_IDS.cpValue);
  });

  it('references the organization by id rather than repeating it', () => {
    expect(website({ name: 'Compremium', locale: 'en' }).publisher).toEqual({
      '@id': ENTITY_IDS.organization,
    });
  });

  it('omits sameAs until the profile register is populated', () => {
    expect(organization({ name: 'Compremium AG' })).not.toHaveProperty('sameAs');
  });
});

describe('a clinical page', () => {
  it('carries author, reviewer, publication date and review date', () => {
    const node = medicalWebPage(clinicalPage);

    expect(node['@type']).toBe('MedicalWebPage');
    expect(node.author).toMatchObject({ '@type': 'Person', name: 'Test Author' });
    expect(node.reviewedBy).toMatchObject({ '@type': 'Physician', name: 'Test Reviewer' });
    expect(node.datePublished).toBe('2026-01-01');
    expect(node.lastReviewed).toBe('2026-02-01');
  });

  it('links the reviewer to the people layer', () => {
    const node = medicalWebPage(clinicalPage);
    const reviewedBy = node.reviewedBy as Record<string, unknown>;

    expect(reviewedBy.url).toBe('https://compremium.ch/company/people/test-reviewer');
  });

  it.each([
    ['an author', { ...clinicalPage, author: { ...author, name: '' } }],
    ['a medical reviewer', { ...clinicalPage, reviewedBy: { ...reviewer, name: '' } }],
    ['a publication date', { ...clinicalPage, datePublished: '' }],
    ['a review date', { ...clinicalPage, dateReviewed: '' }],
  ])('refuses to build without %s', (_what, input) => {
    expect(() => medicalWebPage(input)).toThrow(MissingProvenanceError);
  });
});

describe('an evidence item', () => {
  it('requires at least one citation', () => {
    expect(() =>
      medicalScholarlyArticle({
        name: 'Structure only',
        description: 'Structure only',
        path: '/evidence/publications/test',
        locale: 'en',
        datePublished: '2026-01-01',
        citations: [],
      }),
    ).toThrow(MissingProvenanceError);
  });

  it('keeps its citations', () => {
    const node = medicalScholarlyArticle({
      name: 'Structure only',
      description: 'Structure only',
      path: '/evidence/publications/test',
      locale: 'en',
      datePublished: '2026-01-01',
      citations,
    });

    expect(node.citation).toHaveLength(1);
  });
});

describe('breadcrumbs', () => {
  it('number positions from one and absolutise every item', () => {
    const node = breadcrumbList([
      { name: 'Quantis', path: '/quantis/' },
      { name: 'Quantis ST', path: '/quantis/st/' },
    ]);
    const items = node.itemListElement as Array<Record<string, unknown>>;

    expect(items[0]).toMatchObject({ position: 1, item: 'https://compremium.ch/quantis/' });
    expect(items[1]).toMatchObject({ position: 2, item: 'https://compremium.ch/quantis/st/' });
  });
});
