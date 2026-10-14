import {
  PAGE_REGISTER,
  type ClaimsGate,
  type RegisterEntry,
  type Silo,
  type Template,
} from './page-register';

/**
 * The page register as the application consumes it.
 *
 * `page-register.ts` holds the rows, transcribed from the estimate spreadsheet. This module
 * adds lookups and the predicates that encode what each status column means, so no call site
 * has to re-interpret a register value.
 *
 * Never inline a URL as a string literal. A slug is a claim surface and changes only as a
 * reviewed specification change; see the header of `page-register.ts`.
 *
 * The register says which pages are PLANNED. What this deployment actually serves is
 * `built-routes.ts`; see docs/adr/0002-built-routes-gate.md.
 */

export {
  PAGE_REGISTER,
  type ClaimsGate,
  type Indexation,
  type RegisterEntry,
  type Silo,
  type Template,
  type Timing,
} from './page-register';

const BY_ID = new Map(PAGE_REGISTER.map((entry) => [entry.id, entry]));

const BY_URL = new Map(
  PAGE_REGISTER.flatMap((entry) => entry.urls.map((url) => [url, entry] as const)),
);

export function entryById(id: string): RegisterEntry | undefined {
  return BY_ID.get(id);
}

/** Looks up by the exact URL as the register wrote it, including a `<slug>` placeholder. */
export function entryByUrl(url: string): RegisterEntry | undefined {
  return BY_URL.get(url);
}

export function entriesBySilo(silo: Silo): readonly RegisterEntry[] {
  return PAGE_REGISTER.filter((entry) => entry.silo === silo);
}

export function entriesByTemplate(template: Template): readonly RegisterEntry[] {
  return PAGE_REGISTER.filter((entry) => entry.template === template);
}

/**
 * A reserved node is held in the tree but is "not built, not indexed and not linked".
 * Never create a route, a navigation entry, an internal link or a sitemap entry for one.
 */
export function isReserved(entry: RegisterEntry): boolean {
  return entry.template === 'reserved' || entry.indexation === 'Not built';
}

/**
 * Whether the page may appear in the sitemap and be crawled. Reserved nodes are excluded, as
 * are the pages whose indexation is explicitly held pending a claims review.
 */
export function isIndexable(entry: RegisterEntry): boolean {
  return entry.indexation === 'Index, follow' || entry.indexation === 'Index, nofollow';
}

/**
 * Whether approved copy may be placed on the page today.
 *
 *   LOW    - may be produced now.
 *   MEDIUM - requires Product/Technical confirmation.
 *   HARD   - blocked until QARA/Regulatory and Clinical/Medical clear the specific wording.
 *
 * Structure and components may be built at any gate. This predicate is about content only.
 */
export function copyIsCleared(entry: RegisterEntry, clearedGates: readonly ClaimsGate[]): boolean {
  return clearedGates.includes(entry.gate);
}

/** Entries whose URL the register left relative, e.g. `.../acute-compartment-syndrome`. */
export function unresolvedUrls(): readonly RegisterEntry[] {
  return PAGE_REGISTER.filter((entry) => entry.urlUnresolved);
}
