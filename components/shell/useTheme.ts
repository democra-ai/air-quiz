'use client';

import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const THEME_EVENT = 'air-theme-change';

/**
 * Cross-component theme hook. Every instance subscribes to a window-level
 * CustomEvent so that toggling theme in one component immediately propagates
 * to every other component that reads it (Nav, page, footer, etc.).
 */
export function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const initial = (document.documentElement.getAttribute('data-theme') as Theme) || 'light';
    setThemeState(initial);

    const onChange = (e: Event) => {
      const next = (e as CustomEvent<Theme>).detail;
      if (next === 'light' || next === 'dark') setThemeState(next);
    };
    window.addEventListener(THEME_EVENT, onChange);
    return () => window.removeEventListener(THEME_EVENT, onChange);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try { localStorage.setItem('air-theme', t); } catch {}
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
    window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: t }));
  }, []);

  return [theme, setTheme];
}
