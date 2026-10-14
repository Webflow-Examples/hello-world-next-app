import { defineCloudflareConfig } from '@opennextjs/cloudflare';

/**
 * OpenNext Cloudflare adapter configuration.
 *
 * Webflow Cloud deploys Next.js through this adapter and generates a basic default config when
 * the repository does not carry one. We carry one anyway, for a single reason: without it
 * `opennextjs-cloudflare build` refuses to run locally, so nobody could reproduce the
 * deployment target on their machine or in CI. A build that only the platform can perform is a
 * build nobody can debug.
 *
 * It must stay equivalent to that default. Webflow Cloud owns the platform settings - adapter
 * selection, base path, asset prefix, image handling, Node compatibility, observability - and
 * overwrites them at build time. Anything added here that touches those is at best ignored and
 * at worst a divergence between what we verify and what gets served.
 *
 * Caching is deliberately left at the adapter default (no incremental cache). Webflow Cloud
 * replaces every response `Cache-Control` with `private, no-cache` and strips `cache-tag`, so
 * an incremental cache would add moving parts without being able to serve a cached response.
 * See docs/webflow-cloud-integration-plan.md, C1.
 */
export default defineCloudflareConfig();
