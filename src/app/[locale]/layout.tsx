import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  ROUTED_LOCALES,
  SITE_ORIGIN,
  buildAlternates,
  htmlLang,
  isRoutedLocale,
} from '@/shared/config';
import { Analytics } from '@/shared/analytics';
import { getTranslation } from '@/shared/i18n';
// Keep @/shared/theme above @/shared/ui: Mantine's stylesheet is pulled in through the theme
// slice, so this import order puts it first in the module graph. Hygiene only - nothing here
// relies on it. The project stylesheet wins on specificity, not on order; see
// src/shared/ui/skip-to-content/skipToContent.module.css for why order cannot be depended on.
import { ColorSchemeScript, Providers, mantineHtmlProps } from '@/shared/theme';
import { MainLandmark, SkipLink } from '@/shared/ui';

/**
 * Root layout.
 *
 * There is no `src/app/layout.tsx`: the locale segment is the root, so `<html lang>` can carry
 * the locale. `src/proxy.ts` rewrites unprefixed paths into the default locale segment.
 */

export function generateStaticParams() {
  return ROUTED_LOCALES.map((locale) => ({ locale: locale.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isRoutedLocale(locale)) notFound();

  return {
    metadataBase: new URL(SITE_ORIGIN),
    alternates: buildAlternates(locale, '/'),
    // NOTE: no title or description here on purpose. Both are claim surfaces and are set
    // per page from docs/spec/page-register.md, never inherited from a layout default.
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isRoutedLocale(locale)) notFound();

  const { t } = await getTranslation(locale);

  return (
    <html lang={htmlLang(locale)} {...mantineHtmlProps}>
      <head>
        {/* Forced light: see the note in src/shared/theme/Providers.tsx. */}
        <ColorSchemeScript forceColorScheme="light" />
        <Analytics />
      </head>
      <body>
        <Providers>
          {/*
            The skip link must be the first focusable element in the document and `<main>` is
            owned here rather than by a screen: `error.tsx`, `not-found.tsx` and `loading.tsx`
            render as children of this layout, so a screen-owned landmark would leave those
            states with no `<main>` and the skip link pointing at nothing.

            `MainLandmark` adds no layout styling. Container, padding and max-width belong to
            whatever renders inside it.

            The label is localised; the `#main-content` fragment is not. The string is an
            existing, approved interface string in every `common.json` - consumed unchanged.
          */}
          <SkipLink label={t('skipToContent')} />
          <MainLandmark>{children}</MainLandmark>
        </Providers>
      </body>
    </html>
  );
}
