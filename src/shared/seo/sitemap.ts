import { isPublished } from '@/shared/config/built-routes';
import {
  LOCALES,
  ROUTED_LOCALES,
  localePath,
  type LocaleId,
  type LocaleDefinition,
} from '@/shared/config/locales';
import { PAGE_REGISTER, isIndexable, isReserved, type RegisterEntry } from '@/shared/config/routes';
import { absoluteUrl } from '@/shared/config/site';

/**
 * Which URLs belong in the sitemap, and for which locales.
 *
 * WS-D: "sitemap partitioning by locale, lastmod discipline, exclusion list ... Reserved nodes
 * are excluded from the sitemap until they are built."
 */

/**
 * Locales whose pages may be submitted for indexing.
 *
 * Only `live` locales qualify. `/de` publication is gated on German-language claims review and
 * `/us` on the signed-off substitution list, so submitting either today would invite indexing
 * of pages nobody has cleared. Flipping a locale's status to `live` in the registry is the
 * publication switch, and it requires that review.
 */
export function publishableLocales(): readonly LocaleDefinition[] {
  return ROUTED_LOCALES.filter((locale) => locale.status === 'live');
}

/** A register URL containing `<...>` is a template; its instances come from the CMS. */
function isTemplatedUrl(url: string): boolean {
  return url.includes('<');
}

/**
 * Locale availability per register entry.
 *
 * The `Locale scope` column is prose, so every value is mapped explicitly rather than parsed.
 * An unrecognised value yields no locales: a page is left out of the sitemap rather than
 * submitted to a market that may not permit it. `localeScopeIsKnown` lets a test prove that
 * every value present in the register is handled.
 */
const LOCALE_SCOPE: Readonly<Record<string, readonly LocaleId[]>> = {
  'All locales': ['en', 'de', 'us'],
  'All locales; US wording differs': ['en', 'de', 'us'],
  'Per-market IFU, never shared': ['en', 'de', 'us'],
  'Per-market wording': ['en', 'de', 'us'],
  'Per-market wording, never shared': ['en', 'de', 'us'],
  'Root and DE full; US substitutes the time slot': ['en', 'de', 'us'],
  'Root only': ['en'],
  // "DE gated", "DE selective", "abstracts localised" and "localised bio only" all describe a
  // partial German surface that nobody has specified yet. Root only until they do.
  'Root; DE gated': ['en'],
  'Root; DE selective': ['en'],
  'Root; abstracts localised': ['en'],
  'Root; localised bio only': ['en'],
  '—': [],
};

export function localeScopeIsKnown(scope: string): boolean {
  return scope in LOCALE_SCOPE;
}

export function localesForEntry(entry: RegisterEntry): readonly LocaleId[] {
  return LOCALE_SCOPE[entry.localeScope] ?? [];
}

/**
 * Entries the register permits in a sitemap, before locale filtering and before asking whether
 * anything serves them.
 *
 * This is a statement about the plan, not about the deployment. Every predicate here reads a
 * register column, and a register column describes the page the project intends to publish.
 * `publishedUrls` is what decides whether a URL reaches a crawler.
 */
export function sitemapEntries(): readonly RegisterEntry[] {
  return PAGE_REGISTER.filter(
    (entry) =>
      !isReserved(entry) &&
      isIndexable(entry) &&
      !entry.urlUnresolved &&
      entry.urls.length > 0 &&
      entry.urls.every((url) => !isTemplatedUrl(url)),
  );
}

/**
 * The URLs of one entry that a crawler may be sent to today.
 *
 * Filtering per URL rather than per entry matters because an entry can own several: the two
 * legal pages are one row, and building one of them must not advertise the other.
 *
 * `isPublished` is the gate the register cannot provide. A row saying `Index, follow` means the
 * finished page is intended to be indexed; it does not mean a route exists, and it does not
 * survive the page's own robots meta. Both are read from `BUILT_ROUTES`, which the route
 * segment reads too, so the sitemap and the page can never disagree.
 */
export function publishedUrls(entry: RegisterEntry): readonly string[] {
  return entry.urls.filter((url) => isPublished(url));
}

export interface SitemapRecord {
  readonly url: string;
  readonly alternates?: { readonly languages: Readonly<Record<string, string>> };
}

/**
 * The sitemap partition for one locale.
 *
 * `lastModified` is deliberately absent. There is no source of truth for a modification date
 * yet, and stamping the build time on every URL is the opposite of lastmod discipline: it
 * tells a crawler everything changed whenever anything did. Add it when CMS item dates exist.
 */
export function sitemapForLocale(locale: LocaleId): readonly SitemapRecord[] {
  const publishable = publishableLocales();
  if (!publishable.some((candidate) => candidate.id === locale)) return [];

  return sitemapEntries()
    .filter((entry) => localesForEntry(entry).includes(locale))
    .flatMap((entry) =>
      publishedUrls(entry).map((path) => {
        const scope = localesForEntry(entry);
        const languages: Record<string, string> = {};

        for (const candidate of publishable) {
          if (!scope.includes(candidate.id)) continue;
          for (const hreflang of LOCALES[candidate.id].hreflang) {
            languages[hreflang] = absoluteUrl(localePath(candidate.id, path));
          }
        }

        return {
          url: absoluteUrl(localePath(locale, path)),
          ...(Object.keys(languages).length > 1 ? { alternates: { languages } } : {}),
        };
      }),
    );
}

/**
 * Locales that produce a sitemap partition.
 *
 * A publishable locale with nothing published yet produces no file. An empty `<urlset>` is a
 * crawl request for nothing, and advertising one in robots.txt invites a crawler to come back
 * for it. `generateSitemaps` and `robots.txt` both read this, so the file set and the file list
 * stay the same set.
 */
export function sitemapLocales(): readonly LocaleDefinition[] {
  return publishableLocales().filter((locale) => sitemapForLocale(locale.id).length > 0);
}

/** Public URLs of the per-locale sitemap partitions that exist, for robots.txt. */
export function sitemapUrls(): readonly string[] {
  return sitemapLocales().map((locale) => absoluteUrl(`/sitemap/${locale.id}.xml`));
}
