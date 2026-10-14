import { describe, expect, it } from 'vitest';

import { BUILT_ROUTES, isPublished } from '@/shared/config/built-routes';
import { SITE_ORIGIN } from '@/shared/config/site';
import { PAGE_REGISTER, isReserved } from '@/shared/config/routes';

import {
  localeScopeIsKnown,
  localesForEntry,
  publishableLocales,
  publishedUrls,
  sitemapEntries,
  sitemapForLocale,
  sitemapLocales,
  sitemapUrls,
} from './sitemap';

const ROUTED_LOCALES_UNDER_TEST = ['en', 'de', 'us'] as const;

describe('sitemap', () => {
  it('handles every locale scope value present in the register', () => {
    // An unmapped value silently drops a page, so this must stay exhaustive. When the register
    // gains a new phrasing, map it deliberately rather than letting the fallback decide.
    const unknown = [...new Set(PAGE_REGISTER.map((entry) => entry.localeScope))].filter(
      (scope) => !localeScopeIsKnown(scope),
    );

    expect(unknown).toEqual([]);
  });

  it('excludes every reserved node', () => {
    // "Reserved nodes are excluded from the sitemap until they are built."
    const reservedIds = new Set(PAGE_REGISTER.filter(isReserved).map((entry) => entry.id));
    expect(reservedIds.size).toBeGreaterThan(0);

    for (const entry of sitemapEntries()) {
      expect(reservedIds.has(entry.id)).toBe(false);
    }
  });

  it('excludes pages whose indexation is held', () => {
    const ids = new Set(sitemapEntries().map((entry) => entry.id));

    for (const entry of PAGE_REGISTER) {
      if (entry.indexation === 'Noindex until rebuilt') expect(ids.has(entry.id)).toBe(false);
      if (entry.indexation === 'Index, follow after review') expect(ids.has(entry.id)).toBe(false);
      if (entry.indexation === 'Not built') expect(ids.has(entry.id)).toBe(false);
    }
  });

  it('excludes templated and unresolved URLs', () => {
    for (const entry of sitemapEntries()) {
      expect(entry.urlUnresolved).toBe(false);
      for (const url of entry.urls) {
        expect(url).not.toContain('<');
        expect(url.startsWith('.../')).toBe(false);
      }
    }
  });

  it('publishes only locales whose gate has cleared', () => {
    // /de waits on German-language claims review, /us on the signed-off substitution list.
    expect(publishableLocales().map((locale) => locale.id)).toEqual(['en']);
    expect(sitemapForLocale('de')).toEqual([]);
    expect(sitemapForLocale('us')).toEqual([]);
  });

  it('emits absolute, canonical-origin URLs for the published locale', () => {
    for (const record of sitemapForLocale('en')) {
      expect(record.url.startsWith('https://compremium.ch')).toBe(true);
    }
  });

  it('advertises only URLs that a built, indexable route serves', () => {
    // The defect this replaces: the partition was derived from the register, which is a plan.
    // It advertised 35 URLs, 34 of which answered 404, and the one that resolved served
    // `<meta name="robots" content="noindex, nofollow">`. Checking the SHAPE of a URL does not
    // check that anything is behind it.
    for (const locale of ROUTED_LOCALES_UNDER_TEST) {
      for (const record of sitemapForLocale(locale)) {
        const path = record.url.slice(SITE_ORIGIN.length);
        expect(isPublished(path), `${record.url} is in the sitemap but is not published`).toBe(
          true,
        );
      }
    }
  });

  it('advertises no URL while every built route is held noindex', () => {
    // Today that is the whole sitemap. This assertion is not pinning the empty state: it pairs
    // with the one above, and both keep holding as routes are added.
    const published = BUILT_ROUTES.filter((route) => route.indexable);

    expect(sitemapForLocale('en')).toHaveLength(published.length);
  });

  it('never advertises a URL an entry has not published', () => {
    for (const entry of sitemapEntries()) {
      for (const url of publishedUrls(entry)) {
        expect(entry.urls).toContain(url);
        expect(isPublished(url)).toBe(true);
      }
    }
  });

  it('does not advertise an alternate for a locale that cannot publish', () => {
    for (const record of sitemapForLocale('en')) {
      for (const url of Object.values(record.alternates?.languages ?? {})) {
        expect(String(url)).not.toContain('/de');
        expect(String(url)).not.toContain('/us');
      }
    }
  });

  it('keeps a root-only page out of the other locales', () => {
    const rootOnly = PAGE_REGISTER.filter((entry) => entry.localeScope === 'Root only');

    expect(rootOnly.length).toBeGreaterThan(0);
    for (const entry of rootOnly) {
      expect(localesForEntry(entry)).toEqual(['en']);
    }
  });

  it('produces no partition for a publishable locale that has published nothing', () => {
    // An empty <urlset> is a crawl request for nothing, and robots.txt must not point at one.
    const expected = publishableLocales().filter(
      (locale) => sitemapForLocale(locale.id).length > 0,
    );

    expect(sitemapLocales()).toEqual(expected);
  });

  it('lists exactly the partitions that are produced', () => {
    expect(sitemapUrls()).toEqual(
      sitemapLocales().map((locale) => `https://compremium.ch/sitemap/${locale.id}.xml`),
    );
  });
});
