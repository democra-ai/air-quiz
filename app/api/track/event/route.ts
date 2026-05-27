/**
 * POST /api/track/event
 *
 * Generic event sink → Cloudflare Analytics Engine.
 * Replaces the Firebase Analytics `logEvent` calls.
 *
 * Input: { name: string, params?: Record<string, string|number|boolean|null> }
 */

import { NextRequest } from 'next/server';
import { getClientIp, rateLimit, logAnalyticsEvent } from '@/lib/cloudflare';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = await rateLimit(`ev:${ip}`, 120, 60);
  if (!rl.ok) {
    return Response.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let body: { name?: string; params?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  if (!body.name || typeof body.name !== 'string') {
    return Response.json({ ok: false, error: 'missing_name' }, { status: 400 });
  }

  logAnalyticsEvent(body.name.slice(0, 64), body.params ?? {});
  return Response.json({ ok: true });
}
