'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ArchetypeSvg from './ArchetypeSvg';
import { PROFILE_TYPES } from '@/lib/air_quiz_data';
import { L, type Language } from '@/lib/translations';

interface Props {
  lang: Language;
  /** Optional list of profile codes to cycle through. Defaults to all 16. */
  codes?: string[];
  /** Initial code; falls back to the first in `codes`. */
  initialCode?: string;
}

/**
 * Hero archetype carousel.
 *
 * Lets the visitor flip through all 16 archetypes on the homepage hero,
 * via:
 *   • prev/next chevron buttons (always visible)
 *   • ←/→ keyboard arrows (when not typing)
 *   • horizontal touch swipe (>40 px threshold)
 *   • clicking the image area also advances (mobile-friendly)
 *
 * The illustration crossfades; the caption (archetype name / code / "n / N")
 * updates in sync.
 */
export default function HeroCarousel({ lang, codes: codesProp, initialCode }: Props) {
  const codes = useMemo(() => codesProp ?? Object.keys(PROFILE_TYPES), [codesProp]);

  // Start on a random archetype so reloads aren't always the same face.
  const [idx, setIdx] = useState<number>(() => {
    if (initialCode) {
      const found = codes.indexOf(initialCode.toUpperCase());
      if (found >= 0) return found;
    }
    return 0;
  });

  useEffect(() => {
    // Randomize on mount (after hydration to avoid SSR/CSR mismatch)
    if (!initialCode) {
      setIdx(Math.floor(Math.random() * codes.length));
    }
  }, [initialCode, codes.length]);

  const goPrev = useCallback(() => setIdx((i) => (i - 1 + codes.length) % codes.length), [codes.length]);
  const goNext = useCallback(() => setIdx((i) => (i + 1) % codes.length), [codes.length]);

  // Keyboard ←/→
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea/contenteditable
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goPrev, goNext]);

  // Touch swipe
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return; // tap, not swipe — let click handler run
    if (dx > 0) goPrev();
    else goNext();
  };

  const code = codes[idx];
  const profile = PROFILE_TYPES[code];
  if (!profile) return null;

  return (
    <div style={{ position: 'relative', maxWidth: 380, width: '100%', marginInline: 'auto' }}>
      {/* Soft warm radial backdrop */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: '-15%',
          background: `radial-gradient(circle at 50% 45%, color-mix(in srgb, ${profile.color} 22%, transparent), transparent 65%)`,
          filter: 'blur(8px)',
          zIndex: 0,
          transition: 'background .4s ease',
        }}
      />

      {/* Position pill */}
      <div
        style={{
          position: 'absolute',
          top: 0, right: 4, zIndex: 2,
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'var(--paper)',
          border: '1px solid var(--paper-rule)',
          padding: '6px 12px', borderRadius: 999,
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
          letterSpacing: '0.18em', color: 'var(--ink-mute)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: 999, background: profile.color, transition: 'background .3s ease' }} />
        <span>{String(idx + 1).padStart(2, '0')} / {String(codes.length).padStart(2, '0')}</span>
      </div>

      {/* Image with click-to-advance + swipe */}
      <button
        type="button"
        onClick={goNext}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-label={`Next archetype (currently ${code})`}
        style={{
          position: 'relative',
          zIndex: 1,
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'block',
          width: '100%',
          touchAction: 'pan-y',
        }}
      >
        {/* Keyed by code so React swaps the <img> instead of mutating — gives a clean crossfade */}
        <div key={code} className="animate-fade-in" style={{ animationDuration: '350ms' }}>
          <ArchetypeSvg code={code} size={360} />
        </div>
      </button>

      {/* Caption */}
      <div key={`cap-${code}`} className="animate-fade-in" style={{ textAlign: 'center', marginTop: 8, animationDuration: '350ms' }}>
        <p className="italic-display" style={{ fontSize: '1.45rem', color: 'var(--ink-strong)' }}>
          {L(profile.archetype, lang)}
        </p>
        <p className="smallcaps" style={{ marginTop: 4 }}>{code}</p>
      </div>

      {/* Prev / Next chevrons */}
      <button
        type="button"
        onClick={goPrev}
        aria-label="Previous archetype"
        className="hero-chevron hero-chevron--prev"
      >
        <Chevron dir="left" />
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="Next archetype"
        className="hero-chevron hero-chevron--next"
      >
        <Chevron dir="right" />
      </button>

      <style jsx>{`
        .hero-chevron {
          position: absolute;
          top: 42%;
          transform: translateY(-50%);
          z-index: 3;
          width: 40px;
          height: 40px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--paper) 85%, transparent);
          border: 1px solid var(--paper-rule);
          color: var(--ink);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background .18s ease, border-color .18s ease, transform .12s ease;
          padding: 0;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .hero-chevron:hover {
          background: var(--paper);
          border-color: var(--ink);
        }
        .hero-chevron:active { transform: translateY(-50%) scale(0.94); }
        .hero-chevron--prev { left: -8px; }
        .hero-chevron--next { right: -8px; }

        @media (max-width: 760px) {
          .hero-chevron { width: 36px; height: 36px; top: 38%; }
          .hero-chevron--prev { left: -4px; }
          .hero-chevron--next { right: -4px; }
        }
      `}</style>
    </div>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d={dir === 'left' ? 'M9 2 L4 7 L9 12' : 'M5 2 L10 7 L5 12'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
