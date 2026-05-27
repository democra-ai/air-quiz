/**
 * Cloudflare bindings accessor + helpers (server-only).
 *
 * Replaces the Firebase client SDK:
 *   - Firestore `quiz_sessions` / `answer_distributions` → D1 (`AIR_DB`)
 *   - Firebase Analytics `logEvent`                      → Analytics Engine (`AIR_ANALYTICS`)
 *   - Firebase anonymous auth                            → Turnstile (server-verified)
 *   - Rate limiting                                      → KV (`AIR_KV`)
 */

import { getCloudflareContext } from '@opennextjs/cloudflare';

export function getEnv(): CloudflareEnv {
  return getCloudflareContext().env as unknown as CloudflareEnv;
}

// ─── Turnstile verification ────────────────────────────────────────────────
// Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

export async function verifyTurnstile(
  token: string | null | undefined,
  remoteIp?: string | null,
): Promise<{ ok: boolean; reason?: string }> {
  const env = getEnv();
  // Soft-fail if Turnstile isn't configured yet — lets the app run pre-setup.
  if (!env.TURNSTILE_SECRET_KEY) return { ok: true, reason: 'turnstile_disabled' };
  if (!token) return { ok: false, reason: 'missing_token' };

  const body = new URLSearchParams();
  body.append('secret', env.TURNSTILE_SECRET_KEY);
  body.append('response', token);
  if (remoteIp) body.append('remoteip', remoteIp);

  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const j = (await r.json()) as { success: boolean; 'error-codes'?: string[] };
    if (j.success) return { ok: true };
    return { ok: false, reason: (j['error-codes'] ?? ['unknown']).join(',') };
  } catch (e) {
    return { ok: false, reason: 'verify_failed' };
  }
}

// ─── KV-based rate limiter ─────────────────────────────────────────────────
// Cheap, eventually-consistent. For low-write endpoints (quiz submission).

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<{ ok: boolean; count: number }> {
  const env = getEnv();
  const bucket = Math.floor(Date.now() / 1000 / windowSeconds);
  const kvKey = `rl:${key}:${bucket}`;
  const current = parseInt((await env.AIR_KV.get(kvKey)) ?? '0', 10);
  if (current >= limit) return { ok: false, count: current };
  await env.AIR_KV.put(kvKey, String(current + 1), {
    expirationTtl: windowSeconds * 2,
  });
  return { ok: true, count: current + 1 };
}

// ─── Client IP extraction ──────────────────────────────────────────────────

export function getClientIp(req: Request): string {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

// ─── Analytics Engine event logger ─────────────────────────────────────────
// Replaces `logEvent(firebase_analytics, ...)`. Writes structured events for
// later querying via SQL API. See: https://developers.cloudflare.com/analytics/analytics-engine/

export function logAnalyticsEvent(
  eventName: string,
  params: Record<string, unknown> = {},
): void {
  try {
    const env = getEnv();
    if (!env.AIR_ANALYTICS) return;
    // Split params into blobs (strings) and doubles (numbers).
    const blobs: string[] = [eventName];
    const doubles: number[] = [];
    for (const [k, v] of Object.entries(params)) {
      if (typeof v === 'number' && Number.isFinite(v)) {
        doubles.push(v);
        blobs.push(k);
      } else if (v != null) {
        blobs.push(`${k}=${String(v).slice(0, 64)}`);
      }
    }
    env.AIR_ANALYTICS.writeDataPoint({
      blobs: blobs.slice(0, 20),
      doubles: doubles.slice(0, 20),
      indexes: [eventName],
    });
  } catch {
    // never throw from telemetry
  }
}
