'use client';

import { useEffect, useState } from 'react';
import type { Language } from '@/lib/translations';
import { ui } from '@/lib/ui_text';

interface Props {
  lang: Language;
}

export default function CompletingScreen({ lang }: Props) {
  const t = ui(lang).completing;
  const phases = [t.phase_1, t.phase_2, t.phase_3];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % phases.length), 900);
    return () => clearInterval(id);
  }, [phases.length]);

  return (
    <div
      className="page-narrow"
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 24,
      }}
    >
      <div
        aria-hidden
        style={{
          width: 56, height: 56,
          borderRadius: 999,
          border: '1.5px solid var(--paper-rule)',
          borderTopColor: 'var(--accent)',
          animation: 'spin 1.1s linear infinite',
        }}
      />
      <p className="display-sm">{t.headline}</p>
      <p className="marginalia" style={{ minHeight: '1.2em' }}>{phases[i]}</p>
      <style>{`@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
