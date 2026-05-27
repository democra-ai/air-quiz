'use client';

interface Props {
  current: number;    // 0-indexed
  total: number;
  label?: string;
}

export default function ProgressRibbon({ current, total, label }: Props) {
  const pct = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
  return (
    <>
      <div className="progress-ribbon" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={current}>
        <div className="progress-ribbon-fill" style={{ width: `${pct}%` }} />
      </div>
      {label ? (
        <div
          data-progress-counter
          style={{
            position: 'fixed',
            top: 12,
            right: 'var(--gutter)',
            zIndex: 51,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span className="marginalia" style={{ letterSpacing: '0.16em' }}>{label}</span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: 'var(--ink)',
            background: 'var(--paper-card)',
            border: '1px solid var(--paper-rule)',
            borderRadius: 999,
            padding: '3px 10px',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {String(current).padStart(2, '0')}<span style={{ opacity: 0.45, margin: '0 4px' }}>/</span>{String(total).padStart(2, '0')}
          </span>
        </div>
      ) : null}
    </>
  );
}
