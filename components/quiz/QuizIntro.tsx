'use client';

import type { Language } from '@/lib/translations';
import { CORE_QUESTION_COUNT } from '@/lib/air_quiz_data';

interface Props {
  lang: Language;
  onStart: () => void;
  onCancel: () => void;
}

export default function QuizIntro({ lang, onStart, onCancel }: Props) {
  const zh = lang === 'zh';

  return (
    <div className="page-narrow" style={{ paddingTop: 'clamp(5rem, 12vh, 8rem)', paddingBottom: 'clamp(2rem, 6vh, 5rem)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }} className="animate-fade-up">
        <span className="section-number">§ 00 · {zh ? '准备' : 'Prelude'}</span>
        <span className="rule-h" style={{ flex: 1 }} />
      </div>

      <h1 className="display-lg animate-fade-up" style={{ animationDelay: '60ms', maxWidth: '18ch', marginBottom: 24 }}>
        {zh ? (
          <>这份测试要问你 <em className="italic-display" style={{ fontStyle: 'italic', color: 'var(--accent)' }}>16 个问题</em>，关于你怎么工作。</>
        ) : (
          <>The test will ask you <em className="italic-display" style={{ fontStyle: 'italic', color: 'var(--accent)' }}>sixteen questions</em>, about how you work.</>
        )}
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
        {zh
          ? '没有"正确答案"。每题选一个最贴近你日常工作的描述。我们会根据你 16 题的答案，把你映射到 16 个原型里的一个，并算出 AI 能在多大程度上取代你的概率。'
          : 'There are no right answers. For each question, pick the option that best matches your day-to-day. From your sixteen answers we map you to one of sixteen archetypes and estimate the share of your work AI can already do.'}
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
        <Stat label={zh ? '题目数' : 'Questions'} value={`${CORE_QUESTION_COUNT}`} />
        <Stat label={zh ? '估算用时' : 'Reading time'} value={zh ? '约 4 分钟' : 'c. 4 min'} />
        <Stat label={zh ? '维度' : 'Dimensions'} value={'4'} />
        <Stat label={zh ? '可能结果' : 'Archetypes'} value={'16'} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
        <button onClick={onStart} className="btn btn-primary btn-lg">
          {zh ? '开始测试' : 'Begin the test'}
          <span aria-hidden>→</span>
        </button>
        <button onClick={onCancel} className="btn btn-text" style={{ padding: '0.5em 0' }}>
          {zh ? '返回首页' : 'Back to home'}
        </button>
      </div>

      <p className="marginalia" style={{ marginTop: 36 }}>
        {zh ? '数据匿名收集，仅用于研究。' : 'Data collected anonymously. For research only.'}
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
