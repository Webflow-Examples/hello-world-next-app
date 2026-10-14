import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/shared/config';
import { sitemapUrls } from '@/shared/seo';

/**
 * robots.txt.
 *
 * It enumerates the per-locale sitemap partitions rather than a single index, because
 * `generateSitemaps` publishes one file per locale and only cleared locales produce one.
 *
 * The host is read from the canonical origin, so a preview deployment that sets
 * NEXT_PUBLIC_SITE_URL advertises its own sitemaps and never the production ones.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: [...sitemapUrls()],
    host: absoluteUrl('/'),
  };
}
