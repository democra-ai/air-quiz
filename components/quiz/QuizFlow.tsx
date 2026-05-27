'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ALL_CORE_QUESTIONS,
  CORE_QUESTION_COUNT,
  QUIZ_DIMENSIONS,
  type QuizAnswer,
} from '@/lib/air_quiz_data';
import { calculateQuizResult, type QuizAnswers } from '@/lib/air_quiz_calculator';
import { encodeSharePayload } from '@/lib/share_payload';
import { L, type Language } from '@/lib/translations';
import {
  trackQuizStart,
  trackQuizAnswerDetailed,
  trackQuizComplete,
  trackAnswerDistribution,
  trackQuizAbandon,
  trackQuestionView,
  trackQuizBack,
} from '@/lib/analytics';

import QuizIntro from './QuizIntro';
import QuestionCard from './QuestionCard';
import ProgressRibbon from './ProgressRibbon';
import CompletingScreen from './CompletingScreen';

type Phase = 'intro' | 'questions' | 'submitting';

interface Props {
  lang: Language;
  onExit: () => void;
}

const STORAGE_KEY = 'air-quiz-answers';

export default function QuizFlow({ lang, onExit }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});

  /** Rehydrate any in-progress answers on mount */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') setAnswers(parsed);
      }
    } catch {}
  }, []);

  /** Persist answers between renders */
  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers)); } catch {}
  }, [answers]);

  const total = CORE_QUESTION_COUNT;
  const q = useMemo(() => ALL_CORE_QUESTIONS[idx], [idx]);

  /** Map question id → its dimension index (1..4) */
  const dimensionIndex = useMemo(() => {
    const m = new Map<string, number>();
    QUIZ_DIMENSIONS.forEach((d, di) => d.questions.forEach((qq) => m.set(qq.id, di)));
    return m;
  }, []);

  const sectionCaption = useMemo(() => {
    if (!q) return '';
    const di = dimensionIndex.get(q.id) ?? 0;
    const roman = ['I', 'II', 'III', 'IV'][di];
    const name = QUIZ_DIMENSIONS[di].name;
    return `${roman} · ${L(name, lang).toUpperCase()}`;
  }, [q, dimensionIndex, lang]);

  // ── Phase: track question view ────────────────────────────────────────
  useEffect(() => {
    if (phase === 'questions' && q) {
      trackQuestionView(q.id, 'core', idx);
    }
  }, [phase, q, idx]);

  // ── Abandonment tracking ─────────────────────────────────────────────
  useEffect(() => {
    const onBeforeUnload = () => {
      if (phase === 'questions') {
        trackQuizAbandon('core', idx, lang);
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [phase, idx, lang]);

  // ── Handlers ─────────────────────────────────────────────────────────
  const start = () => {
    setPhase('questions');
    setIdx(0);
    trackQuizStart(lang);
  };

  const choose = (a: QuizAnswer) => {
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.id]: a }));
    trackQuizAnswerDetailed(q.id, a, 'core', idx);
  };

  const next = async () => {
    if (idx < total - 1) {
      setIdx((i) => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      await submit();
    }
  };

  const back = () => {
    if (idx === 0) {
      setPhase('intro');
      return;
    }
    trackQuizBack('core', idx);
    setIdx((i) => Math.max(0, i - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    setPhase('submitting');
    try {
      const payload: QuizAnswers = { core: answers, snapshot: {}, survey: {} };
      const result = calculateQuizResult(payload, null);

      // fire-and-forget telemetry (the helpers internally beacon)
      void trackQuizComplete(result, { core: payload.core, snapshot: {}, survey: {} }, lang);
      void trackAnswerDistribution(answers as Record<string, number>, result.profileCode, lang);

      const sp = encodeSharePayload({
        riskLevel: result.riskLevel,
        replacementProbability: Math.round(result.replacementProbability),
        predictedReplacementYear: isFinite(result.predictedReplacementYear) ? Math.round(result.predictedReplacementYear) : 2099,
        currentReplacementDegree: Math.round(result.currentReplacementDegree),
        earliestYear: result.confidenceInterval.earliest,
        latestYear: isFinite(result.confidenceInterval.latest) ? result.confidenceInterval.latest : 2099,
        lang: lang as 'en' | 'zh' | 'ja' | 'ko' | 'de',
        profileCode: result.profileCode,
      });

      // clear in-progress draft
      try { sessionStorage.removeItem(STORAGE_KEY); } catch {}

      // brief pause for the "computing" effect, then navigate
      await new Promise((r) => setTimeout(r, 1100));
      router.push(`/share/${sp}`);
    } catch (e) {
      console.error('[QuizFlow] submit failed', e);
      setPhase('questions');
    }
  };

  // ── Render ───────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return <QuizIntro lang={lang} onStart={start} onCancel={onExit} />;
  }
  if (phase === 'submitting') {
    return <CompletingScreen lang={lang} />;
  }
  if (!q) return null;
  return (
    <>
      <ProgressRibbon
        current={idx + 1}
        total={total}
        label={lang === 'zh' ? '进度' : 'Question'}
      />
      <QuestionCard
        question={q}
        lang={lang}
        positionLabel={`Q.${String(idx + 1).padStart(2, '0')}`}
        sectionCaption={sectionCaption}
        value={answers[q.id]}
        onChange={choose}
        onNext={next}
        onBack={back}
        isLast={idx === total - 1}
      />
    </>
  );
}
