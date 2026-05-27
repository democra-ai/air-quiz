import { defineCloudflareConfig } from '@opennextjs/cloudflare';

/**
 * OpenNext — Cloudflare adapter config.
 *
 * Incremental cache is left at the default (no-op). AIR is largely SSR'd
 * on demand; there is no heavy ISR/`revalidate` use. Enable a KV-backed
 * incremental cache later by importing `kv-incremental-cache` and adding
 * a `[[kv_namespaces]]` block bound as `NEXT_INC_CACHE_KV` in wrangler.toml.
 */
export default defineCloudflareConfig({});
