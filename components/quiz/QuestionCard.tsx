'use client';

import { useEffect, useState } from 'react';
import type { QuizQuestion, QuizAnswer, L10n } from '@/lib/air_quiz_data';
import type { Language } from '@/lib/translations';
import { L } from '@/lib/translations';
import { ui } from '@/lib/ui_text';

interface Props {
  question: QuizQuestion;
  lang: Language;
  /** 1-indexed position within the section (e.g. 3 of 16) */
  positionLabel: string;
  /** Section caption like "I · LEARNABILITY" */
  sectionCaption: string;
  /** Currently-saved answer, if any */
  value: QuizAnswer | undefined;
  onChange: (a: QuizAnswer) => void;
  onNext: () => void;
  onBack: (() => void) | null;
  isLast: boolean;
}

export default function QuestionCard({
  question,
  lang,
  positionLabel,
  sectionCaption,
  value,
  onChange,
  onNext,
  onBack,
  isLast,
}: Props) {
  const [animKey, setAnimKey] = useState(question.id);
  useEffect(() => { setAnimKey(question.id); }, [question.id]);

  const t = ui(lang).question;
  const opts = question.options as L10n[];
  const questionText = L(question.question, lang);

  return (
    <div className="page-narrow" style={{ paddingTop: 'clamp(5rem, 14vh, 9rem)', paddingBottom: 'clamp(2rem, 6vh, 5rem)' }}>
      {/* Section caption + position */}
      <div
        key={`hdr-${animKey}`}
        className="animate-fade-up"
        style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 'clamp(1.5rem, 3vh, 2.25rem)' }}
      >
        <span className="section-number">{positionLabel}</span>
        <span className="rule-h" style={{ flex: 1 }} />
        <span className="smallcaps">{sectionCaption}</span>
      </div>

      {/* Question */}
      <h2
        key={`q-${animKey}`}
        className="display-md animate-fade-up"
        style={{
          animationDelay: '60ms',
          marginBottom: 'clamp(1.75rem, 4vh, 2.5rem)',
          maxWidth: '24ch',
        }}
      >
        {questionText}
      </h2>

      {/* Options as editorial cards (stacked) */}
      <div key={`opts-${animKey}`} className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {opts.map((opt, idx) => {
          const score = (idx + 1) as QuizAnswer;
          const isSelected = value === score;
          return (
            <button
              key={`${question.id}-${idx}`}
              className="option-card"
              aria-pressed={isSelected}
              onClick={() => { onChange(score); }}
            >
              <span className="option-marker">{score}</span>
              <span style={{ flex: 1 }}>{L(opt, lang)}</span>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div
        style={{
          marginTop: 'clamp(2rem, 5vh, 3rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        {onBack ? (
          <button onClick={onBack} className="btn btn-text" style={{ padding: '0.5em 0' }}>
            <span aria-hidden>←</span>&nbsp;{t.back}
          </button>
        ) : <span />}

        <button
          onClick={onNext}
          disabled={value === undefined}
          className={value === undefined ? 'btn btn-ghost' : 'btn btn-primary'}
          style={value === undefined ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
        >
          {isLast ? t.see_result : t.continue}
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
