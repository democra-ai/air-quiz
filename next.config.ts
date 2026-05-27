import type { NextConfig } from 'next';
// OpenNext dev-time integration: makes Cloudflare bindings available locally
// via `getCloudflareContext()` when running `next dev`.
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

const nextConfig: NextConfig = {
  devIndicators: false,
  // `standalone` is replaced by the OpenNext Cloudflare adapter which compiles
  // the server into a single Worker. Leave Next's default output.
  images: {
    // Cloudflare Workers runtime has no native image optimizer — either use
    // Cloudflare Images or keep this disabled. All current usage is static.
    unoptimized: true,
  },
  experimental: {
    // Keep OG-image edge runtime happy on Workers.
    serverActions: { bodySizeLimit: '2mb' },
  },
};

// Activates only in `next dev` — no-op at build / runtime.
// Guard: miniflare can pick up unrelated wrangler.toml files in parent dirs.
if (process.env.NODE_ENV !== 'production' && !process.env.OPEN_NEXT_CLOUDFLARE_BUILD) {
  initOpenNextCloudflareForDev();
}

export default nextConfig;
