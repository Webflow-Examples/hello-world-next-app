import type { NextConfig } from 'next';

import { activeRedirects, heldRedirects } from './src/shared/seo/redirects';

const nextConfig: NextConfig = {
  /**
   * `cacheComponents` and `partialPrefetching` are deliberately absent.
   *
   * The deployment target is Webflow Cloud, which runs Next.js on the Cloudflare Workers
   * runtime through the OpenNext adapter. Webflow Cloud states that composable caching - the
   * `use cache` directive, which `cacheComponents` enables - is not supported there, and the
   * behaviour is worse than the word "unsupported" suggests: with `cacheComponents: true`
   * every route that renders React hangs on the Workers runtime, and the request is cancelled
   * with no stack trace. `/robots.txt` survived because it renders no components, which is
   * what made the cause findable at all.
   *
   * Measured on @opennextjs/cloudflare 1.20.11 + Next 16.3.8: with the flag, `/`, `/de`, `/us`
   * and the 404 path all answer 500; without it, all four answer correctly. The same build
   * serves every one of them under `next start`, so this is the runtime, not the pages.
   *
   * `partialPrefetching` is not a separate decision: Next refuses to build with it unless
   * `cacheComponents` is on ("`partialPrefetching` requires `cacheComponents` to be enabled").
   *
   * Restore both together, and only after a preview deployment proves React routes render -
   * when OpenNext ships composable-caching support and Webflow Cloud picks it up. The cost of
   * leaving them off is partial prerendering and prefetching, not correctness; see
   * docs/adr/0005-cache-components-on-workers.md.
   */

  /**
   * Legacy URL migration. The map lives in src/shared/seo/redirects.ts so it can be unit
   * tested for chains, loops and dead targets, which WS-D requires before launch rather than
   * after.
   *
   * Only the pairs whose destination is a built route are served. A 301 to a path that answers
   * 404 spends the legacy URL's equity on nothing and reads as a finished migration; a held
   * pair activates by itself once its target is added to BUILT_ROUTES.
   */
  async redirects() {
    for (const held of heldRedirects()) {
      console.warn(
        `[redirects] ${held.source} -> ${held.destination} is withheld: ${held.destination} is not a built route. ` +
          `Add it to BUILT_ROUTES in src/shared/config/built-routes.ts once the page exists.`,
      );
    }

    return activeRedirects().map((entry) => ({ ...entry }));
  },
};

export default nextConfig;
