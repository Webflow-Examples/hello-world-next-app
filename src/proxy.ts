import { NextResponse, type NextRequest } from 'next/server';

import { DEFAULT_LOCALE, ROUTED_PREFIXES } from '@/shared/config/locales';
import { isGone } from '@/shared/seo/redirects';

/**
 * Locale routing.
 *
 * In Next 16 this file replaces `middleware.ts`; the `middleware` convention is deprecated.
 *
 * Behaviour:
 *  - `/de/...`, `/us/...` are served by the matching `[locale]` segment unchanged.
 *  - Every other path is REWRITTEN (not redirected) into the default locale segment, so the
 *    default locale lives at `/` with no prefix, exactly as `docs/spec/page-register.md`
 *    specifies (`/`, `/why-quantify`, `/quantis/st/` ...).
 *  - `/en/...` is redirected to the unprefixed path so the default locale has one URL only
 *    and the canonical never competes with a duplicate.
 *
 * What this file must NEVER do (docs/spec/claims-guardrails.md, CLUSTER RULE):
 *  - No automatic geo-redirection. The locale is chosen by the user, never inferred from IP,
 *    `Accept-Language`, or any other signal.
 *  - No redirect of a missing localised page to another locale. A locale that cannot yet carry
 *    a page serves the substituted slot, not a 404 and not a cross-locale redirect.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Removed, not moved. WS-D retires two placeholder training pages and two test
  // case-report pages with 410 rather than redirecting them, so the URLs stop making the
  // statements they currently make.
  if (isGone(pathname)) {
    return new NextResponse(null, { status: 410 });
  }

  const defaultPrefix = `/${DEFAULT_LOCALE}`;
  if (pathname === defaultPrefix || pathname.startsWith(`${defaultPrefix}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultPrefix.length) || '/';
    return NextResponse.redirect(url, 308);
  }

  const prefixed = ROUTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (prefixed) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `${defaultPrefix}${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  /**
   * Skip Next internals, the metadata routes and anything with a file extension. Metadata
   * routes must not be rewritten into a locale segment: `robots.txt` and the sitemap set are
   * served once for the whole property and partitioned by locale internally.
   */
  matcher: ['/((?!_next/|api/|robots\\.txt|sitemap.*\\.xml|.*\\..*).*)'],
};
