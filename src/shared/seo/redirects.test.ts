import { describe, expect, it } from 'vitest';

import { isBuilt } from '@/shared/config/built-routes';
import { canonicalPath } from '@/shared/config/locales';

import {
  GONE_PATHS,
  LEGACY_REDIRECTS,
  UNMAPPED_LEGACY_PATHS,
  activeRedirects,
  heldRedirects,
  isGone,
  validateRedirects,
} from './redirects';

/**
 * WS-D requires "chain and loop QA on staging and after launch". Running it here moves the
 * check earlier than staging, where a chain is cheap to find and free to fix.
 */
describe('the redirect map', () => {
  it('resolves every served legacy URL in one hop, onto something that exists', () => {
    expect(validateRedirects()).toEqual([]);
  });

  it('serves no redirect onto a path that answers 404', () => {
    // `/solution` was served as 301 to `/quantis/st`, which is a register row and not a route.
    // The old one-hop test passed it: a 404 is neither a 301 nor a 308.
    for (const entry of activeRedirects()) {
      expect(isBuilt(entry.destination), `${entry.source} -> ${entry.destination}`).toBe(true);
    }
  });

  it('withholds a pair whose destination is not built, and keeps it on record', () => {
    const held = heldRedirects();

    for (const entry of held) {
      expect(isBuilt(entry.destination)).toBe(false);
      expect(LEGACY_REDIRECTS).toContainEqual(entry);
      expect(activeRedirects()).not.toContainEqual(entry);
    }

    // Approved pairs are never dropped: served plus held is the whole map.
    expect([...activeRedirects(), ...held]).toHaveLength(LEGACY_REDIRECTS.length);
  });

  it('reports a dead destination as a map problem', () => {
    const problems = validateRedirects([
      { source: '/legacy', destination: '/quantis/st', statusCode: 301 },
    ]);

    expect(problems).toContainEqual({ kind: 'destination-not-built', path: '/legacy' });
  });

  it('uses 301 rather than the framework default of 308', () => {
    // WS-D specifies the migration as "301 / 410".
    for (const entry of LEGACY_REDIRECTS) {
      expect(entry.statusCode).toBe(301);
    }
  });

  it('points at the targets WS-D states, in the form the application serves', () => {
    // The register writes these with a trailing slash. Redirecting to that form produces a
    // second 308, so the destination is stored normalised. See canonicalPath.
    expect(LEGACY_REDIRECTS).toEqual([
      { source: '/solution', destination: '/quantis/st', statusCode: 301 },
      { source: '/cvp/quantis-cvp', destination: '/quantis/cvp', statusCode: 301 },
      { source: '/clinical-evidence', destination: '/evidence', statusCode: 301 },
    ]);
  });

  it('never points at a URL that would redirect again', () => {
    for (const entry of LEGACY_REDIRECTS) {
      expect(canonicalPath(entry.destination)).toBe(entry.destination);
    }
  });

  it('never maps a legacy URL to itself', () => {
    for (const entry of LEGACY_REDIRECTS) {
      expect(entry.source).not.toBe(entry.destination);
    }
  });

  it('keeps the unmapped legacy paths out of the live map', () => {
    // They are listed so they are not forgotten, not so they are guessed at.
    const sources = new Set(LEGACY_REDIRECTS.map((entry) => entry.source));
    for (const path of UNMAPPED_LEGACY_PATHS) {
      expect(sources.has(path)).toBe(false);
    }
  });

  describe('validateRedirects', () => {
    // The fixtures below use paths no route serves, so each also reports
    // `destination-not-built`. These assertions isolate the kind under test.
    it('reports a chain', () => {
      const problems = validateRedirects([
        { source: '/a', destination: '/b', statusCode: 301 },
        { source: '/b', destination: '/c', statusCode: 301 },
      ]);

      expect(problems).toContainEqual({ kind: 'chain', path: '/a' });
    });

    it('reports a loop', () => {
      const problems = validateRedirects([
        { source: '/a', destination: '/b', statusCode: 301 },
        { source: '/b', destination: '/a', statusCode: 301 },
      ]);

      expect(problems.filter((problem) => problem.kind === 'loop')).toHaveLength(2);
    });

    it('reports a self-redirect', () => {
      const problems = validateRedirects([{ source: '/a', destination: '/a', statusCode: 301 }]);

      expect(problems).toContainEqual({ kind: 'source-equals-destination', path: '/a' });
    });

    it('reports a duplicated source', () => {
      const problems = validateRedirects([
        { source: '/a', destination: '/b', statusCode: 301 },
        { source: '/a', destination: '/c', statusCode: 301 },
      ]);

      expect(problems).toContainEqual({ kind: 'duplicate-source', path: '/a' });
    });
  });

  describe('410 Gone', () => {
    it('is empty until the SEO lead supplies the four paths', () => {
      expect(GONE_PATHS).toEqual([]);
    });

    it('matches only a listed path', () => {
      expect(isGone('/quantis/st/')).toBe(false);
    });
  });
});
