/**
 * Landscape 1200×630 Open Graph card for /share/[payload].
 *
 * Matches the live "Editorial Existential" design (warm ivory paper, deep ink,
 * terracotta accent, the abstract watercolor character) — i.e. it echoes the
 * result-page hero, NOT the old dark poster. Distinct from the portrait
 * 1080×1440 download poster at /api/poster/[payload].
 */
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { decodeSharePayload, type SharePayload } from '@/lib/share_payload';
import { PROFILE_TYPES } from '@/lib/air_quiz_data';
import { getEnv } from '@/lib/cloudflare';

const CACHE_CONTROL = 'public, max-age=3600, s-maxage=86400, immutable';
const r2Key = (p: string) => `og/${p}.png`;

// ── palette (light editorial theme) ──
const PAPER = '#f7f2e8';
const PAPER_CARD = '#fbf7ee';
const RULE = '#d8ccb4';
const INK = '#1f1814';
const INK_STRONG = '#110b08';
const INK_MUTE = '#5a4d40';
const INK_SOFT = '#8a7d6c';
const TERRACOTTA = '#c2492c';

function riskLabel(lv: SharePayload['riskLevel'], zh: boolean) {
  const m: Record<string, [string, string]> = {
    'very-low': ['VERY LOW', '极低'], 'low': ['LOW', '低'], 'medium': ['MEDIUM', '中等'],
    'high': ['HIGH', '高'], 'critical': ['CRITICAL', '极高'],
  };
  return (m[lv] || m.critical)[zh ? 1 : 0];
}

async function tryReadFromR2(payload: string): Promise<Response | null> {
  try {
    const env = getEnv();
    if (!env.AIR_POSTERS) return null;
    const obj = await env.AIR_POSTERS.get(r2Key(payload));
    if (!obj) return null;
    return new Response(obj.body, { headers: { 'content-type': 'image/png', 'cache-control': CACHE_CONTROL, 'x-cache': 'r2-hit' } });
  } catch {
    return null;
  }
}

async function writeToR2(payload: string, body: ArrayBuffer): Promise<void> {
  try {
    const env = getEnv();
    if (!env.AIR_POSTERS) return;
    await env.AIR_POSTERS.put(r2Key(payload), body, { httpMetadata: { contentType: 'image/png', cacheControl: CACHE_CONTROL } });
  } catch {
    /* noop */
  }
}

function bytesToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return btoa(bin);
}

// Load the current watercolor art as a data URI (reliable in Satori, vs a
// remote <img> fetch). PNG twin of the live /characters-art/<CODE>.webp.
async function artDataUri(code: string, origin: string): Promise<string | null> {
  const known = /^[ETOSFRHP]{4}$/.test(code);
  if (!known) return null;
  try {
    const env = getEnv();
    const path = `/characters-art/${code}.png`;
    let res: Response | null = null;
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      res = await env.ASSETS.fetch(new Request(`${origin}${path}`));
    }
    if (!res || !res.ok) res = await fetch(`${origin}${path}`);
    if (!res.ok) return null;
    return `data:image/png;base64,${bytesToBase64(await res.arrayBuffer())}`;
  } catch {
    return null;
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ payload: string }> },
) {
  const { payload } = await params;

  const cached = await tryReadFromR2(payload);
  if (cached) return cached;

  const data = decodeSharePayload(payload);

  let origin = 'https://air.democra.ai';
  try {
    const o = getEnv().AIR_PUBLIC_ORIGIN;
    if (o) origin = o;
  } catch { /* noop */ }

  if (!data) {
    return new ImageResponse(
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, background: PAPER, color: INK_STRONG }}>
        <span style={{ fontSize: 100, fontWeight: 900, letterSpacing: 16 }}>AIR</span>
        <span style={{ fontSize: 24, color: INK_MUTE, letterSpacing: 4 }}>AI-RESISTANCE CAREER TEST</span>
      </div>,
      { width: 1200, height: 630 },
    );
  }

  const zh = data.lang === 'zh';
  const code = (data.v === 2 && 'profileCode' in data && data.profileCode) || null;
  const profile = code ? PROFILE_TYPES[code] : null;
  const accent = profile?.color || TERRACOTTA;
  const name = profile ? (zh ? profile.archetype.zh : profile.archetype.en) : 'AIR';
  const tagline = profile ? (zh ? profile.tagline.zh : profile.tagline.en) : '';
  const lb = riskLabel(data.riskLevel, zh);
  const prob = data.replacementProbability;
  const yr = data.predictedReplacementYear >= 2100 ? '∞' : String(data.predictedReplacementYear);
  const art = code ? await artDataUri(code, origin) : null;

  const img = new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: PAPER, color: INK, fontFamily: 'sans-serif', position: 'relative', padding: '52px 60px' }}>
      {/* top hairline accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, display: 'flex', background: `linear-gradient(90deg, ${TERRACOTTA} 0%, ${accent} 55%, transparent 95%)` }} />

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 34, fontWeight: 900, letterSpacing: 7, color: INK_STRONG }}>AIR</span>
        <div style={{ width: 1, height: 26, background: RULE, display: 'flex' }} />
        <span style={{ fontSize: 16, letterSpacing: 4, color: INK_SOFT, textTransform: 'uppercase' }}>
          {zh ? 'AI 抗性职业人格测试' : 'AI-Resistance Career Test'}
        </span>
      </div>

      {/* body: identity (left) + watercolor (right) */}
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between', gap: 44, marginTop: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: 3, color: accent, textTransform: 'uppercase' }}>
            {zh ? `${lb}替代风险` : `${lb} RISK`}
          </span>
          <span style={{ fontSize: 84, fontWeight: 800, color: INK_STRONG, lineHeight: 1.04, marginTop: 10 }}>{name}</span>
          {code && <span style={{ fontSize: 24, fontWeight: 700, color: INK_SOFT, letterSpacing: 12, marginTop: 8 }}>{code}</span>}
          {tagline && (
            <span style={{ fontSize: 26, fontStyle: 'italic', color: INK_MUTE, lineHeight: 1.4, marginTop: 22, maxWidth: 560 }}>
              “{tagline}”
            </span>
          )}

          {/* stats */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 48, marginTop: 34 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2, color: INK_SOFT, textTransform: 'uppercase' }}>{zh ? '替代概率' : 'Replacement'}</span>
              <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 2 }}>
                <span style={{ fontSize: 96, fontWeight: 900, lineHeight: 0.9, color: accent }}>{prob}</span>
                <span style={{ fontSize: 40, fontWeight: 800, color: accent, opacity: 0.55 }}>%</span>
              </div>
            </div>
            <div style={{ width: 1, height: 86, background: RULE, display: 'flex' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2, color: INK_SOFT, textTransform: 'uppercase' }}>{zh ? '预测年份' : 'Predicted'}</span>
              <span style={{ fontSize: 76, fontWeight: 800, lineHeight: 1, color: INK_STRONG, marginTop: 6 }}>{yr}</span>
            </div>
          </div>
        </div>

        {/* watercolor character with soft glow */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: 392, height: 392, flex: 'none' }}>
          <div style={{ position: 'absolute', inset: '-6%', borderRadius: '50%', display: 'flex', background: `radial-gradient(circle at 50% 45%, ${accent}3d 0%, transparent 66%)` }} />
          {art ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={art} alt="" width={372} height={372} style={{ width: 372, height: 372, borderRadius: 18, objectFit: 'cover', border: `1px solid ${RULE}`, position: 'relative' }} />
          ) : (
            <div style={{ width: 372, height: 372, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: PAPER_CARD, border: `1px solid ${RULE}`, fontSize: 120, fontWeight: 900, color: accent }}>{code}</div>
          )}
        </div>
      </div>

      {/* footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: 19, fontWeight: 700, color: INK_SOFT, letterSpacing: 1 }}>air.democra.ai</span>
        <span style={{ fontSize: 20, fontWeight: 800, color: TERRACOTTA }}>
          {zh ? '测测你的 AI 替代风险 →' : "What's your AI risk? →"}
        </span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );

  try {
    const buf = await img.arrayBuffer();
    await writeToR2(payload, buf);
    return new Response(buf, {
      headers: { 'content-type': 'image/png', 'cache-control': CACHE_CONTROL, 'x-cache': 'r2-miss' },
    });
  } catch {
    return img;
  }
}
