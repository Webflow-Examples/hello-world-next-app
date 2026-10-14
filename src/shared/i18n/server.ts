import { createInstance, type Resource } from 'i18next';

import type { LocaleId } from '@/shared/config/locales';

import { DEFAULT_NAMESPACE, i18nOptions, type Namespace } from './settings';

/**
 * Server-side translation.
 *
 * Three things shape this file.
 *
 * 1. A fresh i18next instance per call. A singleton on the server would leak one request's
 *    language into another's render.
 * 2. Resources are plain JSON modules, resolved by the bundler, and the instance is then
 *    initialised synchronously from them. An i18next backend plugin cannot be used for this:
 *    its loading is async work at render time, which costs a round trip on every render and
 *    puts a network-shaped dependency in front of the first byte.
 *
 *    This loading used to sit behind `use cache`, because `cacheComponents` was on. It no
 *    longer is - the flag hangs every React route on the Workers runtime - so the directive
 *    came out with it. See next.config.ts and docs/adr/0005-cache-components-on-workers.md.
 *    Nothing here needs to change if the flag returns: `use cache` goes back on
 *    `loadResources`, which is why the loading is still a function of its own.
 * 3. The deployment target is the Workers runtime (Cloudflare, via Webflow Cloud). A module
 *    specifier built at runtime - `import(\`./locales/${locale}/${ns}.json\`)` - cannot be
 *    resolved there. The bundler has to see every specifier it will ever need, so the loaders
 *    are enumerated below.
 *
 * The enumeration is deliberate, not boilerplate to be refactored away. The
 * `Record<LocaleId, Record<Namespace, ResourceLoader>>` annotation makes a new locale or a
 * new namespace a TypeScript error here, which is where a missing translation file should be
 * found - at compile time, naming the gap. The template-literal form it replaced could only
 * fail at render time, in a request, for one locale.
 */

type ResourceLoader = () => Promise<{ default: Record<string, string> }>;

const RESOURCE_LOADERS: Record<LocaleId, Record<Namespace, ResourceLoader>> = {
  en: {
    common: () => import('./locales/en/common.json'),
    navigation: () => import('./locales/en/navigation.json'),
    forms: () => import('./locales/en/forms.json'),
    evidence: () => import('./locales/en/evidence.json'),
  },
  de: {
    common: () => import('./locales/de/common.json'),
    navigation: () => import('./locales/de/navigation.json'),
    forms: () => import('./locales/de/forms.json'),
    evidence: () => import('./locales/de/evidence.json'),
  },
  us: {
    common: () => import('./locales/us/common.json'),
    navigation: () => import('./locales/us/navigation.json'),
    forms: () => import('./locales/us/forms.json'),
    evidence: () => import('./locales/us/evidence.json'),
  },
  'sa-en': {
    common: () => import('./locales/sa-en/common.json'),
    navigation: () => import('./locales/sa-en/navigation.json'),
    forms: () => import('./locales/sa-en/forms.json'),
    evidence: () => import('./locales/sa-en/evidence.json'),
  },
};

async function loadResources(
  locale: LocaleId,
  namespaces: readonly Namespace[],
): Promise<Resource> {
  const loaded = await Promise.all(
    namespaces.map(async (ns) => {
      const mod = await RESOURCE_LOADERS[locale][ns]();
      return [ns, mod.default] as const;
    }),
  );

  return { [locale]: Object.fromEntries(loaded) };
}

export async function getTranslation(
  locale: LocaleId,
  namespace: Namespace | Namespace[] = DEFAULT_NAMESPACE,
) {
  const namespaces = Array.isArray(namespace) ? namespace : [namespace];
  const resources = await loadResources(locale, namespaces);

  const instance = createInstance();
  await instance.init({ ...i18nOptions(locale, namespaces), resources, initAsync: false });

  return {
    t: instance.getFixedT(locale, namespaces[0]),
    /** Hand these to `I18nProvider` when a Client Component below needs the same strings. */
    resources,
  };
}
