'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ALL_CORE_QUESTIONS,
  CORE_QUESTION_COUNT,
  QUIZ_DIMENSIONS,
  type QuizAnswer,
  type QuizQuestion,
} from '@/lib/air_quiz_data';
import {
  ALL_FULL_QUESTIONS,
  FULL_QUESTION_COUNT,
  DIMENSION_LEARNABILITY_FULL,
  DIMENSION_EVALUATION_FULL,
  DIMENSION_RISK_FULL,
  DIMENSION_HUMAN_FULL,
} from '@/lib/air_quiz_data_60';
import {
  calculateQuizResult,
  calculateQuizResultFull,
  type QuizAnswers,
} from '@/lib/air_quiz_calculator';
import { encodeSharePayload } from '@/lib/share_payload';
import { packDimAvg } from '@/lib/occupation_inference';
import { L, type Language } from '@/lib/translations';
import { ui } from '@/lib/ui_text';
import {
  trackQuizStart,
  trackQuizAnswerDetailed,
  trackQuizComplete,
  trackAnswerDistribution,
  trackQuizAbandon,
  trackQuestionView,
  trackQuizBack,
  trackQuizModeSelect,
} from '@/lib/analytics';

import QuizIntro, { type QuizMode } from './QuizIntro';
import QuestionCard from './QuestionCard';
import ProgressRibbon from './ProgressRibbon';
import CompletingScreen from './CompletingScreen';

type Phase = 'intro' | 'questions' | 'submitting';

interface Props {
  lang: Language;
  initialMode?: QuizMode;
  onExit: () => void;
}

const STORAGE_KEY_PREFIX = 'air-quiz-answers';

// Per-dimension question metadata required by calculateQuizResultFull
const FULL_DIMENSION_META: { id: string; direction: 'forward' | 'reverse' }[][] = [
  DIMENSION_LEARNABILITY_FULL.map(q => ({ id: q.id, direction: q.direction })),
  DIMENSION_EVALUATION_FULL.map(q => ({ id: q.id, direction: q.direction })),
  DIMENSION_RISK_FULL.map(q => ({ id: q.id, direction: q.direction })),
  DIMENSION_HUMAN_FULL.map(q => ({ id: q.id, direction: q.direction })),
];

export default function QuizFlow({ lang, initialMode = 'quick', onExit }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [mode, setMode] = useState<QuizMode>(initialMode);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});

  // Re-derive the active question set whenever mode changes
  const { questions, total, storageKey, dimensionForQid } = useMemo(() => {
    if (mode === 'full') {
      const dimMap = new Map<string, number>();
      FULL_DIMENSION_META.forEach((dim, di) => dim.forEach((q) => dimMap.set(q.id, di)));
      return {
        questions: ALL_FULL_QUESTIONS as QuizQuestion[],
        total: FULL_QUESTION_COUNT,
        storageKey: `${STORAGE_KEY_PREFIX}-full`,
        dimensionForQid: dimMap,
      };
    }
    const dimMap = new Map<string, number>();
    QUIZ_DIMENSIONS.forEach((d, di) => d.questions.forEach((q) => dimMap.set(q.id, di)));
    return {
      questions: ALL_CORE_QUESTIONS,
      total: CORE_QUESTION_COUNT,
      storageKey: `${STORAGE_KEY_PREFIX}-quick`,
      dimensionForQid: dimMap,
    };
  }, [mode]);

  /** Rehydrate any in-progress answers on mount or mode-switch */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          setAnswers(parsed);
          return;
        }
      }
      setAnswers({});
    } catch {
      setAnswers({});
    }
  }, [storageKey]);

  /** Persist answers between renders */
  useEffect(() => {
    try { sessionStorage.setItem(storageKey, JSON.stringify(answers)); } catch {}
  }, [answers, storageKey]);

  const q = questions[idx];

  const sectionCaption = useMemo(() => {
    if (!q) return '';
    const di = dimensionForQid.get(q.id) ?? 0;
    const roman = ['I', 'II', 'III', 'IV'][di];
    const name = QUIZ_DIMENSIONS[di].name;
    return `${roman} · ${L(name, lang).toUpperCase()}`;
  }, [q, dimensionForQid, lang]);

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
        trackQuizAbandon(mode, idx, lang);
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [phase, idx, lang, mode]);

  // ── Handlers ─────────────────────────────────────────────────────────
  const start = (selectedMode: QuizMode) => {
    setMode(selectedMode);
    setPhase('questions');
    setIdx(0);
    trackQuizModeSelect(selectedMode === 'quick' ? 'compact' : 'full', lang);
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
    trackQuizBack(mode, idx);
    setIdx((i) => Math.max(0, i - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    setPhase('submitting');
    try {
      const result = mode === 'full'
        ? calculateQuizResultFull(answers, FULL_DIMENSION_META, null)
        : calculateQuizResult({ core: answers, snapshot: {}, survey: {} } as QuizAnswers, null);

      // fire-and-forget telemetry
      void trackQuizComplete(result, { core: answers, snapshot: {}, survey: {} }, lang);
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
        dimAvg: packDimAvg(result.dimensions) as [number, number, number, number],
      });

      try { sessionStorage.removeItem(storageKey); } catch {}

      await new Promise((r) => setTimeout(r, 1100));
      router.push(`/share/${sp}`);
    } catch (e) {
      console.error('[QuizFlow] submit failed', e);
      setPhase('questions');
    }
  };

  // ── Render ───────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return <QuizIntro lang={lang} initialMode={mode} onStart={start} onCancel={onExit} />;
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
        label={ui(lang).question.progress_label}
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
