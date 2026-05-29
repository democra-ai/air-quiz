/**
 * Landscape 1200×630 Open Graph card for /share/[payload].
 *
 * The result page's <meta og:image> / <twitter:image> point here. We need a
 * LANDSCAPE card (summary_large_image is 1.91:1) — distinct from the portrait
 * 1080×1440 download poster at /api/poster/[payload]. Same brand language,
 * palette, archetype copy, and R2 caching (separate `og/` key prefix).
 */
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { decodeSharePayload, type SharePayload } from '@/lib/share_payload';
import { getEnv } from '@/lib/cloudflare';

const CACHE_CONTROL = 'public, max-age=3600, s-maxage=86400, immutable';
const r2Key = (p: string) => `og/${p}.png`;

async function tryReadFromR2(payload: string): Promise<Response | null> {
  try {
    const env = getEnv();
    if (!env.AIR_POSTERS) return null;
    const obj = await env.AIR_POSTERS.get(r2Key(payload));
    if (!obj) return null;
    return new Response(obj.body, {
      headers: { 'content-type': 'image/png', 'cache-control': CACHE_CONTROL, 'x-cache': 'r2-hit' },
    });
  } catch {
    return null;
  }
}

async function writeToR2(payload: string, body: ArrayBuffer): Promise<void> {
  try {
    const env = getEnv();
    if (!env.AIR_POSTERS) return;
    await env.AIR_POSTERS.put(r2Key(payload), body, {
      httpMetadata: { contentType: 'image/png', cacheControl: CACHE_CONTROL },
    });
  } catch {
    /* noop */
  }
}

function pal(lv: SharePayload['riskLevel']) {
  const p: Record<string, { m: string; a: string; g: string }> = {
    'very-low': { m: '#34d399', a: '#06b6d4', g: '#059669' },
    'low':      { m: '#4ade80', a: '#22d3ee', g: '#16a34a' },
    'medium':   { m: '#fbbf24', a: '#f97316', g: '#d97706' },
    'high':     { m: '#fb923c', a: '#f43f5e', g: '#ea580c' },
    'critical': { m: '#f43f5e', a: '#a855f7', g: '#dc2626' },
  };
  return p[lv] || p.critical;
}

function riskLabel(lv: SharePayload['riskLevel'], zh: boolean) {
  const m: Record<string, [string, string]> = {
    'very-low': ['VERY LOW', '极低'], 'low': ['LOW', '低'], 'medium': ['MEDIUM', '中等'],
    'high': ['HIGH', '高'], 'critical': ['CRITICAL', '极高'],
  };
  return (m[lv] || m.critical)[zh ? 1 : 0];
}

const profileArchetypes: Record<string, { en: string; zh: string; icon: string; tagEn: string; tagZh: string }> = {
  EOFP: { en: 'The Glass Cannon', zh: '玻璃大炮', icon: '🎯', tagEn: 'Your entire workflow is a tutorial for AI', tagZh: '你的整个工作流程就是 AI 的教程' },
  EOFH: { en: 'The Human Bridge', zh: '人脉桥梁', icon: '🤝', tagEn: 'AI does the work, but they come back for YOU', tagZh: 'AI 能干活，但客户回来找的是你' },
  EORP: { en: 'The Final Stamp', zh: '终审印章', icon: '🛡️', tagEn: 'AI knows the rules — you enforce the consequences', tagZh: 'AI 懂规则，你执行后果' },
  ESFP: { en: 'The Taste Maker', zh: '品味定义者', icon: '🎨', tagEn: 'AI generates a thousand options — you know which is right', tagZh: 'AI 生成一千个选项，你知道哪个是对的' },
  TOFP: { en: 'The Bare Hand', zh: '赤手行者', icon: '🔧', tagEn: 'Your hands know things your brain can\'t explain', tagZh: '你的双手懂得大脑无法解释的东西' },
  EORH: { en: 'The License Wall', zh: '执照之墙', icon: '📜', tagEn: 'AI has the knowledge, but not the license on the wall', tagZh: 'AI 有知识，但墙上没有你的执照' },
  ESFH: { en: 'The Living Brand', zh: '活体品牌', icon: '⭐', tagEn: 'AI can mimic your style, but it can\'t BE you', tagZh: 'AI 能模仿你的风格，但它成不了你' },
  ESRP: { en: 'The Pressure Alchemist', zh: '高压炼金师', icon: '⚗️', tagEn: 'When failure isn\'t an option, they call a human', tagZh: '当失败不是选项时，他们会找一个人类' },
  TOFH: { en: 'The Signature Touch', zh: '签名手艺人', icon: '✂️', tagEn: 'People don\'t pay for the haircut — they pay for YOUR haircut', tagZh: '人们不是为理发买单——是为你的理发买单' },
  TORP: { en: 'The Steady Hand', zh: '不颤之手', icon: '🎯', tagEn: 'One wrong move and it\'s over — that\'s why they need you', tagZh: '一步走错就完了——这就是为什么他们需要你' },
  TSFP: { en: 'The Soul Craftsman', zh: '灵魂匠人', icon: '🏺', tagEn: 'Your imperfections are what make your work perfect', tagZh: '你的不完美恰恰是作品完美的原因' },
  ESRH: { en: 'The Oracle', zh: '神谕者', icon: '🔮', tagEn: 'People trust your judgment with their careers and lives', tagZh: '人们把职业、财富和生命交给你的判断' },
  TORH: { en: 'The Healing Hand', zh: '疗愈之手', icon: '🫀', tagEn: 'When lives are on the line, no one asks for the AI', tagZh: '命悬一线时，没人想要 AI' },
  TSFH: { en: 'The Irreplaceable', zh: '不可替代者', icon: '🦋', tagEn: 'You ARE the product — no one can automate who you are', tagZh: '你就是产品本身——没人能自动化你这个人' },
  TSRP: { en: 'The Last Call', zh: '终极裁决者', icon: '⚡', tagEn: 'In chaos, you decide who lives — AI freezes', tagZh: '混乱中，你决定谁活——AI 死机了' },
  TSRH: { en: 'The Iron Fortress', zh: '铁壁堡垒', icon: '🏰', tagEn: 'Four walls between you and AI — it can\'t even see you', tagZh: '你和 AI 之间隔着四道墙——它连你的影子都看不到' },
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ payload: string }> },
) {
  const { payload } = await params;

  const cached = await tryReadFromR2(payload);
  if (cached) return cached;

  const data = decodeSharePayload(payload);

  if (!data) {
    return new ImageResponse(
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, background: '#06080e', color: '#fafafa', fontFamily: 'sans-serif' }}>
        <span style={{ fontSize: 96, fontWeight: 900, letterSpacing: 16 }}>AIR</span>
        <span style={{ fontSize: 26, opacity: 0.4, letterSpacing: 4 }}>AI REPLACEMENT INDEX</span>
      </div>,
      { width: 1200, height: 630 },
    );
  }

  const zh = data.lang === 'zh';
  const c = pal(data.riskLevel);
  const lb = riskLabel(data.riskLevel, zh);
  const prob = data.replacementProbability;
  const yr = data.predictedReplacementYear >= 2100 ? '∞' : String(data.predictedReplacementYear);
  const code = (data.v === 2 && 'profileCode' in data && data.profileCode) || null;
  const arch = code ? profileArchetypes[code] : null;
  const name = arch?.[zh ? 'zh' : 'en'] ?? 'AIR';
  const icon = arch?.icon ?? null;
  const tagline = arch ? (zh ? arch.tagZh : arch.tagEn) : null;

  const currentYear = new Date().getFullYear();
  const yearsLeft = data.predictedReplacementYear >= 2100 ? null : data.predictedReplacementYear - currentYear;
  const countdown = yearsLeft !== null
    ? (zh ? `距离被替代还有 ${yearsLeft} 年` : `${yearsLeft} years until replaced`)
    : (zh ? `AI 已能做你 ${data.currentReplacementDegree}% 的工作` : `AI can already do ${data.currentReplacementDegree}% today`);

  const img = new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#06080e', color: '#ccd0e4', fontFamily: 'sans-serif', position: 'relative', padding: '46px 60px' }}>
      {/* top accent + glow */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, display: 'flex', background: `linear-gradient(90deg, transparent 5%, ${c.m} 35%, ${c.a} 65%, transparent 95%)` }} />
      <div style={{ position: 'absolute', top: -120, right: -60, width: 540, height: 540, borderRadius: '50%', display: 'flex', background: `radial-gradient(circle, ${c.g}14 0%, transparent 65%)` }} />

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 40, fontWeight: 900, letterSpacing: 8, opacity: 0.7 }}>AIR</span>
          <div style={{ width: 2, height: 30, background: 'rgba(255,255,255,0.2)', display: 'flex' }} />
          <span style={{ fontSize: 18, letterSpacing: 3, opacity: 0.4 }}>{zh ? 'AI替代风险指数' : 'AI REPLACEMENT INDEX'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 22px', borderRadius: 100, border: `2px solid ${c.m}55`, background: `${c.m}14` }}>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: c.m, display: 'flex' }} />
          <span style={{ fontSize: 18, fontWeight: 800, color: c.m, letterSpacing: 1 }}>{zh ? `${lb}风险` : `${lb} RISK`}</span>
        </div>
      </div>

      {/* body: identity (left) + probability (right) */}
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between', gap: 36 }}>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 660 }}>
          {icon && <span style={{ fontSize: 54, marginBottom: 2 }}>{icon}</span>}
          <span style={{ fontSize: 76, fontWeight: 900, color: c.m, lineHeight: 1.05, letterSpacing: 1 }}>{name}</span>
          {code && <span style={{ fontSize: 24, fontWeight: 800, color: c.m, opacity: 0.4, letterSpacing: 8, marginTop: 6 }}>{code}</span>}
          {tagline && <span style={{ fontSize: 23, opacity: 0.55, fontStyle: 'italic', marginTop: 14, lineHeight: 1.4 }}>“{tagline}”</span>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flex: 'none' }}>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 3, opacity: 0.4 }}>{zh ? '替代概率' : 'REPLACEMENT'}</span>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 132, fontWeight: 900, lineHeight: 0.9, color: c.m }}>{prob}</span>
            <span style={{ fontSize: 50, fontWeight: 800, color: c.m, opacity: 0.5 }}>%</span>
          </div>
          <span style={{ fontSize: 20, opacity: 0.5, marginTop: 10 }}>
            {zh ? '预测 ' : 'by '}<span style={{ color: '#fff', fontWeight: 800 }}>{yr}</span>
          </span>
        </div>
      </div>

      {/* footer: countdown + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', padding: '10px 24px', borderRadius: 12, border: `2px solid ${c.m}30`, background: `${c.m}0c` }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: c.m }}>{countdown}</span>
        </div>
        <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', opacity: 0.9 }}>
          {zh ? '测测你的 AI 替代风险 → air.democra.ai' : "What's your AI risk? → air.democra.ai"}
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
