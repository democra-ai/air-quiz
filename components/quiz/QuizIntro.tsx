'use client';

import type { Language } from '@/lib/translations';
import { CORE_QUESTION_COUNT } from '@/lib/air_quiz_data';
import { ui } from '@/lib/ui_text';

interface Props {
  lang: Language;
  onStart: () => void;
  onCancel: () => void;
}

export default function QuizIntro({ lang, onStart, onCancel }: Props) {
  const t = ui(lang).intro;

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
        style={{
          animationDelay: '120ms',
          fontSize: 'var(--step-1)',
          lineHeight: 1.55,
          color: 'var(--ink)',
          marginBottom: 32,
        }}
      >
        {t.lead}
      </p>

      <div
        className="card animate-fade-up"
        style={{
          animationDelay: '180ms',
          padding: 'clamp(1.25rem, 3vw, 1.75rem)',
          marginBottom: 32,
          display: 'grid',
          gap: 14,
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        }}
      >
        <Stat label={t.stat_questions} value={`${CORE_QUESTION_COUNT}`} />
        <Stat label={t.stat_time} value={t.stat_time_value} />
        <Stat label={t.stat_dimensions} value={'4'} />
        <Stat label={t.stat_archetypes} value={'16'} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
        <button onClick={onStart} className="btn btn-primary btn-lg">
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="smallcaps">{label}</p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--step-3)', lineHeight: 1.1, marginTop: 4, color: 'var(--ink-strong)' }}>
        {value}
      </p>
    </div>
  );
}
