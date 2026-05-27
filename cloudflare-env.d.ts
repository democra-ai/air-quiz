/**
 * Cloudflare binding types surfaced by `@opennextjs/cloudflare`
 * (accessed via `getCloudflareContext()` inside Next.js API routes / RSC).
 *
 * Keep in sync with wrangler.toml.
 */

interface CloudflareEnv {
  // D1
  AIR_DB: D1Database;
  // KV
  AIR_KV: KVNamespace;
  // R2
  AIR_POSTERS: R2Bucket;
  // Analytics Engine
  AIR_ANALYTICS: AnalyticsEngineDataset;
  // Vars
  AIR_PUBLIC_ORIGIN: string;
  // Secrets
  TURNSTILE_SECRET_KEY?: string;
  NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string;
}
