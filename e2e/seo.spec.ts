import { expect, test, type APIRequestContext } from '@playwright/test';

import { BUILT_ROUTES } from '../src/shared/config/built-routes';
import { SITE_ORIGIN } from '../src/shared/config/site';
import { activeRedirects, heldRedirects } from '../src/shared/seo/redirects';

/**
 * SEO artefacts, read from the served response.
 *
 * These cover the parts of WS-D that are invisible in the UI and only surface weeks later in
 * search results: the redirect map, the sitemap exclusion list, and robots.txt.
 *
 * Every assertion here is about RESOLUTION, not shape. What they replace was a sitemap check
 * that accepted 35 well-formed absolute URLs of which 34 answered 404, and a redirect check
 * that accepted a 404 landing because it only asserted the status was not 301 and not 308.
 */

const PARTITIONS = ['en', 'de', 'us'];

async function sitemapLocations(request: APIRequestContext, locale: string): Promise<string[]> {
  const response = await request.get(`/sitemap/${locale}.xml`);
  if (response.status() === 404) return [];
  expect(response.status()).toBe(200);

  const body = await response.text();
  return [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

test.describe('built routes', () => {
  for (const route of BUILT_ROUTES) {
    test(`${route.url} is served`, async ({ request }) => {
      expect((await request.get(route.url)).status()).toBe(200);
    });

    test(`${route.url} serves the robots directive it declares`, async ({ request }) => {
      const html = await (await request.get(route.url)).text();
      const directive = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? '';

      // The route segment and the sitemap read the same BUILT_ROUTES entry, so this is also
      // the assertion that the two cannot contradict each other.
      if (route.indexable) {
        expect(directive).not.toContain('noindex');
      } else {
        expect(directive).toContain('noindex');
      }
    });
  }
});

test.describe('legacy redirects', () => {
  for (const entry of activeRedirects()) {
    test(`${entry.source} is 301 to ${entry.destination}, which is served`, async ({ request }) => {
      const response = await request.get(entry.source, { maxRedirects: 0 });

      // WS-D specifies the migration as "301 / 410", not the framework default of 308.
      expect(response.status()).toBe(301);
      const target = new URL(response.headers()['location'], 'http://localhost').pathname;
      expect(target).toBe(entry.destination);

      // One hop, and the hop lands. A 404 here is a lost legacy URL, not a passing redirect.
      expect((await request.get(target, { maxRedirects: 0 })).status()).toBe(200);
    });
  }

  for (const entry of heldRedirects()) {
    test(`${entry.source} is withheld while ${entry.destination} is not built`, async ({
      request,
    }) => {
      const response = await request.get(entry.source, { maxRedirects: 0 });

      // Withheld rather than pointed at a 404. It activates by itself once the target enters
      // BUILT_ROUTES; until then `next build` names it. See next.config.ts.
      expect(response.status()).not.toBe(301);
      expect(response.status()).not.toBe(308);
    });
  }
});

test.describe('robots.txt', () => {
  test('advertises only partitions that are served', async ({ request }) => {
    const body = await (await request.get('/robots.txt')).text();
    const advertised = [...body.matchAll(/^Sitemap:\s*(\S+)$/gm)].map((match) => match[1]);

    for (const url of advertised) {
      const response = await request.get(new URL(url).pathname);
      expect(response.status(), `${url} is advertised in robots.txt`).toBe(200);
    }
  });

  test('advertises no partition for a locale whose gate has not cleared', async ({ request }) => {
    const body = await (await request.get('/robots.txt')).text();

    // /de waits on German-language claims review, /us on the signed-off substitution list.
    expect(body).not.toContain('/sitemap/de.xml');
    expect(body).not.toContain('/sitemap/us.xml');
  });
});

test.describe('sitemap', () => {
  test('every advertised URL resolves, and permits indexing', async ({ request }) => {
    // The assertion the suite was missing. A sitemap entry is an instruction to a crawler:
    // index this. A 404 behind it wastes crawl budget and reports as a sitemap error; a
    // noindex behind it is the sitemap and the page contradicting each other.
    let checked = 0;

    for (const locale of PARTITIONS) {
      for (const location of await sitemapLocations(request, locale)) {
        expect(location.startsWith(SITE_ORIGIN)).toBe(true);

        const path = new URL(location).pathname;
        const response = await request.get(path);
        expect(response.status(), `${location} is in the sitemap`).toBe(200);

        expect(
          await response.text(),
          `${location} is in the sitemap but serves noindex`,
        ).not.toMatch(/<meta name="robots" content="[^"]*noindex/);
        checked += 1;
      }
    }

    // Reported, not asserted non-zero: the correct count today is 0, because the one built
    // route is held pending metadata claims QA. The `built routes` block above is what keeps
    // this from being vacuous - it checks every route's served state independently.
    console.log(`sitemap URLs verified: ${checked}`);
  });

  test('excludes every reserved node', async ({ request }) => {
    // "RESERVED nodes are held in the tree and are not built, not indexed and not linked."
    for (const locale of PARTITIONS) {
      const locations = (await sitemapLocations(request, locale)).join('\n');

      for (const reserved of [
        'ai-and-analytics',
        'sports-medicine',
        'military-field-care',
        'health-economics',
        '/for/surgeons',
      ]) {
        expect(locations).not.toContain(reserved);
      }
    }
  });

  test('excludes pages whose indexation is held', async ({ request }) => {
    for (const locale of PARTITIONS) {
      const locations = (await sitemapLocations(request, locale)).join('\n');

      expect(locations).not.toContain('/evidence/white-papers');
      expect(locations).not.toContain('/evidence/case-reports');
    }
  });

  test('is not produced for a locale that cannot publish', async ({ request }) => {
    expect((await request.get('/sitemap/de.xml')).status()).toBe(404);
    expect((await request.get('/sitemap/us.xml')).status()).toBe(404);
  });
});

test.describe('analytics', () => {
  test('loads no third-party script while no container id is configured', async ({ request }) => {
    const html = await (await request.get('/')).text();

    expect(html).not.toContain('googletagmanager.com');
    expect(html).not.toContain("gtag('consent'");
  });
});
