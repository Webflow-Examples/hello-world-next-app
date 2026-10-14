import { notFound } from 'next/navigation';

import { HomeScreen } from '@/screens/home';
import { buildAlternates, isRoutedLocale, robotsForPath } from '@/shared/config';

/**
 * Route segment for `/` (and `/de`, `/us`).
 *
 * The segment resolves params, decides metadata and renders a screen. Composition belongs to
 * the screen; see `src/screens/README.md`.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isRoutedLocale(locale)) notFound();

  return {
    // TODO(WS-D): title and description come from docs/spec/page-register.md, row `Homepage`,
    // and only after the metadata claims QA gate has cleared them.
    title: 'Compremium - scaffold',
    // Read from BUILT_ROUTES rather than written here, because the sitemap reads the same
    // entry. Hard-coding noindex on the page while the sitemap derived indexability from the
    // register is how `/` came to be submitted for indexing by a page that forbids it.
    robots: robotsForPath('/'),
    alternates: buildAlternates(locale, '/'),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isRoutedLocale(locale)) notFound();

  return <HomeScreen locale={locale} />;
}
