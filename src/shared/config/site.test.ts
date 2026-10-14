import { afterEach, describe, expect, it, vi } from 'vitest';

import { LOCALES, ROUTED_LOCALES, canonicalPath, localePath } from '@/shared/config/locales';
import { buildAlternates } from '@/shared/config/site';

/**
 * These assertions encode the CLUSTER RULE from docs/spec/locales.md:
 *
 *   Every locale carries a self-referencing canonical and a complete, reciprocal hreflang
 *   cluster including x-default.
 *
 * A regression here ships an incomplete or non-reciprocal cluster, which is a search defect
 * that is invisible in the UI. Keep the tests even if the locale set changes.
 */
describe('buildAlternates', () => {
  const pathname = '/quantis/st/cp-value';

  it('emits a self-referencing canonical for every routed locale', () => {
    for (const locale of ROUTED_LOCALES) {
      const alternates = buildAlternates(locale.id, pathname);
      expect(alternates.canonical).toBe(`https://compremium.ch${localePath(locale.id, pathname)}`);
    }
  });

  it('includes x-default', () => {
    const { languages } = buildAlternates('en', pathname);
    expect(languages).toHaveProperty('x-default');
  });

  it('advertises every hreflang of every routed locale', () => {
    const { languages } = buildAlternates('de', pathname);
    const expected = ROUTED_LOCALES.flatMap((locale) => locale.hreflang);

    expect(Object.keys(languages ?? {}).sort()).toEqual([...expected].sort());
  });

  it('is reciprocal: every locale advertises the identical cluster', () => {
    const clusters = ROUTED_LOCALES.map((locale) => buildAlternates(locale.id, pathname).languages);

    for (const cluster of clusters) {
      expect(cluster).toEqual(clusters[0]);
    }
  });

  it('does not advertise a locale that is registered as a shell', () => {
    const { languages } = buildAlternates('en', pathname);
    const urls = Object.values(languages ?? {});

    expect(urls.some((url) => String(url).includes(LOCALES['sa-en'].prefix))).toBe(false);
  });

  it('serves the default locale unprefixed', () => {
    expect(localePath('en', pathname)).toBe(pathname);
    expect(localePath('en', '/')).toBe('/');
    expect(localePath('de', pathname)).toBe(`/de${pathname}`);
    expect(localePath('de', '/')).toBe('/de');
  });
});

describe('canonicalPath', () => {
  it('strips a trailing slash so one URL is served per page', () => {
    // The register writes a section index with a trailing slash. Next serves the slashless
    // form, so every outbound URL is normalised before it is published.
    expect(canonicalPath('/quantis/st/')).toBe('/quantis/st');
    expect(canonicalPath('/company/')).toBe('/company');
  });

  it('leaves the root alone', () => {
    expect(canonicalPath('/')).toBe('/');
  });

  it('leaves a leaf path alone', () => {
    expect(canonicalPath('/why-quantify')).toBe('/why-quantify');
  });

  it('is idempotent', () => {
    expect(canonicalPath(canonicalPath('/evidence/'))).toBe('/evidence');
  });

  it('is applied by localePath, so no published URL carries a trailing slash', () => {
    expect(localePath('en', '/quantis/st/')).toBe('/quantis/st');
    expect(localePath('de', '/quantis/st/')).toBe('/de/quantis/st');
  });
});

/**
 * Mount-path awareness.
 *
 * Webflow Cloud serves an environment at a mount path and turns it into Next's `basePath`.
 * Next prefixes its own navigation primitives, but not a URL we build from a string - and
 * canonical, hreflang, the sitemap entries and the robots host are all built from strings
 * here. A canonical that omits the mount path points at a 404 on that environment.
 *
 * `BASE_PATH` is read once at module load, so each case re-imports the module under a stubbed
 * environment rather than mutating a value the module already captured.
 */
describe('absoluteUrl under a mount path', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  async function freshSite(basePath?: string) {
    vi.resetModules();
    if (basePath === undefined) {
      vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '');
    } else {
      vi.stubEnv('NEXT_PUBLIC_BASE_PATH', basePath);
    }
    return import('@/shared/config/site');
  }

  it('is unchanged when the app is served from the origin root', async () => {
    const { absoluteUrl } = await freshSite();

    expect(absoluteUrl('/')).toBe('https://compremium.ch/');
    expect(absoluteUrl('/de/why-quantify')).toBe('https://compremium.ch/de/why-quantify');
  });

  it('prefixes every path with the mount path', async () => {
    const { absoluteUrl } = await freshSite('/staging');

    expect(absoluteUrl('/de/why-quantify')).toBe('https://compremium.ch/staging/de/why-quantify');
  });

  it('maps the root to the mount path itself, with no trailing slash', async () => {
    const { absoluteUrl } = await freshSite('/staging');

    expect(absoluteUrl('/')).toBe('https://compremium.ch/staging');
  });

  it('tolerates a mount path written with a trailing slash', async () => {
    const { absoluteUrl } = await freshSite('/staging/');

    expect(absoluteUrl('/de')).toBe('https://compremium.ch/staging/de');
    expect(absoluteUrl('/')).toBe('https://compremium.ch/staging');
  });

  it('carries the mount path into the hreflang cluster, so no alternate points at a 404', async () => {
    const { buildAlternates: build } = await freshSite('/staging');
    const { canonical, languages } = build('de', '/why-quantify');

    expect(canonical).toBe('https://compremium.ch/staging/de/why-quantify');
    expect(Object.values(languages ?? {})).toContain(
      'https://compremium.ch/staging/us/why-quantify',
    );
    for (const url of Object.values(languages ?? {})) {
      expect(String(url).startsWith('https://compremium.ch/staging/')).toBe(true);
    }
  });
});
