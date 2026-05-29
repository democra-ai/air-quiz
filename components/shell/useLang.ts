'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Language } from '@/lib/translations';
import { getHtmlLang } from '@/lib/translations';

const SUPPORTED: Language[] = ['en', 'zh', 'ja', 'ko', 'de'];
const LANG_EVENT = 'air-lang-change';

/**
 * Cross-component language hook. Every instance subscribes to a window-level
 * CustomEvent so a lang change in Nav immediately re-renders QuizFlow,
 * QuestionCard, Footer, etc. without needing a React Context.
 */
export function useLang(initial: Language = 'en'): [Language, (l: Language) => void] {
  const [lang, setLangState] = useState<Language>(initial);

  useEffect(() => {
    // Default is ALWAYS English. We deliberately do NOT auto-detect the browser
    // locale — a Chinese-browser visitor should still land in English unless they
    // explicitly switch (which persists to localStorage). This keeps the product
    // default — and therefore the share/OG card language — English by default.
    const saved = (typeof window !== 'undefined' && localStorage.getItem('air-lang')) as Language | null;
    const next: Language = saved && SUPPORTED.includes(saved) ? saved : 'en';
    setLangState(next);
    document.documentElement.setAttribute('lang', getHtmlLang(next));

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<Language>).detail;
      if (detail && SUPPORTED.includes(detail)) setLangState(detail);
    };
    window.addEventListener(LANG_EVENT, onChange);
    return () => window.removeEventListener(LANG_EVENT, onChange);
  }, []);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    try { localStorage.setItem('air-lang', l); } catch {}
    document.documentElement.setAttribute('lang', getHtmlLang(l));
    window.dispatchEvent(new CustomEvent<Language>(LANG_EVENT, { detail: l }));
  }, []);

  return [lang, setLang];
}
