import { canonicalPath } from './locales';

/**
 * What this deployment actually serves, as opposed to what it plans to serve.
 *
 * `PAGE_REGISTER` is the plan: 51 rows transcribed from the estimate, with the indexation and
 * claims columns the register states for each. It says nothing about whether a route segment
 * exists. Treating it as the set of live URLs put 35 entries in the sitemap of which 34
 * answered 404, and advertised the one that resolves while that page served
 * `<meta name="robots" content="noindex, nofollow">`.
 *
 * So the sitemap, the redirect map and the page's own robots meta all read this module, and a
 * URL reaches a crawler only when every one of them agrees. Adding a row here is the act of
 * publishing a page; it is not a transcription and no generator writes it.
 *
 * This module is a leaf: it imports `canonicalPath` and nothing else. `src/shared/seo/
 * redirects.ts` is loaded by `next.config.ts` and reaches this file, so nothing here may read
 * the environment or import from the application.
 */

export interface BuiltRoute {
  /** The path as the register writes it; stored normalised by `canonicalPath`. */
  readonly url: string;
  /**
   * Whether the route's own `<meta name="robots">` permits indexing.
   *
   * A built route is not automatically an indexable one. The register's `Index, follow` is a
   * statement about the finished page, not about a scaffold standing in for it.
   */
  readonly indexable: boolean;
  /** Why indexing is held. Required whenever `indexable` is false; see the test. */
  readonly heldBecause?: string;
}

export const BUILT_ROUTES: readonly BuiltRoute[] = [
  {
    url: '/',
    indexable: false,
    heldBecause:
      'TODO(WS-D): the title tag and meta description are claim surfaces and have not cleared metadata claims QA. src/app/[locale]/page.tsx serves a scaffold title in their place, and a scaffold title must not be quoted in a search result.',
  },
];

const BY_URL = new Map(BUILT_ROUTES.map((route) => [canonicalPath(route.url), route]));

/** The built route serving `path`, or `undefined` when nothing serves it. */
export function builtRoute(path: string): BuiltRoute | undefined {
  return BY_URL.get(canonicalPath(path));
}

/** Whether a request for `path` resolves at all. A redirect destination must satisfy this. */
export function isBuilt(path: string): boolean {
  return BY_URL.has(canonicalPath(path));
}

/** Whether `path` may be submitted to a crawler: it resolves, and it is not held noindex. */
export function isPublished(path: string): boolean {
  return builtRoute(path)?.indexable === true;
}

/**
 * The robots directive for a route segment, so the page and the sitemap cannot disagree.
 *
 * A path with no built route gets the held directive rather than an open one: being asked for
 * the directive of a page that does not exist is a bug, and the safe answer to it is noindex.
 */
export function robotsForPath(path: string): { index: boolean; follow: boolean } {
  const indexable = isPublished(path);
  return { index: indexable, follow: indexable };
}
