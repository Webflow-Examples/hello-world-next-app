import type { ReactNode } from 'react';

import { MAIN_CONTENT_ID } from './ids';
import classes from './skipToContent.module.css';

/**
 * The `<main>` landmark, and the target of `SkipLink`.
 *
 * It is rendered by the root layout around `{children}`, not by a screen. `error.tsx`,
 * `not-found.tsx` and `loading.tsx` render as layout CHILDREN rather than as screens, so if a
 * screen owned `<main>` those three states would ship with no landmark at all and the skip
 * link would point at a fragment that does not exist in the document.
 *
 * It carries NO layout styling - no container, no padding, no max-width. Everything visual
 * inside it belongs to the screen. The only rule attached to its class suppresses the
 * click-focus ring described below.
 *
 * `tabIndex={-1}` IS REQUIRED, NOT OPTIONAL. `<main>` is not natively focusable; without it
 * several browsers move scroll position to the fragment but leave keyboard focus where it was,
 * so the next Tab press returns to the navigation the user just asked to skip. The feature
 * then fails while appearing to work, which is why this is stated here rather than assumed.
 */
export function MainLandmark({ children }: { children: ReactNode }) {
  return (
    <main className={classes.mainLandmark} id={MAIN_CONTENT_ID} tabIndex={-1}>
      {children}
    </main>
  );
}
