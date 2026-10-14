import type { CSSVariablesResolver } from '@mantine/core';

/**
 * Accessibility corrections to Mantine's semantic CSS variables.
 *
 * These are not brand decisions. They are a WCAG 2.1 AA floor: Mantine points several semantic
 * variables at shades that do not clear their threshold once the brand neutrals are in place.
 * The palette itself is correct; the defaults that consume it are not.
 *
 * Each pair is measured against BOTH light surfaces, because a component does not know which
 * one it will be rendered on - plain white, or the `light` panel `#F4F5F6` which is `gray-1`:
 *
 *   variable                      Mantine default          corrected to
 *   --------------------------------------------------------------------------------------
 *   --mantine-color-dimmed        gray-6  #838383          gray-7  #6E6E6E
 *                                 3.79:1 / 3.47:1  FAIL    5.10:1 / 4.67:1  (needs 4.5:1)
 *   --mantine-color-placeholder   gray-5  #8E8E8E          gray-7  #6E6E6E
 *                                 3.28:1 / 3.00:1  FAIL    5.10:1 / 4.67:1  (needs 4.5:1)
 *   --mantine-color-default-border gray-4 #A8A8A8          gray-5  #8E8E8E
 *                                 2.41:1 / 2.21:1  FAIL    3.28:1 / 3.00:1  (WCAG 1.4.11, 3:1)
 *
 * This file predates the palette: it existed because Mantine's stock dimmed grey `#868e96`
 * failed at 3.32:1 and Lighthouse caught it on the very first page in the repository. The
 * approved brand grey `#838383` is within half a point of that value and fails the same way,
 * which is why the correction survives the handover rather than being deleted by it.
 *
 * The replacements point at palette entries rather than literal hex values, so a later change
 * to the ramp carries through. Re-measure when that happens.
 */
export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    '--mantine-color-dimmed': 'var(--mantine-color-gray-7)',
    /**
     * A placeholder is text and is held to the body-text ratio. The side effect is that it no
     * longer reads as much lighter than an entered value; distinguishing the two is a styling
     * job for the form components in FE-07, not a reason to ship failing contrast.
     */
    '--mantine-color-placeholder': 'var(--mantine-color-gray-7)',
    /**
     * The border of an input, checkbox or select is a user interface component under WCAG
     * 1.4.11 and needs 3:1. A decorative rule - `Divider`, a table line - has no such
     * requirement and may still use the lighter `gray-2` #DBDBDB directly.
     */
    '--mantine-color-default-border': 'var(--mantine-color-gray-5)',
  },
  /**
   * Unreachable while the colour scheme is forced to light in `Providers.tsx`, and kept
   * deliberately. No dark palette has been approved; when WS-C delivers one these entries are
   * where the same three corrections get re-measured, instead of the failure being rediscovered
   * from scratch. The values below are the pre-palette Mantine fix and are not brand colours.
   */
  dark: {
    '--mantine-color-dimmed': 'var(--mantine-color-dark-1)',
  },
});
