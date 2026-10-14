import type { MetadataRoute } from 'next';

import type { LocaleId } from '@/shared/config';
import { sitemapForLocale, sitemapLocales } from '@/shared/seo';

/**
 * Per-locale sitemap partitions, served at `/sitemap/<locale>.xml`.
 *
 * WS-D asks for "sitemap partitioning by locale". A partition is produced for a locale whose
 * publication gate has cleared AND which has at least one published URL, so a locale that is
 * allowed to publish but has nothing built yet produces no file rather than an empty one.
 * robots.txt lists the same set.
 */

export async function generateSitemaps() {
  return sitemapLocales().map((locale) => ({ id: locale.id }));
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const locale = (await id) as LocaleId;
  return [...sitemapForLocale(locale)];
}
