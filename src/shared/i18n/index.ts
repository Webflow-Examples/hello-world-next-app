/**
 * Public API of the shared i18n slice.
 *
 * Server Components: `getTranslation(locale, namespace)`.
 * Client Components: wrap in `I18nProvider` and use `useTranslation` from react-i18next.
 */

export { I18nProvider } from './I18nProvider';
export { getTranslation } from './server';
export {
  DEFAULT_NAMESPACE,
  FALLBACK_LOCALE,
  I18N_LANGUAGES,
  NAMESPACES,
  ROUTED_LANGUAGES,
  i18nOptions,
  type Namespace,
} from './settings';
