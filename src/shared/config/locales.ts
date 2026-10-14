/**
 * Locale registry.
 *
 * Source of truth: `docs/spec/locales.md` (transcribed from the estimate spreadsheet).
 * Read `docs/spec/claims-guardrails.md` before changing anything here.
 *
 * Binding rules encoded by this module:
 *  - Every locale carries a self-referencing canonical and a complete, reciprocal
 *    hreflang cluster including `x-default`.
 *  - No automatic geo-redirection. The user chooses the locale and the choice is remembered.
 *  - A locale that cannot yet carry a page serves the substituted slot, not a 404.
 *  - Each market is governed by its own Instructions for Use. No market may import
 *    another market's permissions.
 */

export const LOCALE_IDS = ['en', 'de', 'us', 'sa-en'] as const;

export type LocaleId = (typeof LOCALE_IDS)[number];

/**
 * `live`   - routes are built and may publish once the page's own claims gate allows it.
 * `gated`  - routes are built, but no page publishes before the locale-level review clears it.
 * `shell`  - reserved in the registry only. Not routed, not built, not linked.
 */
export type LocaleStatus = 'live' | 'gated' | 'shell';

export interface LocaleDefinition {
  readonly id: LocaleId;
  /** URL prefix. The default locale is served unprefixed at `/`. */
  readonly prefix: string;
  /** `lang` attribute for `<html>`. */
  readonly htmlLang: string;
  /** hreflang values advertised for this locale. A locale may claim more than one. */
  readonly hreflang: readonly string[];
  /** Human-readable label for the language switcher. Not a claim surface. */
  readonly label: string;
  readonly market: string;
  /** Controlling Instructions for Use. See docs/spec/locales.md. */
  readonly controllingSource: string;
  readonly status: LocaleStatus;
  /** Why the locale is gated or shelled, when it is. */
  readonly gate?: string;
}

export const DEFAULT_LOCALE: LocaleId = 'en';

export const LOCALES: Readonly<Record<LocaleId, LocaleDefinition>> = {
  en: {
    id: 'en',
    prefix: '',
    htmlLang: 'en',
    hreflang: ['x-default', 'en'],
    label: 'English',
    market: 'EU and Switzerland, international baseline',
    controllingSource: 'EU IFU v11.0 §5',
    status: 'live',
  },
  de: {
    id: 'de',
    prefix: '/de',
    htmlLang: 'de',
    hreflang: ['de-DE', 'de-CH'],
    label: 'Deutsch',
    market: 'DACH priority region: Germany, Switzerland, Austria',
    controllingSource: 'EU IFU v11.0 §5, rendered in German clinical terminology',
    status: 'gated',
    gate: 'HARD GATE: German-language claims review - QARA/Regulatory and Clinical/Medical. Surface decision still open.',
  },
  us: {
    id: 'us',
    prefix: '/us',
    htmlLang: 'en-US',
    hreflang: ['en-US'],
    label: 'English (US)',
    market: 'United States',
    controllingSource: 'US IFU v15.0 §5.1',
    status: 'gated',
    gate: 'HARD GATE: substitution list for every time-based slot signed off by QARA/Regulatory before the locale opens.',
  },
  'sa-en': {
    id: 'sa-en',
    prefix: '/sa-en',
    htmlLang: 'en',
    hreflang: [],
    label: 'English (Saudi Arabia)',
    market: 'Saudi Arabia',
    controllingSource: 'TBD - not stated in the source material',
    status: 'shell',
    gate: 'Shell only. hreflang value, controlling IFU and permitted language are TBD.',
  },
};

/** Locales that produce routes today. `shell` locales are registered but not routed. */
export const ROUTED_LOCALES: readonly LocaleDefinition[] = LOCALE_IDS.map(
  (id) => LOCALES[id],
).filter((locale) => locale.status !== 'shell');

export function isLocaleId(value: string): value is LocaleId {
  return (LOCALE_IDS as readonly string[]).includes(value);
}

export function isRoutedLocale(value: string): value is LocaleId {
  return isLocaleId(value) && LOCALES[value].status !== 'shell';
}

/** Prefixes of routed, non-default locales, longest first so `/sa-en` is tested before `/sa`. */
export const ROUTED_PREFIXES: readonly string[] = ROUTED_LOCALES.map((locale) => locale.prefix)
  .filter((prefix) => prefix !== '')
  .sort((a, b) => b.length - a.length);

/**
 * Normalises a register path to the single form the application actually serves.
 *
 * OPEN DECISION (SEO & AEO Lead). `docs/spec/page-register.md` uses two notations: a section
 * index carries a trailing slash (`/quantis/st/`, `/company/`) and a leaf does not
 * (`/why-quantify`, `/quantis/st/how-it-works`). Next.js cannot serve both: `trailingSlash` is
 * a single global switch. Left to the framework default, `/quantis/st/` answers 308 to
 * `/quantis/st`, which turns every hub target in the redirect map into a chain and puts
 * redirecting URLs into the sitemap.
 *
 * Until that decision is made, one form is chosen here and applied everywhere a URL leaves the
 * application - canonical, hreflang, sitemap and redirect destination - so no two of them
 * disagree. The chosen form is the slashless one, because it needs no configuration and
 * matches the leaf notation the register uses for most of its entries.
 *
 * The alternative is `trailingSlash: true`, which would add a slash to every leaf instead.
 * Whichever is chosen must match the legacy site's form, or the migration loses equity on
 * every URL that changes shape.
 */
export function canonicalPath(pathname: string): string {
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (withLeadingSlash === '/') return '/';
  return withLeadingSlash.replace(/\/+$/, '') || '/';
}

/** Builds a public URL path for a locale. The default locale is unprefixed. */
export function localePath(locale: LocaleId, pathname = '/'): string {
  const normalised = canonicalPath(pathname);
  const prefix = LOCALES[locale].prefix;
  if (prefix === '') return normalised;
  return normalised === '/' ? prefix : `${prefix}${normalised}`;
}
