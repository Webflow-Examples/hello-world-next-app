// Relative, not `@/shared/...`: `next.config.ts` loads this module outside the application's
// module graph, where the tsconfig path alias is not guaranteed to resolve.
import { isBuilt } from '../config/built-routes';

/**
 * Legacy URL migration.
 *
 * Source: docs/spec/seo-requirements.md, "Redirect map build and QA (301 / 410)".
 *
 * This module is imported by `next.config.ts`, so it must read no environment and import no
 * module that does. `built-routes` is a leaf of plain data and satisfies that; `shared/config`
 * as a whole does not, because `site.ts` reads NEXT_PUBLIC_SITE_URL.
 *
 * Only the pairs the source material states explicitly are encoded. WS-D names further legacy
 * paths without giving their targets; inventing one would create a slug, and a slug is a claim
 * surface. The unresolved list is below, with the owner who must supply the targets.
 */

export interface LegacyRedirect {
  readonly source: string;
  readonly destination: string;
  /**
   * 301, not Next's `permanent: true`.
   *
   * `permanent: true` emits 308. WS-D specifies the migration as "301 / 410", and a migration
   * map is audited against that wording by the SEO side, so the status code is stated rather
   * than inherited from a framework default.
   */
  readonly statusCode: 301;
}

/**
 * Confirmed legacy-to-target pairs from WS-D.
 *
 * This is the migration map as the source material states it: a record of approved pairs, not
 * the set of redirects this deployment serves. `activeRedirects` decides that.
 *
 * The register writes these targets with a trailing slash (`/quantis/st/`). They are stored
 * here in the slashless form the application actually serves, because a redirect to
 * `/quantis/st/` is answered with a further 308 to `/quantis/st` and the migration becomes a
 * chain. See `canonicalPath` in src/shared/config/locales.ts for the open decision behind
 * the chosen form.
 */
export const LEGACY_REDIRECTS: readonly LegacyRedirect[] = [
  { source: '/solution', destination: '/quantis/st', statusCode: 301 },
  { source: '/cvp/quantis-cvp', destination: '/quantis/cvp', statusCode: 301 },
  { source: '/clinical-evidence', destination: '/evidence', statusCode: 301 },
];

/**
 * The pairs `next.config.ts` actually serves: those whose destination resolves today.
 *
 * A 301 to a path that answers 404 is worse than no redirect at all. It spends the legacy
 * URL's equity on a dead target, reports as a broken redirect in every crawl, and reads as a
 * finished migration to anyone auditing the map. `/solution` did exactly that: 301 to
 * `/quantis/st`, which is a register row and not a route.
 *
 * A held pair activates by itself the moment its target is added to `BUILT_ROUTES`, so nothing
 * has to be remembered at cut-over. `heldRedirects` is what the build reports, so nothing is
 * silently withheld either.
 */
export function activeRedirects(): readonly LegacyRedirect[] {
  return LEGACY_REDIRECTS.filter((entry) => isBuilt(entry.destination));
}

/** Approved pairs withheld because their destination is not built yet. */
export function heldRedirects(): readonly LegacyRedirect[] {
  return LEGACY_REDIRECTS.filter((entry) => !isBuilt(entry.destination));
}

/**
 * Legacy paths WS-D lists without a stated target:
 *
 *   /publications, /white-papers, /case-reports, /career, /training-resources,
 *   and "the three legal pages consolidated to two".
 *
 * TODO(seo-lead): supply the target for each before migration. Leaving a legacy URL
 * unmapped loses its equity; guessing a target invents a slug.
 */
export const UNMAPPED_LEGACY_PATHS: readonly string[] = [
  '/publications',
  '/white-papers',
  '/case-reports',
  '/career',
  '/training-resources',
];

/**
 * Paths removed with 410 Gone rather than redirected.
 *
 * WS-D: "two placeholder training pages and two test case-report pages removed with 410".
 * The two case-report slugs "make surgical-timing and fasciotomy statements at URL level and
 * must be cleared before migration, not after", so they are a claims item, not a routing one.
 *
 * TODO(seo-lead): supply the four exact paths. `src/proxy.ts` serves 410 for every entry here.
 */
export const GONE_PATHS: readonly string[] = [];

/** True when `path` is served as 410 Gone. */
export function isGone(path: string): boolean {
  return GONE_PATHS.includes(path);
}

export interface RedirectMapProblem {
  readonly kind:
    'chain' | 'loop' | 'duplicate-source' | 'source-equals-destination' | 'destination-not-built';
  readonly path: string;
}

/**
 * Validates the map the way WS-D requires it to be validated: "chain and loop QA on staging
 * and after launch", plus the check that makes those two meaningful - that the destination
 * resolves. Running it as a test moves all three earlier than staging.
 *
 * The default argument is the served map, so a held pair is not reported as a defect of the
 * routing table it is deliberately absent from. Pass `LEGACY_REDIRECTS` to audit the full
 * approved map instead.
 */
export function validateRedirects(
  redirects: readonly LegacyRedirect[] = activeRedirects(),
): readonly RedirectMapProblem[] {
  const problems: RedirectMapProblem[] = [];
  const bySource = new Map<string, string>();

  for (const entry of redirects) {
    if (bySource.has(entry.source)) {
      problems.push({ kind: 'duplicate-source', path: entry.source });
      continue;
    }
    bySource.set(entry.source, entry.destination);
    if (entry.source === entry.destination) {
      problems.push({ kind: 'source-equals-destination', path: entry.source });
    }
    // "Resolves in one hop" is only true if the one hop lands somewhere. A destination that
    // is not built answers 404, which is neither a chain nor a loop and was therefore invisible
    // to the checks below.
    if (!isBuilt(entry.destination)) {
      problems.push({ kind: 'destination-not-built', path: entry.source });
    }
  }

  for (const [source, destination] of bySource) {
    // A destination that is not itself a source resolves in one hop. That is the goal.
    if (!bySource.has(destination)) continue;

    const seen = new Set<string>([source]);
    let current: string | undefined = destination;
    let isLoop = false;

    while (current !== undefined && bySource.has(current)) {
      if (seen.has(current)) {
        isLoop = true;
        break;
      }
      seen.add(current);
      current = bySource.get(current);
    }

    problems.push({ kind: isLoop ? 'loop' : 'chain', path: source });
  }

  return problems;
}
