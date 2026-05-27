'use client';

import { useState } from 'react';
import type { Language } from '@/lib/translations';
import { CORE_QUESTION_COUNT } from '@/lib/air_quiz_data';
import { FULL_QUESTION_COUNT } from '@/lib/air_quiz_data_60';
import { ui } from '@/lib/ui_text';

export type QuizMode = 'quick' | 'full';

interface Props {
  lang: Language;
  initialMode?: QuizMode;
  onStart: (mode: QuizMode) => void;
  onCancel: () => void;
}

export default function QuizIntro({ lang, initialMode = 'quick', onStart, onCancel }: Props) {
  const t = ui(lang).intro;
  const [mode, setMode] = useState<QuizMode>(initialMode);

  return (
    <div className="page-narrow" style={{ paddingTop: 'clamp(5rem, 12vh, 8rem)', paddingBottom: 'clamp(2rem, 6vh, 5rem)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }} className="animate-fade-up">
        <span className="section-number">{t.eyebrow}</span>
        <span className="rule-h" style={{ flex: 1 }} />
      </div>

      <h1 className="display-lg animate-fade-up" style={{ animationDelay: '60ms', maxWidth: '18ch', marginBottom: 24 }}>
        {t.headline.pre}
        <em className="italic-display" style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t.headline.em}</em>
        {t.headline.post}
      </h1>

      <p
        className="reading animate-fade-up"
        style={{ animationDelay: '120ms', fontSize: 'var(--step-1)', lineHeight: 1.55, color: 'var(--ink)', marginBottom: 32 }}
      >
        {t.lead}
      </p>

      {/* Mode picker — two editorial cards, click to select */}
      <div className="animate-fade-up" style={{ animationDelay: '180ms', marginBottom: 28 }}>
        <p className="smallcaps" style={{ marginBottom: 10 }}>{t.mode_label}</p>
        <div
          role="radiogroup"
          aria-label={t.mode_label}
          style={{
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          }}
        >
          <ModeCard
            selected={mode === 'quick'}
            onClick={() => setMode('quick')}
            label={t.mode_quick}
            count={`${CORE_QUESTION_COUNT}`}
            meta={t.mode_quick_meta}
          />
          <ModeCard
            selected={mode === 'full'}
            onClick={() => setMode('full')}
            label={t.mode_full}
            count={`${FULL_QUESTION_COUNT}`}
            meta={t.mode_full_meta}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
        <button onClick={() => onStart(mode)} className="btn btn-primary btn-lg">
          {t.cta_start}
          <span aria-hidden>→</span>
        </button>
        <button onClick={onCancel} className="btn btn-text" style={{ padding: '0.5em 0' }}>
          {t.cta_back}
        </button>
      </div>

      <p className="marginalia" style={{ marginTop: 36 }}>
        {t.privacy_note}
      </p>
    </div>
  );
}

function ModeCard({
  selected, onClick, label, count, meta,
}: { selected: boolean; onClick: () => void; label: string; count: string; meta: string }) {
  return (
    <button
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      style={{
        textAlign: 'left',
        cursor: 'pointer',
        padding: '1.25rem 1.3rem',
        borderRadius: 14,
        background: selected ? 'color-mix(in srgb, var(--paper-card) 70%, var(--accent) 10%)' : 'var(--paper-card)',
        border: `1px solid ${selected ? 'var(--accent)' : 'var(--paper-rule)'}`,
        transition: 'border-color .18s ease, background .18s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'var(--step-2)',
            color: 'var(--ink-strong)',
            fontVariationSettings: '"opsz" 108, "SOFT" 100, "WONK" 1',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--step-2)',
            color: selected ? 'var(--accent)' : 'var(--ink-mute)',
            fontVariantNumeric: 'tabular-nums',
            transition: 'color .18s ease',
          }}
        >
          {count}
        </span>
      </div>
      <p style={{ color: 'var(--ink-mute)', fontSize: '0.92rem', lineHeight: 1.4 }}>
        {meta}
      </p>
    </button>
  );
}
