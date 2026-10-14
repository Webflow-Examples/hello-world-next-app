import { MAIN_CONTENT_ID } from './ids';
import classes from './skipToContent.module.css';

/**
 * "Skip to content" - the first focusable element on the page.
 *
 * WCAG 2.1 AA, 2.4.1 Bypass Blocks. It must come before every other focusable element in the
 * document, and its target is the `<main>` landmark rendered by `MainLandmark`.
 *
 * WHY THIS IS A PLAIN `<a>` AND NOT A COMPONENT FROM THE KIT'S MANTINE SURFACE
 *
 * The next reader will ask whether this breaks the project's Mantine rule. It does not. That
 * rule constrains WHERE Mantine may be imported (`src/shared/` only, see `./../mantine.ts`);
 * it does not say that every piece of UI must be a Mantine component.
 *
 *  - NOT Mantine `Anchor`. It is a client component, so it would push a client boundary into
 *    the root layout for an element that has no interactivity beyond a native fragment link.
 *    It also applies theme styling - from a theme that is still a `TODO(WS-C)` skeleton - to
 *    the first focusable element on every page in the site.
 *  - NOT `next/link`. This is a same-document fragment. Routing it through the client router
 *    means the browser's native fragment handling never runs, and the native fragment handling
 *    is precisely what moves focus. Using `next/link` here defeats the feature silently: the
 *    link still works, focus never moves.
 *
 * Presentational and synchronous by design: the label is translated by the caller (the layout
 * already awaits `getTranslation`), so this component stays free of locale plumbing.
 */
export function SkipLink({ label }: { label: string }) {
  return (
    <a className={classes.skipLink} href={`#${MAIN_CONTENT_ID}`}>
      {label}
    </a>
  );
}
