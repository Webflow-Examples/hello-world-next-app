import type { Metadata } from 'next';

import { LOCALES, ROUTED_LOCALES, localePath, type LocaleId } from '@/shared/config/locales';

/**
 * Canonical origin of the property. Hosting is not decided yet, so the origin comes from the
 * environment and falls back to production. Preview deployments must set NEXT_PUBLIC_SITE_URL
 * to their own origin so canonicals never point a crawler at a preview build.
 */
export const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://compremium.ch').replace(
  /\/$/,
  '',
);

/**
 * Mount path of the deployment, without a trailing slash. Empty when the application is served
 * from the origin root, which is what the page register assumes and what production must be.
 *
 * Webflow Cloud serves an app at an environment's mount path and applies it as Next's
 * `basePath` at build time. Next prefixes `Link`, `useRouter`, `redirect` and `next/image` by
 * itself, but it does not prefix an absolute URL we assemble from a string - and every URL
 * this module produces is exactly that. A staging environment mounted at `/staging` would
 * otherwise advertise `https://host/de` as the canonical of a page served at
 * `https://host/staging/de`: a canonical pointing at a 404, which is worse than no canonical.
 *
 * It must be read from the environment and never from `next.config`. Webflow Cloud generates
 * its own config at build time and moves ours aside, so `next.config` does not know the value
 * that is actually in force.
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/+$/, '');

export function absoluteUrl(path: string): string {
  const normalised = path.startsWith('/') ? path : `/${path}`;
  if (BASE_PATH === '') return `${SITE_ORIGIN}${normalised}`;

  // `/` under a mount path is the mount path itself, not `/staging/`.
  return `${SITE_ORIGIN}${BASE_PATH}${normalised === '/' ? '' : normalised}`;
}

/**
 * Builds the self-referencing canonical and the reciprocal hreflang cluster for one page.
 *
 * CLUSTER RULE (docs/spec/locales.md): every locale carries a self-referencing canonical and a
 * complete, reciprocal hreflang cluster including x-default. A locale that cannot yet carry a
 * page serves the substituted slot, not a 404 - so every routed locale appears in the cluster.
 *
 * @param locale   the locale rendering the page
 * @param pathname locale-independent path, e.g. `/quantis/st/cp-value`
 */
export function buildAlternates(
  locale: LocaleId,
  pathname = '/',
): NonNullable<Metadata['alternates']> {
  const languages: Record<string, string> = {};

  for (const candidate of ROUTED_LOCALES) {
    for (const hreflang of candidate.hreflang) {
      languages[hreflang] = absoluteUrl(localePath(candidate.id, pathname));
    }
  }

  return {
    canonical: absoluteUrl(localePath(locale, pathname)),
    languages,
  };
}

export function htmlLang(locale: LocaleId): string {
  return LOCALES[locale].htmlLang;
}
