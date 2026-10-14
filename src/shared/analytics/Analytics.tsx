import { GoogleTagManager } from '@next/third-parties/google';

import { CONSENT_DEFAULTS, GTM_CONTAINER_ID, analyticsEnabled } from './config';

/**
 * Google Tag Manager with Consent Mode v2 defaults.
 *
 * Order matters and is the whole point of this component: the consent defaults must execute
 * before the container loads, otherwise GTM fires tags in the window before the first consent
 * update and the denial is decorative.
 *
 * The defaults are a plain inline `<script>` in `<head>` rather than `next/script`. An inline
 * script executes in document order, so it is guaranteed to run before the container that
 * `GoogleTagManager` injects. `next/script` with `beforeInteractive` would express the same
 * intent less directly and only applies at the root of the document.
 *
 * `@next/third-parties` is published by the Next team and only injects the GTM snippet, so it
 * carries no hosting dependency while the platform is undecided.
 *
 * Renders nothing when no container id is configured. That is the normal state today.
 */
export function Analytics() {
  if (!analyticsEnabled()) return null;

  const consentDefaults = [
    'window.dataLayer=window.dataLayer||[];',
    'function gtag(){dataLayer.push(arguments);}',
    `gtag('consent','default',${JSON.stringify(CONSENT_DEFAULTS)});`,
  ]
    .join('')
    .replace(/</g, '\\u003c');

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: consentDefaults }} />
      <GoogleTagManager gtmId={GTM_CONTAINER_ID} />
    </>
  );
}
