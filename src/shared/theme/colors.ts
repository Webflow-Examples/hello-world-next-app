import { type MantineColorsTuple, colorsTuple } from '@mantine/core';

/**
 * The Compremium palette.
 *
 * Source: Figma, Compremium file, node 458-273, handed over 2026-10-13. Eleven values were
 * approved; two of them were added during handover to close WCAG gaps the palette left open
 * (see `ADDED` below). Nothing here may be edited without a corresponding design decision -
 * `docs/adr/0003-colour-palette.md` records why each value sits where it does.
 *
 * STRICT RULE (docs/spec/claims-guardrails.md): `lime`, `orange` and `pink` are brand accents.
 * They must never be assembled into a traffic-light ramp, and no colour here may encode a
 * clinical risk level, a measurement result or a patient state. Names are literal for exactly
 * this reason: there is no `success`, no `warning`, no `danger`.
 */
export const APPROVED = {
  blue: '#2C3956',
  black: '#23272A',
  light: '#F4F5F6',
  white: '#FFFFFF',
  lightGray: '#DBDBDB',
  gray: '#838383',
  orange: '#FF5500',
  sky: '#13CBFB',
  pink: '#FF0066',
  lime: '#C7F12E',
} as const;

/**
 * Two neutrals the Figma palette does not contain, approved in the handover conversation.
 *
 * Measured, not chosen by eye. Each has to clear its threshold on BOTH light surfaces - plain
 * white and the `light` panel - because a component does not know which one it will be placed
 * on:
 *
 *   grayText    #6E6E6E   5.10:1 on #FFFFFF   4.67:1 on #F4F5F6   (body text needs 4.5:1)
 *   grayBorder  #8E8E8E   3.28:1 on #FFFFFF   3.00:1 on #F4F5F6   (WCAG 1.4.11 needs 3:1)
 *
 * The approved `gray` #838383 is 3.79:1 on white and cannot carry body text. That is the same
 * failure Mantine's default dimmed grey produced here before - see `cssVariables.ts`.
 */
export const ADDED = {
  grayText: '#6E6E6E',
  grayBorder: '#8E8E8E',
} as const;

/**
 * Neutral ramp, overriding Mantine's `gray`.
 *
 * It overrides rather than adds so Mantine's own semantic variables - dimmed text, default
 * borders, placeholders - resolve to brand neutrals instead of stock greys.
 *
 * Seven of the ten values are approved. Indices 3, 4 and 8 are DERIVED by even interpolation
 * between their neighbours, because the palette has no values there and inventing a brand
 * colour is not this layer's decision. They exist so Mantine's variants have somewhere to go;
 * treat them as structural, not as brand colours.
 */
export const gray: MantineColorsTuple = [
  APPROVED.white, //      0  #FFFFFF  approved
  APPROVED.light, //      1  #F4F5F6  approved
  APPROVED.lightGray, //  2  #DBDBDB  approved
  '#C1C1C1', //           3           DERIVED
  '#A8A8A8', //           4           DERIVED
  ADDED.grayBorder, //    5  #8E8E8E  approved in handover
  APPROVED.gray, //       6  #838383  approved
  ADDED.grayText, //      7  #6E6E6E  approved in handover
  '#494B4C', //           8           DERIVED
  APPROVED.black, //      9  #23272A  approved
];

/**
 * Brand blue, overriding Mantine's `blue`.
 *
 * The approved blue sits at index 9, not at the usual 6. It is a shade-9 colour by measurement:
 * relative luminance 0.0413, against 0.1225 for Mantine's own `blue-9` and 0.0198 for the brand
 * black. Placed at 6, the ramp would have to keep getting darker, and indices 7-9 would
 * collapse into the black - a filled button would differ from its own hover state by 1.10:1,
 * which is not a visible change.
 *
 * At index 9 Mantine special-cases the hover: `--mantine-color-{name}-filled-hover` resolves to
 * shade 8 rather than 10, so the hover LIGHTENS. Verified in @mantine/core 9.7.1,
 * `MantineCssVariables/get-css-color-variables.cjs`. The resulting delta is 1.28:1, wider than
 * the 1.14:1 of Mantine's own default blue.
 *
 * Indices 0-8 are DERIVED - the approved blue mixed toward white. Only lightness varies; no
 * decision about hue or saturation was taken here.
 */
export const blue: MantineColorsTuple = [
  '#F4F5F7', //      0  DERIVED
  '#E6E7EB', //      1  DERIVED
  '#CCCFD6', //      2  DERIVED
  '#AFB4BF', //      3  DERIVED
  '#9198A7', //      4  DERIVED
  '#788093', //      5  DERIVED
  '#616B80', //      6  DERIVED
  '#4E5971', //      7  DERIVED
  '#3D4964', //      8  DERIVED - the hover state of the primary colour
  APPROVED.blue, //  9  #2C3956  approved - the primary colour
];

/**
 * Accents, one approved value each, repeated across all ten shades by `colorsTuple`.
 *
 * No shades are derived here on purpose: these are surface colours - tags, panels, graphic
 * fills - and deriving nine variations of each would invent far more brand colour than it
 * would buy. The cost is that an accent-coloured button has no distinct hover, because Mantine
 * reads hover from the next shade. If a design ever calls for one, the ramp for that accent is
 * a design decision, not a code one.
 *
 * `pink` carries no text at any size: 3.90:1 with the brand black, 3.86:1 with white. Both
 * fail the 4.5:1 body-text requirement, so it is a decorative colour only.
 */
export const orange = colorsTuple(APPROVED.orange);
export const sky = colorsTuple(APPROVED.sky);
export const pink = colorsTuple(APPROVED.pink);
export const lime = colorsTuple(APPROVED.lime);
