import { describe, expect, it } from 'vitest';

import { ADDED, APPROVED, blue, gray, lime, orange, pink, sky } from './colors';

import { theme } from './theme';

/**
 * Contrast assertions against the literal palette values.
 *
 * Unlike `cssVariables.test.ts`, which can only assert a mapping, these ratios are computable:
 * every colour here is a hex string, so the WCAG 2.1 relative-luminance formula applies
 * directly. This is the one place in the project where "contrast-verified" is proven rather
 * than claimed, and it is why the thresholds appear as numbers rather than as comments.
 *
 * Formula: WCAG 2.1 SC 1.4.3. The same one @mantine/core uses for `autoContrast`.
 */
const luminance = (hex: string) =>
  [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((sum, c, i) => sum + [0.2126, 0.7152, 0.0722][i] * c, 0);

const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

const BODY_TEXT = 4.5; // WCAG 2.1 SC 1.4.3
const NON_TEXT = 3; // WCAG 2.1 SC 1.4.11

/** The two surfaces a component can land on. Both are approved palette values. */
const SURFACES = [APPROVED.white, APPROVED.light];

describe('palette structure', () => {
  it('gives Mantine ten shades per scale', () => {
    for (const scale of [gray, blue, orange, sky, pink, lime]) {
      expect(scale).toHaveLength(10);
    }
  });

  it('keeps the approved values at the indices the theme depends on', () => {
    // The theme sets primaryShade 9; move the brand blue and the primary colour moves with it.
    expect(blue[9]).toBe(APPROVED.blue);
    // cssVariables.ts points dimmed and placeholder at gray-7, and borders at gray-5.
    expect(gray[7]).toBe(ADDED.grayText);
    expect(gray[5]).toBe(ADDED.grayBorder);
    expect(gray[0]).toBe(APPROVED.white);
    expect(gray[1]).toBe(APPROVED.light);
    expect(gray[9]).toBe(APPROVED.black);
  });
});

describe('text contrast on both light surfaces', () => {
  it.each(SURFACES)('carries body text in the brand black on %s', (surface) => {
    expect(contrast(APPROVED.black, surface)).toBeGreaterThanOrEqual(BODY_TEXT);
  });

  it.each(SURFACES)('carries dimmed and placeholder text on %s', (surface) => {
    // The approved grey #838383 is 3.79:1 on white and fails here - that is why ADDED exists.
    expect(contrast(ADDED.grayText, surface)).toBeGreaterThanOrEqual(BODY_TEXT);
    expect(contrast(APPROVED.gray, surface)).toBeLessThan(BODY_TEXT);
  });

  it.each(SURFACES)('draws an input border on %s', (surface) => {
    expect(contrast(ADDED.grayBorder, surface)).toBeGreaterThanOrEqual(NON_TEXT);
    // gray-4, Mantine's default border shade, does not reach it. See cssVariables.ts.
    expect(contrast(gray[4], surface)).toBeLessThan(NON_TEXT);
  });
});

describe('the primary colour and its hover state', () => {
  it('reverses to white at rest and on hover', () => {
    // Mantine resolves filled-hover to shade 8 when primaryShade is 9, so both must pass.
    expect(contrast(APPROVED.white, blue[9])).toBeGreaterThanOrEqual(BODY_TEXT);
    expect(contrast(APPROVED.white, blue[8])).toBeGreaterThanOrEqual(BODY_TEXT);
  });

  it('changes visibly on hover', () => {
    // At shade 6 the next shade would be 1.10:1 away, which is not a perceivable change.
    expect(contrast(blue[9], blue[8])).toBeGreaterThan(1.2);
  });
});

describe('autoContrast picks a passing text colour for every accent', () => {
  /** Mirrors @mantine/core: a surface is "light", and takes black text, above the threshold. */
  const picked = (surface: string) =>
    luminance(surface) > (theme.luminanceThreshold as number) ? APPROVED.black : APPROVED.white;

  it.each([
    ['orange', APPROVED.orange],
    ['sky', APPROVED.sky],
    ['lime', APPROVED.lime],
    ['blue', APPROVED.blue],
  ])('clears the body-text ratio on %s', (_name, surface) => {
    expect(contrast(picked(surface), surface)).toBeGreaterThanOrEqual(BODY_TEXT);
  });

  it('fails on orange at Mantine default threshold of 0.3, which is why 0.22 is set', () => {
    expect(luminance(APPROVED.orange)).toBeLessThan(0.3);
    expect(luminance(APPROVED.orange)).toBeGreaterThan(theme.luminanceThreshold as number);
    expect(contrast(APPROVED.white, APPROVED.orange)).toBeLessThan(BODY_TEXT);
  });

  it('cannot carry text on pink in either direction', () => {
    // Asserted as a failure on purpose: pink is decorative, and this test is what stops someone
    // putting a label on it and assuming autoContrast handled it. See colors.ts.
    expect(contrast(APPROVED.black, APPROVED.pink)).toBeLessThan(BODY_TEXT);
    expect(contrast(APPROVED.white, APPROVED.pink)).toBeLessThan(BODY_TEXT);
  });
});

describe('theme wiring', () => {
  it('uses the brand blue as the primary colour at shade 9', () => {
    expect(theme.primaryColor).toBe('blue');
    expect(theme.primaryShade).toBe(9);
  });

  it('keeps autoContrast on with the measured threshold', () => {
    expect(theme.autoContrast).toBe(true);
    expect(theme.luminanceThreshold).toBe(0.22);
  });

  it('resolves autoContrast to the brand black and white', () => {
    expect(theme.black).toBe(APPROVED.black);
    expect(theme.white).toBe(APPROVED.white);
  });
});
