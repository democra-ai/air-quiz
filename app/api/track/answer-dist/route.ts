/**
 * POST /api/track/answer-dist
 *
 * Writes per-session answer distribution to D1 (`answer_distributions`)
 * and increments rolled-up counters in `answer_aggregate`.
 *
 * Replaces Firestore `answer_distributions` collection writes.
 */

import { NextRequest } from 'next/server';
import {
  getEnv,
  getClientIp,
  rateLimit,
  logAnalyticsEvent,
} from '@/lib/cloudflare';

interface DistPayload {
  sessionId: string;
  language: string;
  profileCode: string;
  answers: Record<string, number>; // { Q1: 3, Q2: 5, ... }
  device: string;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  const rl = await rateLimit(`ad:${ip}`, 20, 60);
  if (!rl.ok) {
    return Response.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let body: DistPayload;
  try {
    body = (await req.json()) as DistPayload;
  } catch {
    return Response.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  if (!body.sessionId || !body.answers || typeof body.answers !== 'object') {
    return Response.json({ ok: false, error: 'missing_fields' }, { status: 400 });
  }

  const env = getEnv();

  // Main record + rolled-up counters in one batch (atomic on D1).
  const stmts = [
    env.AIR_DB.prepare(
      `INSERT OR REPLACE INTO answer_distributions
        (session_id, created_at, language, profile_code, answers_json, device)
       VALUES (?1,?2,?3,?4,?5,?6)`,
    ).bind(
      body.sessionId,
      Date.now(),
      body.language,
      body.profileCode,
      JSON.stringify(body.answers),
      body.device ?? 'unknown',
    ),
  ];

  for (const [qid, val] of Object.entries(body.answers)) {
    if (typeof val !== 'number' || !Number.isFinite(val)) continue;
    stmts.push(
      env.AIR_DB.prepare(
        `INSERT INTO answer_aggregate (question_id, answer_value, language, count)
         VALUES (?1, ?2, ?3, 1)
         ON CONFLICT(question_id, answer_value, language)
         DO UPDATE SET count = count + 1`,
      ).bind(qid.slice(0, 64), Math.round(val), body.language),
    );
  }

  try {
    await env.AIR_DB.batch(stmts);
  } catch (e) {
    console.error('[track/answer-dist] D1 batch failed', e);
    return Response.json({ ok: false, error: 'db_write_failed' }, { status: 500 });
  }

  logAnalyticsEvent('answer_dist', {
    profile_code: body.profileCode,
    language: body.language,
    num_answers: Object.keys(body.answers).length,
  });

  return Response.json({ ok: true });
}
