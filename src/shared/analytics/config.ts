/**
 * Analytics configuration.
 *
 * WS-D: "GA4, Google Search Console and Bing Webmaster across all locales; event model for
 * the evaluation routes: pilot programme, lighthouse centres, request demonstration,
 * collaborate on evidence."
 *
 * No container id exists yet. Everything here is inert until one is supplied, and the app
 * loads no third-party script without it.
 */

/** GTM container id. Public by nature; a container id is not a credential. */
export const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_ID ?? '';

export const analyticsEnabled = (): boolean => GTM_CONTAINER_ID.length > 0;

/**
 * The evaluation-route event model, named once so a call site cannot invent a variant.
 *
 * An event fires on the real outcome, never on the click that precedes it: a submission that
 * HubSpot rejected is not a conversion.
 */
export const ANALYTICS_EVENTS = {
  pilotProgrammeRequested: 'pilot_programme_requested',
  lighthouseCentreEnquiry: 'lighthouse_centre_enquiry',
  demonstrationRequested: 'demonstration_requested',
  evidenceCollaborationEnquiry: 'evidence_collaboration_enquiry',
} as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/**
 * Consent categories, all denied until the visitor grants them.
 *
 * The property serves the EU and Switzerland, so measurement and advertising storage start
 * denied and are granted only by an explicit choice. `security_storage` is granted because it
 * covers strictly necessary storage.
 *
 * TODO(legal): no consent management platform has been selected. Until one is, nothing calls
 * `grantConsent`, so the defaults below are the whole story and no measurement happens.
 */
export const CONSENT_DEFAULTS = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500,
} as const;
