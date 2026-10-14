import { DEFAULT_LOCALE, LOCALE_IDS, ROUTED_LOCALES, type LocaleId } from '@/shared/config/locales';

/**
 * i18next configuration.
 *
 * SCOPE: interface strings only - navigation labels, button text, form labels and validation
 * messages, state descriptions. Page content comes from the CMS.
 *
 * Translation files must never carry clinical, evidence, regulatory or economic wording. That
 * text is reviewed per market and per page, and a JSON file reused across locales is exactly
 * the mechanism that moves a permission from one market to another. See
 * `docs/spec/claims-guardrails.md`.
 *
 * The language set is the locale registry, so i18next and routing cannot drift apart. Note
 * that a locale id is not a BCP 47 tag: `us` is a market, and its `lang` attribute comes from
 * `htmlLang`, never from here.
 */

export const FALLBACK_LOCALE: LocaleId = DEFAULT_LOCALE;

export const I18N_LANGUAGES: readonly LocaleId[] = LOCALE_IDS;

export const ROUTED_LANGUAGES: readonly LocaleId[] = ROUTED_LOCALES.map((locale) => locale.id);

export const DEFAULT_NAMESPACE = 'common';

/**
 * Namespaces are split by where a string is used, so a page loads only what it renders.
 * Add one when a surface genuinely owns its vocabulary; do not add one per component.
 */
export const NAMESPACES = ['common', 'navigation', 'forms', 'evidence'] as const;

export type Namespace = (typeof NAMESPACES)[number];

export function i18nOptions(locale: LocaleId, namespace: Namespace | Namespace[]) {
  return {
    supportedLngs: I18N_LANGUAGES,
    fallbackLng: FALLBACK_LOCALE,
    lng: locale,
    fallbackNS: DEFAULT_NAMESPACE,
    defaultNS: DEFAULT_NAMESPACE,
    ns: namespace,
    // The locale is decided by routing, never by the browser. Detection here would reintroduce
    // the geo/Accept-Language behaviour the cluster rule prohibits.
    interpolation: { escapeValue: false },
  };
}
