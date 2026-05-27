/**
 * AIR Analytics — event tracking layer (Cloudflare edition).
 *
 * Public API unchanged. Internally:
 *   - Event stream   → POST /api/track/event  → Analytics Engine
 *   - Quiz session   → POST /api/track/session       → D1 quiz_sessions
 *   - Answer dist    → POST /api/track/answer-dist   → D1 answer_distributions
 *   - Anonymous uid  → localStorage (replaces Firebase signInAnonymously)
 *
 * All functions are fire-and-forget (never throw, never block UI) and are
 * safe to call server-side (they no-op).
 */

import type { QuizResult } from './air_quiz_calculator';
import type { QuizAnswer } from './air_quiz_data';
import { encodeSharePayload } from './share_payload';
import { getAnonymousUid } from './client-id';
import { getTurnstileToken } from './turnstile-client';

// ─── Types ───────────────────────────────────────────────────────────────────

type Language = 'en' | 'zh' | 'ja' | 'ko' | 'de';
type Theme = 'dark' | 'light';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Fire-and-forget JSON POST. Never throws. */
function beacon(path: string, body: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = JSON.stringify(body);
    // Prefer sendBeacon for unload-resilient event pings.
    if (path !== '/api/track/session' && 'sendBeacon' in navigator) {
      const blob = new Blob([payload], { type: 'application/json' });
      if (navigator.sendBeacon(path, blob)) return;
    }
    // Fallback / session writes need a response for debugging.
    void fetch(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // silent
  }
}

function safeLogEvent(eventName: string, params?: Record<string, unknown>) {
  beacon('/api/track/event', { name: eventName, params });
}

// ─── Session tracking state ──────────────────────────────────────────────────

let _quizStartTime: number | null = null;
let _selectedPreset: string | null = null;
let _sessionId: string | null = null;
let _questionViewTime: number | null = null;
let _previousAnswers: Record<string, number> = {};

// ─── Public API ──────────────────────────────────────────────────────────────

export function trackPageView(pagePath: string) {
  safeLogEvent('page_view', {
    page_path: pagePath,
    page_title: typeof document !== 'undefined' ? document.title : '',
  });
}

export function trackSectionView(sectionName: string) {
  safeLogEvent('section_view', { section_name: sectionName });
}

export function trackQuizStart(lang: Language) {
  _quizStartTime = Date.now();
  _sessionId = generateSessionId();
  _selectedPreset = null;
  _previousAnswers = {};
  _questionViewTime = null;
  safeLogEvent('quiz_start', {
    language: lang,
    session_id: _sessionId,
    device:
      typeof navigator !== 'undefined'
        ? /Mobile|Android|iPhone/i.test(navigator.userAgent)
          ? 'mobile'
          : 'desktop'
        : 'unknown',
    screen_size:
      typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '',
  });
}

export function trackPresetSelect(presetName: string, lang: Language) {
  _selectedPreset = presetName;
  safeLogEvent('preset_select', {
    preset_name: presetName,
    language: lang,
    session_id: _sessionId,
  });
}

export function trackQuizAnswer(
  questionId: string,
  answer: number,
  phase: 'core' | 'snapshot' | 'survey',
  questionIndex: number,
) {
  safeLogEvent('quiz_answer', {
    question_id: questionId,
    answer,
    phase,
    question_index: questionIndex,
    session_id: _sessionId,
  });
}

/** Track quiz completion — writes to Analytics Engine + D1 quiz_sessions. */
export async function trackQuizComplete(
  result: QuizResult,
  answers: {
    core: Record<string, QuizAnswer>;
    snapshot: Record<string, QuizAnswer>;
    survey: Record<string, number>;
  },
  lang: Language,
) {
  const durationSeconds = _quizStartTime
    ? Math.round((Date.now() - _quizStartTime) / 1000)
    : 0;

  safeLogEvent('quiz_complete', {
    profile_code: result.profileCode,
    risk_tier: result.profile.riskTier,
    probability: result.replacementProbability,
    year: result.predictedReplacementYear,
    ai_capability: result.currentAICapability,
    favorable_count: result.favorableCount,
    duration_seconds: durationSeconds,
    language: lang,
    preset: _selectedPreset,
    session_id: _sessionId,
  });

  try {
    const sessionId = _sessionId || generateSessionId();
    const uid = getAnonymousUid();

    const sharePayload = encodeSharePayload({
      riskLevel: result.riskLevel,
      replacementProbability: result.replacementProbability,
      predictedReplacementYear: isFinite(result.predictedReplacementYear)
        ? result.predictedReplacementYear
        : 9999,
      currentReplacementDegree: result.currentReplacementDegree,
      earliestYear: result.confidenceInterval.earliest,
      latestYear: isFinite(result.confidenceInterval.latest)
        ? result.confidenceInterval.latest
        : 9999,
      lang,
      profileCode: result.profileCode,
    });
    const shareUrl = `https://air.democra.ai/share/${sharePayload}`;

    const turnstileToken = await getTurnstileToken('quiz_complete');

    const payload = {
      sessionId,
      uid,
      language: lang,
      preset: _selectedPreset,
      profileCode: result.profileCode,
      profileName:
        (result.profile.name as Record<string, string>)[lang] ??
        result.profile.name['en'],
      riskTier: result.profile.riskTier,
      probability: result.replacementProbability,
      predictedYear: isFinite(result.predictedReplacementYear)
        ? result.predictedReplacementYear
        : null,
      aiCapability: result.currentAICapability,
      confidenceEarliest: result.confidenceInterval.earliest,
      confidenceLatest: isFinite(result.confidenceInterval.latest)
        ? result.confidenceInterval.latest
        : null,
      answersJson: JSON.stringify(answers),
      dimensionsJson: JSON.stringify(
        Object.fromEntries(
          result.dimensions.map((d) => [
            d.dimensionId,
            { score: d.rawAverage, letter: d.letter, isFavorable: d.isFavorable },
          ]),
        ),
      ),
      shareUrl,
      durationSeconds,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      screenSize:
        typeof window !== 'undefined'
          ? `${window.innerWidth}x${window.innerHeight}`
          : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      turnstileToken,
    };

    beacon('/api/track/session', payload);
  } catch (err) {
    console.error('[AIR Analytics] session write failed:', err);
  }
}

export function trackShareClick(channel: string, lang: Language) {
  safeLogEvent('share_click', { channel, language: lang, session_id: _sessionId });
}

export function trackThemeToggle(newTheme: Theme) {
  safeLogEvent('theme_toggle', { theme: newTheme });
}

export function trackLangToggle(newLang: Language) {
  safeLogEvent('lang_toggle', { language: newLang });
}

export function trackCtaClick(ctaId: string, location: string) {
  safeLogEvent('cta_click', { cta_id: ctaId, location });
}

export function trackNavigation(section: string) {
  safeLogEvent('nav_click', { section });
}

export function trackQuizAbandon(phase: string, questionIndex: number, lang: Language) {
  safeLogEvent('quiz_abandon', {
    phase,
    question_index: questionIndex,
    language: lang,
    session_id: _sessionId,
    duration_seconds: _quizStartTime
      ? Math.round((Date.now() - _quizStartTime) / 1000)
      : 0,
  });
}

export function trackExternalLink(url: string, label: string) {
  safeLogEvent('external_link_click', { url, label });
}

export function trackInternalNavigation(destination: string, source: string) {
  safeLogEvent('internal_navigation', { destination, source });
}

export function trackScrollDepth(depth: number) {
  safeLogEvent('scroll_depth', { depth_percent: depth });
}

export function trackSOCSelect(socCode: number, socName: string, lang: Language) {
  safeLogEvent('soc_select', {
    soc_code: socCode,
    soc_name: socName,
    language: lang,
    session_id: _sessionId,
  });
}

export function trackStageInteraction(
  stageId: number,
  stageName: string,
  action: 'hover' | 'click',
) {
  safeLogEvent('stage_interaction', {
    stage_id: stageId,
    stage_name: stageName,
    action,
  });
}

export function trackExpandToggle(sectionId: string, expanded: boolean) {
  safeLogEvent('expand_toggle', { section_id: sectionId, expanded });
}

export function trackTimelineInteraction(
  milestoneId: string,
  milestoneName: string,
  action: 'select' | 'deselect',
) {
  safeLogEvent('timeline_interaction', {
    milestone_id: milestoneId,
    milestone_name: milestoneName,
    action,
  });
}

export function trackQuizBack(phase: string, fromIndex: number) {
  safeLogEvent('quiz_back', {
    phase,
    from_index: fromIndex,
    session_id: _sessionId,
  });
}

export function trackSharePanelToggle(opened: boolean) {
  safeLogEvent('share_panel_toggle', { opened, session_id: _sessionId });
}

export function trackInfoPopup(popupId: string, opened: boolean) {
  safeLogEvent('info_popup', { popup_id: popupId, opened });
}

export function trackStatCardExpand(statIndex: number, label: string) {
  safeLogEvent('stat_card_expand', { stat_index: statIndex, label });
}

export function trackVisibilityChange(visible: boolean) {
  safeLogEvent('visibility_change', { visible });
}

export function trackEngagementTime(totalSeconds: number) {
  safeLogEvent('engagement_time', { total_seconds: totalSeconds });
}

export function trackUtmParams(params: Record<string, string>) {
  if (Object.keys(params).length === 0) return;
  safeLogEvent('utm_captured', params);
}

export function trackPresetPanelToggle(opened: boolean, lang: Language) {
  safeLogEvent('preset_panel_toggle', { opened, language: lang });
}

export function trackQuestionView(
  questionId: string,
  phase: 'core' | 'snapshot' | 'survey',
  questionIndex: number,
) {
  _questionViewTime = Date.now();
  safeLogEvent('question_view', {
    question_id: questionId,
    phase,
    question_index: questionIndex,
    session_id: _sessionId,
  });
}

export function trackQuizAnswerDetailed(
  questionId: string,
  answer: number,
  phase: 'core' | 'snapshot' | 'survey',
  questionIndex: number,
) {
  const timeSpentMs = _questionViewTime ? Date.now() - _questionViewTime : null;
  const previousAnswer = _previousAnswers[questionId];
  const isRevision = previousAnswer !== undefined && previousAnswer !== answer;
  _previousAnswers[questionId] = answer;
  safeLogEvent('quiz_answer_detailed', {
    question_id: questionId,
    answer,
    phase,
    question_index: questionIndex,
    session_id: _sessionId,
    time_spent_ms: timeSpentMs,
    is_revision: isRevision,
    previous_answer: isRevision ? previousAnswer : null,
  });
}

export function trackQuizPhase(fromPhase: string, toPhase: string) {
  const elapsedMs = _quizStartTime ? Date.now() - _quizStartTime : null;
  safeLogEvent('quiz_phase', {
    from_phase: fromPhase,
    to_phase: toPhase,
    elapsed_ms: elapsedMs,
    session_id: _sessionId,
  });
}

export function trackResultInteraction(action: string, detail?: string) {
  safeLogEvent('result_interaction', {
    action,
    detail: detail ?? null,
    session_id: _sessionId,
  });
}

export function trackQuizModeSelect(mode: 'compact' | 'full', lang: Language) {
  safeLogEvent('quiz_mode_select', {
    mode,
    language: lang,
    session_id: _sessionId,
  });
}

export function trackQuizRetake(previousProfileCode: string, lang: Language) {
  safeLogEvent('quiz_retake', {
    previous_profile: previousProfileCode,
    language: lang,
    session_id: _sessionId,
  });
  _quizStartTime = Date.now();
  _sessionId = generateSessionId();
  _previousAnswers = {};
  _questionViewTime = null;
}

/** Per-session answer distribution → D1 (`answer_distributions` + aggregate). */
export async function trackAnswerDistribution(
  answers: Record<string, number>,
  profileCode: string,
  lang: Language,
) {
  try {
    const sessionId = _sessionId || generateSessionId();
    beacon('/api/track/answer-dist', {
      sessionId,
      language: lang,
      profileCode,
      answers,
      device:
        typeof navigator !== 'undefined'
          ? /Mobile|Android|iPhone/i.test(navigator.userAgent)
            ? 'mobile'
            : 'desktop'
          : 'unknown',
    });
  } catch (err) {
    console.error('[AIR Analytics] answer_distributions write failed:', err);
  }
}

/** Initialize on app mount — kept for API parity. */
export async function initAnalytics() {
  if (typeof window !== 'undefined') {
    getAnonymousUid(); // ensure localStorage uid is primed
    trackPageView(window.location.pathname);
  }
}
