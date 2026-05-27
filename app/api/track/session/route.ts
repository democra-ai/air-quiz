/**
 * POST /api/track/session
 *
 * Writes a full quiz session record to D1 (`quiz_sessions`).
 * Replaces the Firestore `setDoc(collection(db, 'quiz_sessions'), ...)` call
 * that previously lived in `lib/analytics.ts#trackQuizComplete`.
 *
 * Pipeline:
 *   1. Rate-limit by client IP (KV)
 *   2. Verify Turnstile token if configured
 *   3. Persist to D1
 *   4. Fire-and-forget Analytics Engine event
 */

import { NextRequest } from 'next/server';
import {
  getEnv,
  getClientIp,
  rateLimit,
  verifyTurnstile,
  logAnalyticsEvent,
} from '@/lib/cloudflare';

interface SessionPayload {
  sessionId: string;
  uid: string | null;
  language: string;
  preset: string | null;
  profileCode: string;
  profileName: string;
  riskTier: string;
  probability: number;
  predictedYear: number | null;
  aiCapability: number | null;
  confidenceEarliest: number | null;
  confidenceLatest: number | null;
  answersJson: string;
  dimensionsJson: string;
  shareUrl: string;
  durationSeconds: number;
  userAgent: string;
  screenSize: string;
  referrer: string;
  turnstileToken?: string;
}

function sanitizeYear(n: unknown): number | null {
  if (typeof n !== 'number' || !Number.isFinite(n)) return null;
  if (n < 1900 || n > 3000) return null;
  return Math.round(n);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  const rl = await rateLimit(`session:${ip}`, 10, 60);
  if (!rl.ok) {
    return Response.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let body: SessionPayload;
  try {
    body = (await req.json()) as SessionPayload;
  } catch {
    return Response.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  if (!body.sessionId || !body.profileCode || !body.riskTier) {
    return Response.json({ ok: false, error: 'missing_fields' }, { status: 400 });
  }

  const ts = await verifyTurnstile(body.turnstileToken, ip);
  if (!ts.ok) {
    return Response.json(
      { ok: false, error: 'turnstile_failed', reason: ts.reason },
      { status: 403 },
    );
  }

  const env = getEnv();
  try {
    await env.AIR_DB.prepare(
      `INSERT OR REPLACE INTO quiz_sessions
        (session_id, uid, created_at, language, preset,
         profile_code, profile_name, risk_tier, probability,
         predicted_year, ai_capability, confidence_earliest, confidence_latest,
         answers_json, dimensions_json, share_url, duration_seconds,
         user_agent, screen_size, referrer)
       VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17,?18,?19,?20)`,
    )
      .bind(
        body.sessionId,
        body.uid,
        Date.now(),
        body.language,
        body.preset,
        body.profileCode,
        body.profileName,
        body.riskTier,
        body.probability,
        sanitizeYear(body.predictedYear),
        body.aiCapability,
        sanitizeYear(body.confidenceEarliest),
        sanitizeYear(body.confidenceLatest),
        body.answersJson,
        body.dimensionsJson,
        body.shareUrl,
        body.durationSeconds,
        (body.userAgent ?? '').slice(0, 512),
        body.screenSize,
        (body.referrer ?? '').slice(0, 512),
      )
      .run();
  } catch (e) {
    console.error('[track/session] D1 write failed', e);
    return Response.json({ ok: false, error: 'db_write_failed' }, { status: 500 });
  }

  logAnalyticsEvent('quiz_complete', {
    profile_code: body.profileCode,
    risk_tier: body.riskTier,
    probability: body.probability,
    language: body.language,
    duration_seconds: body.durationSeconds,
  });

  return Response.json({ ok: true });
}
