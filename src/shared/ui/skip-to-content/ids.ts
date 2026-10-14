/**
 * The fragment target shared by the skip link and the `<main>` landmark.
 *
 * One constant, exported once, so the `href` and the `id` cannot drift apart. A drift here is
 * silent: the link still renders, still receives focus, and simply does nothing - which is the
 * single most common way a skip link regresses.
 *
 * The id is LOCALE-INVARIANT on purpose. The visible label is translated per market; the
 * fragment is not. A localised fragment would make `#main-content` market-specific for no
 * benefit and would break any deep link that carries it across locales.
 */
export const MAIN_CONTENT_ID = 'main-content';
