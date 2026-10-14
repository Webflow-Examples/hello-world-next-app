import { createTheme, type MantineThemeOverride } from '@mantine/core';

import { APPROVED, blue, gray, lime, orange, pink, sky } from './colors';

/**
 * Mantine theme.
 *
 * The colour system is complete and comes from the Figma handover of 2026-10-13; see
 * `colors.ts` for the values and `docs/adr/0003-colour-palette.md` for the decisions. Every
 * other axis - typography, spacing, radii - is still a `TODO(WS-C)` skeleton.
 *
 * The theme object is the single source of design tokens. Do not hard-code colours, spacing,
 * radii or font sizes in components or CSS modules - add them here and reference the token.
 *
 * BINDING CONSTRAINTS (docs/spec/claims-guardrails.md):
 *
 *   1. STRICT RULE: No red/green traffic-light risk scales.
 *      No semantic colour may encode a clinical risk level, a measurement result or a patient
 *      state. A red/amber/green ramp is prohibited for anything a clinician could read as a
 *      verdict. The palette contains `lime`, `orange` and `pink`, which is exactly the set
 *      such a ramp would be built from; they are brand accents and nothing more. Status
 *      colours for non-clinical UI - form validation, system messages - remain permitted and
 *      must be named so the distinction is obvious (`formError`, not `danger`).
 *
 *   2. Guardrail: High-contrast medical readability.
 *      The project targets WCAG 2.1 AA. Every text/background pair defined here must clear
 *      4.5:1 for body text and 3:1 for large text and non-text UI. The pairs this theme can
 *      produce are asserted in `colors.test.ts` against the literal hex values.
 */
export const theme: MantineThemeOverride = createTheme({
  /**
   * `blue`, `gray`, `orange`, `pink` and `lime` override Mantine's colours of the same name.
   * That is deliberate: it means `color="blue"` cannot quietly return stock Mantine blue, and
   * Mantine's own semantic variables resolve to brand neutrals. `sky` is a new key.
   */
  colors: { blue, gray, lime, orange, pink, sky },

  primaryColor: 'blue',

  /**
   * The brand blue lives at index 9 rather than the usual 6 - it is that dark. See `colors.ts`
   * for the measurement and for why this is the shade that keeps the hover state visible.
   *
   * A single number, not `{ light, dark }`: the dark scheme is not built. See `Providers.tsx`.
   */
  primaryShade: 9,

  /**
   * Mantine picks the text colour on a filled surface by comparing the surface's relative
   * luminance against `luminanceThreshold`.
   *
   * The threshold is 0.22 rather than the default 0.3 because of one colour: `orange` has a
   * luminance of 0.2776 and sits between the two. At the default it counts as dark, takes
   * white text and produces 3.21:1 - a failure. Below 0.22 it counts as light, takes the brand
   * black and produces 4.70:1 - a pass. Every other accent is far from the boundary.
   *
   * This is why `autoContrast` is on at all: it removes the choice from the call site, where
   * the failing combination is the one that looks right.
   */
  autoContrast: true,
  luminanceThreshold: 0.22,

  /**
   * `autoContrast` resolves to these two, so they must be the brand's own black and white and
   * not Mantine's. The black is the measured one: 15.05:1 on white, 4.70:1 on the orange.
   */
  black: APPROVED.black,
  white: APPROVED.white,

  // TODO(WS-C): typography scale from the brand book.
  // fontFamily: ...,
  // headings: { fontFamily: ..., sizes: { ... } },

  // TODO(WS-C): spacing and radius scales.
  // spacing: { ... },
  // radius: { ... },

  /**
   * Focus must stay visible for keyboard users. `auto` shows the ring only for keyboard
   * navigation, which is the WCAG 2.1 AA behaviour. Never set this to `never`.
   */
  focusRing: 'auto',

  /**
   * Respects `prefers-reduced-motion`. Relevant for the GSAP work in the brief: any animation
   * added later must honour the same preference.
   */
  respectReducedMotion: true,
});
