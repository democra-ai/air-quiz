'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { CharacterProps } from '@/components/characters/CharacterBase';

const REGISTRY: Record<string, ComponentType<CharacterProps>> = {
  EOFP: dynamic(() => import('@/components/characters/CharEOFP')),
  EOFH: dynamic(() => import('@/components/characters/CharEOFH')),
  EORP: dynamic(() => import('@/components/characters/CharEORP')),
  EORH: dynamic(() => import('@/components/characters/CharEORH')),
  ESFP: dynamic(() => import('@/components/characters/CharESFP')),
  ESFH: dynamic(() => import('@/components/characters/CharESFH')),
  ESRP: dynamic(() => import('@/components/characters/CharESRP')),
  ESRH: dynamic(() => import('@/components/characters/CharESRH')),
  TOFP: dynamic(() => import('@/components/characters/CharTOFP')),
  TOFH: dynamic(() => import('@/components/characters/CharTOFH')),
  TORP: dynamic(() => import('@/components/characters/CharTORP')),
  TORH: dynamic(() => import('@/components/characters/CharTORH')),
  TSFP: dynamic(() => import('@/components/characters/CharTSFP')),
  TSFH: dynamic(() => import('@/components/characters/CharTSFH')),
  TSRP: dynamic(() => import('@/components/characters/CharTSRP')),
  TSRH: dynamic(() => import('@/components/characters/CharTSRH')),
};

/**
 * Render the SVG character illustration for a profile code.
 * Each character component is dynamically imported to keep the bundle lean —
 * only the matching glyph ships to a result/profile page.
 */
export default function ArchetypeSvg({
  code,
  size = 240,
  className,
}: {
  code: string;
  size?: number;
  className?: string;
}) {
  const C = REGISTRY[code?.toUpperCase?.()];
  if (!C) return null;
  return <C size={size} className={className} />;
}
