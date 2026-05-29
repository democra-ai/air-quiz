import type { Metadata } from 'next';
import { Suspense } from 'react';
import MacroPage from './MacroPage';

export const metadata: Metadata = {
  title: 'The Macro Picture — AIR',
  description:
    'How fast AI is actually moving: the replacement progress bar, the timeline from steam to AGI, which jobs go first, and displacement vs creation.',
  openGraph: {
    title: 'The Macro Picture — AIR',
    description: 'AI replacement progress, the timeline from steam to AGI, and which jobs go first.',
  },
};

export default function Page() {
  return (
    <Suspense fallback={<main style={{ minHeight: '100dvh', background: 'var(--paper)' }} />}>
      <MacroPage />
    </Suspense>
  );
}
