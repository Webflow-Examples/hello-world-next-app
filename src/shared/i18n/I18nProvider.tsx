'use client';

import { createInstance, type Resource } from 'i18next';
import { useState, type ReactNode } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import type { LocaleId } from '@/shared/config/locales';

import { i18nOptions, type Namespace } from './settings';

/**
 * Client boundary for i18next.
 *
 * Resources are handed down from the server rather than fetched again: the strings a page
 * needs are already known at render time, and a second fetch would add a request on the
 * critical path of a Core Web Vitals-sensitive page.
 *
 * Client Components below this provider use `useTranslation`. Server Components use
 * `getTranslation` from `./server` and never touch this file.
 */
export function I18nProvider({
  locale,
  namespaces,
  resources,
  children,
}: {
  locale: LocaleId;
  namespaces: Namespace | Namespace[];
  resources: Resource;
  children: ReactNode;
}) {
  const [instance] = useState(() => {
    const i18n = createInstance();
    void i18n.use(initReactI18next).init({ ...i18nOptions(locale, namespaces), resources });
    return i18n;
  });

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
