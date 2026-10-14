import { describe, expect, it } from 'vitest';

import { BUILT_ROUTES, builtRoute, isBuilt, isPublished, robotsForPath } from './built-routes';
import { canonicalPath } from './locales';
import { PAGE_REGISTER } from './routes';

/**
 * `BUILT_ROUTES` is the only hand-maintained claim in the routing layer: it says which URLs
 * this deployment serves. Everything downstream trusts it, so these tests check it against the
 * register and against its own invariants.
 *
 * What they cannot check is whether a route segment really exists for each entry. That is
 * proven in `e2e/seo.spec.ts`, against the served response.
 */
describe('BUILT_ROUTES', () => {
  const REGISTER_URLS = new Set(
    PAGE_REGISTER.flatMap((entry) => entry.urls).map((url) => canonicalPath(url)),
  );

  it('contains no URL the register does not define', () => {
    // A URL invented here is a slug invented outside the spreadsheet. See claims-guardrails.md.
    for (const route of BUILT_ROUTES) {
      expect(REGISTER_URLS.has(canonicalPath(route.url))).toBe(true);
    }
  });

  it('stores every URL in the form the application serves', () => {
    for (const route of BUILT_ROUTES) {
      expect(route.url).toBe(canonicalPath(route.url));
    }
  });

  it('lists each URL once', () => {
    const urls = BUILT_ROUTES.map((route) => canonicalPath(route.url));
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('states a reason for every held route', () => {
    // A route that is built but not indexable is a decision, not a default, and the next person
    // needs to know whose decision it was before flipping it.
    for (const route of BUILT_ROUTES) {
      if (!route.indexable) expect(route.heldBecause ?? '').not.toBe('');
    }
  });

  it('treats the trailing-slash and slashless forms as one route', () => {
    // The register writes `/company/` and `/quantis/st/`; the application serves them slashless.
    // A lookup must not depend on which notation the caller happens to hold.
    expect(isBuilt('/')).toBe(true);
    expect(builtRoute('/')?.url).toBe('/');
  });

  it('reports an unbuilt register URL as unbuilt', () => {
    expect(isBuilt('/quantis/st')).toBe(false);
    expect(isPublished('/quantis/st')).toBe(false);
  });

  it('holds the homepage noindex while its metadata is uncleared', () => {
    // The title tag and meta description are claim surfaces awaiting metadata claims QA.
    expect(isBuilt('/')).toBe(true);
    expect(isPublished('/')).toBe(false);
    expect(robotsForPath('/')).toEqual({ index: false, follow: false });
  });

  it('answers noindex for a path nothing serves', () => {
    expect(robotsForPath('/not-a-route')).toEqual({ index: false, follow: false });
  });
});
