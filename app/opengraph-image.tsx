import { ImageResponse } from 'next/og';

export const alt = 'AIR — The AI-Resistance Personality Test';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '70px 80px',
          background: '#f7f2e8',
          color: '#1f1814',
          fontFamily: 'serif',
        }}
      >
        {/* Top rule */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 22, letterSpacing: 6, color: '#c2492c', fontFamily: 'monospace' }}>§ 01</span>
          <div style={{ flex: 1, height: 1, background: '#d8ccb4', display: 'flex' }} />
          <span style={{ fontSize: 18, letterSpacing: 4, textTransform: 'uppercase', color: '#5a4d40' }}>An essay in 16 parts</span>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: 120, lineHeight: 1, margin: 0, color: '#110b08', letterSpacing: -3, fontStyle: 'italic' }}>
            The kind of <span style={{ color: '#c2492c' }}>human</span>
          </h1>
          <h1 style={{ fontSize: 120, lineHeight: 1.05, margin: 0, color: '#110b08', letterSpacing: -3 }}>
            AI cannot replace.
          </h1>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 70, color: '#110b08', fontStyle: 'italic', letterSpacing: -2 }}>air</span>
            <span style={{ fontSize: 22, color: '#5a4d40', letterSpacing: 2, textTransform: 'uppercase' }}>
              The AI-Resistance Personality Test
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 28px',
              borderRadius: 999,
              background: '#110b08',
              color: '#f7f2e8',
              fontSize: 26,
            }}
          >
            <span>air.democra.ai</span>
            <span style={{ fontFamily: 'monospace' }}>→</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
