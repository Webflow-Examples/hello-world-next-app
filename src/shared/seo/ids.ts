import { SITE_ORIGIN } from '@/shared/config/site';

/**
 * Stable `@id` registry for the entity graph.
 *
 * WS-D: "Persistent @id for soft-tissue compressibility and CP Value, cited by every clinical
 * and product page. These are the two most citable objects on the property."
 *
 * An `@id` is a permanent identifier. Once published it is cited by other pages and by answer
 * engines, so changing one silently breaks every reference to it. Treat a change here the way
 * you would treat a URL change: it needs a decision, not a refactor.
 *
 * The identifiers are rooted at the canonical origin and are locale-independent on purpose.
 * One concept has one identity across markets, even where the wording describing it differs.
 */

const graph = (fragment: string) => `${SITE_ORIGIN}/#${fragment}`;

export const ENTITY_IDS = {
  organization: graph('organization'),
  website: graph('website'),

  /** DefinedTerm. The measurement vocabulary's two anchor objects. */
  softTissueCompressibility: graph('soft-tissue-compressibility'),
  cpValue: graph('cp-value'),
} as const;

export type EntityId = (typeof ENTITY_IDS)[keyof typeof ENTITY_IDS];

/**
 * Owned profiles and third-party listings fed into `Organization.sameAs`.
 *
 * WS-D requires a single register: "Any new profile is added to the register before it is
 * published." An inconsistency between a profile name and the website reproduces the entity
 * fragmentation the consolidation work exists to remove.
 *
 * TODO(marketing): populate once the LinkedIn rebuild and the YouTube channel build are done.
 * Legacy device names - VeinPress, CPMX1, CPM#1 - are retired, not run in parallel.
 */
export const SAME_AS: readonly string[] = [];
