import { describe, expect, it } from 'vitest';

import { cssVariablesResolver } from './cssVariables';

import { theme } from './theme';

/**
 * Mantine points three semantic variables at shades that fail WCAG 2.1 AA once the brand
 * neutrals are in place: dimmed text and placeholders at 3.79:1 and 3.28:1 against a 4.5:1
 * requirement, and the default border at 2.41:1 against 3:1.
 *
 * These tests exist so the corrections cannot be reverted by accident. They assert the
 * MAPPING, not the ratio - a unit test cannot resolve a CSS variable chain. The ratios behind
 * each mapping are proven on the literal palette values in `colors.test.ts`, and measured
 * end to end by the Lighthouse step, which asserts an accessibility score of 1.
 */
describe('accessibility corrections to Mantine CSS variables', () => {
  const resolved = cssVariablesResolver(theme as never);

  it('replaces dimmed text with a shade that passes on both light surfaces', () => {
    // gray-6 #838383 is 3.79:1 on white and 3.47:1 on the light panel. gray-7 #6E6E6E is
    // 5.10:1 and 4.67:1.
    expect(resolved.light['--mantine-color-dimmed']).toBe('var(--mantine-color-gray-7)');
  });

  it('replaces placeholder text with the same shade', () => {
    // gray-5 #8E8E8E is 3.28:1 on white. A placeholder is text and is held to 4.5:1.
    expect(resolved.light['--mantine-color-placeholder']).toBe('var(--mantine-color-gray-7)');
  });

  it('replaces the default border with a shade that satisfies WCAG 1.4.11', () => {
    // gray-4 #A8A8A8 is 2.41:1 on white. gray-5 #8E8E8E is 3.28:1, against a 3:1 requirement
    // for the border of an input, checkbox or select.
    expect(resolved.light['--mantine-color-default-border']).toBe('var(--mantine-color-gray-5)');
  });

  it('points at palette entries rather than literal colours', () => {
    // So every correction follows the ramp if the ramp changes, instead of pinning a grey that
    // no longer belongs to the brand. Re-measure at that point.
    for (const scheme of [resolved.light, resolved.dark]) {
      for (const value of Object.values(scheme)) {
        expect(String(value)).toMatch(/^var\(--mantine-/);
      }
    }
  });

  it('keeps a dark entry although the scheme is forced to light', () => {
    // `Providers.tsx` forces light, so this branch never renders. It is kept so that the day a
    // dark palette is approved, the correction is re-measured here rather than rediscovered.
    expect(resolved.dark['--mantine-color-dimmed']).toBeDefined();
  });
});
