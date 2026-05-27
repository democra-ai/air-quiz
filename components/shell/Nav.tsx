'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from './useTheme';
import { useLang } from './useLang';
import { SUPPORTED_LANGUAGES, type Language } from '@/lib/translations';
import { ui } from '@/lib/ui_text';

/**
 * Editorial masthead. Logo (wordmark), thin rule, controls.
 * Sticky-translucent on scroll past 40px.
 */
export default function Nav() {
  const [theme, setTheme] = useTheme();
  const [lang, setLang] = useLang();
  const t = ui(lang).nav;
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: scrolled ? 'color-mix(in srgb, var(--paper) 88%, transparent)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px) saturate(140%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(8px) saturate(140%)' : 'none',
        borderBottom: scrolled ? '1px solid var(--paper-rule)' : '1px solid transparent',
        transition: 'background .3s ease, border-color .3s ease',
      }}
    >
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Wordmark */}
        <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: 10, textDecoration: 'none' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: '1.35rem',
              letterSpacing: '-0.02em',
              color: 'var(--ink-strong)',
              fontVariationSettings: '"opsz" 72, "SOFT" 100, "WONK" 1',
            }}
          >
            air
          </span>
          <span
            className="smallcaps"
            style={{ color: 'var(--ink-mute)', fontSize: '0.65rem', display: 'none' }}
            data-show-on-sm
          >
            {t.masthead_caption}
          </span>
        </Link>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Language */}
          <div ref={langRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              aria-label={t.lang_switch_aria}
              aria-expanded={langOpen}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                letterSpacing: '0.12em',
                color: 'var(--ink-mute)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: 4,
              }}
            >
              {lang.toUpperCase()}
            </button>
            {langOpen && (
              <div
                className="card"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 4px)',
                  minWidth: 160,
                  padding: 6,
                  zIndex: 60,
                  boxShadow: '0 12px 32px -16px rgba(0,0,0,0.18)',
                }}
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code as Language); setLangOpen(false); }}
                    style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 6,
                      background: l.code === lang ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.92rem',
                      color: 'var(--ink)',
                    }}
                  >
                    <span>{l.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--ink-soft)' }}>
                      {l.code.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle — ink-on-paper / paper-on-ink swatches */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32, height: 32,
              borderRadius: 999,
              border: '1px solid var(--paper-rule)',
              background: 'transparent',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {theme === 'dark' ? (
              <SunGlyph />
            ) : (
              <MoonGlyph />
            )}
          </button>

          {/* Primary action — take the test */}
          <Link href="/?quiz=1" className="btn btn-primary btn-sm" style={{ display: 'none' }} data-show-on-md>
            <span>{t.take_test}</span>
          </Link>
        </div>
      </div>
      <style jsx>{`
        @media (min-width: 480px) {
          :global([data-show-on-sm]) { display: inline !important; }
        }
        @media (min-width: 768px) {
          :global([data-show-on-md]) { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}

function SunGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
        <line key={d} x1="7" y1="0.5" x2="7" y2="2.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
          transform={`rotate(${d} 7 7)`} />
      ))}
    </svg>
  );
}

function MoonGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M11 8.5A4.5 4.5 0 1 1 5.5 3 3.7 3.7 0 0 0 11 8.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}
