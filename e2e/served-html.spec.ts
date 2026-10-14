import { expect, test } from '@playwright/test';

/**
 * Served-HTML contract.
 *
 * WS-D requires verification "in served HTML, not in the rendered DOM", because the previous
 * site shipped evidence counters that were JavaScript-only and reached crawlers and AI answer
 * engines as zero. These checks read the raw response body and never open a browser, so a
 * regression that only renders client-side fails here.
 *
 * They also pin the CLUSTER RULE and the no-geo-redirect rule from docs/spec/locales.md.
 */

test.describe('locale routing', () => {
  test('the default locale is served unprefixed', async ({ request }) => {
    const response = await request.get('/');

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('<html lang="en"');
  });

  test('the prefixed default locale redirects to the unprefixed URL', async ({ request }) => {
    const response = await request.get('/en', { maxRedirects: 0 });

    expect(response.status()).toBe(308);
    expect(new URL(response.headers()['location'], 'http://localhost').pathname).toBe('/');
  });

  test('a prefixed locale is served with its own lang attribute', async ({ request }) => {
    const response = await request.get('/de');

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('<html lang="de"');
  });

  test('a locale registered as a shell is not routed', async ({ request }) => {
    expect((await request.get('/sa-en')).status()).toBe(404);
  });

  test('no locale is chosen for the visitor from Accept-Language', async ({ request }) => {
    const response = await request.get('/', {
      headers: { 'Accept-Language': 'de-DE,de;q=0.9' },
      maxRedirects: 0,
    });

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('<html lang="en"');
  });
});

test.describe('hreflang cluster', () => {
  const EXPECTED_HREFLANGS = ['x-default', 'en', 'de-DE', 'de-CH', 'en-US'];

  for (const path of ['/', '/de', '/us']) {
    test(`${path} serves the complete cluster`, async ({ request }) => {
      const html = await (await request.get(path)).text();

      for (const hreflang of EXPECTED_HREFLANGS) {
        // The attribute is case-insensitive in HTML; React serialises it as hrefLang.
        expect(html.toLowerCase()).toContain(`hreflang="${hreflang.toLowerCase()}"`);
      }
    });
  }

  test('every locale carries a self-referencing canonical', async ({ request }) => {
    const cases: Array<[string, string]> = [
      ['/', 'https://compremium.ch'],
      ['/de', 'https://compremium.ch/de'],
      ['/us', 'https://compremium.ch/us'],
    ];

    for (const [path, canonical] of cases) {
      const html = await (await request.get(path)).text();
      expect(html).toContain(`<link rel="canonical" href="${canonical}"/>`);
    }
  });
});

test.describe('skip to content', () => {
  /**
   * `/sa-en` is deliberately absent. It is registered as a shell locale, is not routed, and
   * must keep returning 404 - asserted in the `locale routing` block above.
   */
  const ROUTED_PATHS = ['/', '/de', '/us'];

  /**
   * The fragment is locale-invariant by design: the label is translated per market, the target
   * is not. Both halves come from `MAIN_CONTENT_ID` in `src/shared/ui/skip-to-content/ids.ts`.
   */
  const FRAGMENT = 'main-content';

  for (const path of ROUTED_PATHS) {
    test(`${path} serves exactly one <main> landmark, and it carries the fragment id`, async ({
      request,
    }) => {
      const html = await (await request.get(path)).text();

      // Counted, not `toContain`. A second `<main>` is an accessibility defect that a
      // containment check cannot see, and the skip link's target becomes ambiguous.
      expect(html.match(/<main[\s>]/g) ?? []).toHaveLength(1);
      expect(html).toMatch(/<main[^>]*\sid="main-content"/);
    });

    test(`${path} serves the skip link before the landmark`, async ({ request }) => {
      const html = await (await request.get(path)).text();

      const linkOffset = html.indexOf(`href="#${FRAGMENT}"`);
      const mainOffset = html.search(/<main[\s>]/);

      expect(linkOffset).toBeGreaterThan(-1);
      expect(mainOffset).toBeGreaterThan(-1);

      // WCAG 2.1 AA 2.4.1 Bypass Blocks: the link has to precede the content it skips, in
      // document order. Byte offsets are what prove that in the served response.
      expect(linkOffset).toBeLessThan(mainOffset);
    });
  }

  /**
   * The label is an interface string from `common.json`, resolved on the server. Asserting
   * only the English text would pass for an implementation that hard-codes it, so the German
   * string is checked explicitly.
   */
  const EXPECTED_LABELS: Array<[string, string]> = [
    ['/', 'Skip to content'],
    ['/us', 'Skip to content'],
    ['/de', 'Zum Inhalt springen'],
  ];

  for (const [path, label] of EXPECTED_LABELS) {
    test(`${path} serves the locale-correct skip link label`, async ({ request }) => {
      const html = await (await request.get(path)).text();

      expect(html).toContain(`>${label}</a>`);
    });
  }
});
