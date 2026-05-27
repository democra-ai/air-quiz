'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Language } from '@/lib/translations';
import { detectBrowserLanguage, getHtmlLang } from '@/lib/translations';

const SUPPORTED: Language[] = ['en', 'zh', 'ja', 'ko', 'de'];

export function useLang(initial: Language = 'en'): [Language, (l: Language) => void] {
  const [lang, setLangState] = useState<Language>(initial);

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem('air-lang')) as Language | null;
    const next: Language = saved && SUPPORTED.includes(saved) ? saved : detectBrowserLanguage();
    setLangState(next);
    document.documentElement.setAttribute('lang', getHtmlLang(next));
  }, []);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    try { localStorage.setItem('air-lang', l); } catch {}
    document.documentElement.setAttribute('lang', getHtmlLang(l));
  }, []);

  return [lang, setLang];
}
