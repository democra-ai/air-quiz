'use client';

import { useEffect } from 'react';

/**
 * Tiny client-only effect that keeps html[data-theme] in sync with localStorage
 * after the initial inline bootstrap. Pairs with the inline <script> in app/layout.tsx
 * which runs before paint to prevent FOUC.
 */
export default function ThemeBootstrap() {
  useEffect(() => {
    const html = document.documentElement;
    // Listen for system theme changes when no explicit preference is saved
    const m = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const saved = localStorage.getItem('air-theme');
      if (saved) return;
      const next = m.matches ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      html.classList.toggle('dark', next === 'dark');
    };
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, []);
  return null;
}
