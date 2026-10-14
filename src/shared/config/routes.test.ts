import { describe, expect, it } from 'vitest';

import {
  PAGE_REGISTER,
  entriesBySilo,
  entriesByTemplate,
  entryById,
  entryByUrl,
  isIndexable,
  isReserved,
  unresolvedUrls,
} from './routes';

/**
 * The register was transcribed from the estimate spreadsheet and is now maintained by hand.
 * These tests guard the invariants an edit could break and the semantics the predicates encode,
 * because a wrong answer here puts a page in the sitemap that the register says must not exist.
 */
describe('page register', () => {
  it('matches the transcription in docs/spec/page-register.md', () => {
    expect(PAGE_REGISTER).toHaveLength(51);
  });

  it('gives every entry a unique id', () => {
    const ids = PAGE_REGISTER.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('exposes the five silos plus the root', () => {
    for (const silo of ['root', 'A', 'B', 'C', 'D', 'E'] as const) {
      expect(entriesBySilo(silo).length).toBeGreaterThan(0);
    }
  });

  it('looks an entry up by id and by url', () => {
    const home = entryById('homepage');
    expect(home?.template).toBe('corporate-home');
    expect(entryByUrl('/')).toBe(home);
    expect(entryByUrl('/quantis/st/cp-value')?.gate).toBe('HARD');
  });

  it('carries no drafted claim surface into application code', () => {
    for (const entry of PAGE_REGISTER) {
      expect(entry).not.toHaveProperty('title');
      expect(entry).not.toHaveProperty('h1');
      expect(entry).not.toHaveProperty('description');
    }
  });

  describe('reserved nodes', () => {
    it('are present in the tree', () => {
      expect(entriesByTemplate('reserved').length).toBeGreaterThan(0);
    });

    it('are never indexable', () => {
      // "RESERVED nodes are held in the tree and are not built, not indexed and not linked."
      for (const entry of PAGE_REGISTER.filter(isReserved)) {
        expect(isIndexable(entry)).toBe(false);
      }
    });
  });

  it('treats a held indexation as not indexable', () => {
    const whitePapers = entryByUrl('/evidence/white-papers/<slug>');
    expect(whitePapers?.indexation).toBe('Noindex until rebuilt');
    expect(isIndexable(whitePapers!)).toBe(false);

    const caseReports = entryByUrl('/evidence/case-reports/<slug>');
    expect(caseReports?.indexation).toBe('Index, follow after review');
    expect(isIndexable(caseReports!)).toBe(false);
  });

  it('flags the entries whose parent path the register left unresolved', () => {
    const unresolved = unresolvedUrls();

    // The register writes these as ".../slug". Resolving them is an open question for the
    // SEO & AEO Lead; see docs/spec/templates.md. Guessing a parent would invent a slug.
    expect(unresolved.length).toBeGreaterThan(0);
    for (const entry of unresolved) {
      expect(entry.urls.some((url) => url.startsWith('.../'))).toBe(true);
    }
  });
});
