'use client';

/**
 * Renders the abstract Open Peeps character for a given profile code.
 *
 * Uses the per-profession PEEPS_CONFIGS from lib/air_character_designs.ts —
 * each archetype already has a body pose, face expression, hair, and
 * accessory tuned to its profession (e.g. EOFP / Glass Cannon: Device pose
 * + Concerned face; ESFP / Taste Maker: PointingUp + Driven + GlassButterfly).
 *
 * The Open Peeps style is intentionally abstract — hand-drawn line work,
 * no rendered faces, instantly recognisable as a character but not photoreal.
 *
 * Stroke color flips with theme so the line art reads on either paper.
 */

import { useEffect, useState } from 'react';
import Peep from 'react-peeps';
import { PEEPS_CONFIGS } from '@/lib/air_character_designs';

function useStrokeColor(override?: string): string {
  const [color, setColor] = useState<string>(override ?? '#1f1814');
  useEffect(() => {
    if (override) return;
    const update = () => {
      const t = document.documentElement.getAttribute('data-theme');
      setColor(t === 'dark' ? '#f0e9dd' : '#1f1814');
    };
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, [override]);
  return color;
}

export default function ArchetypeSvg({
  code,
  size = 240,
  className,
  strokeColor,
}: {
  code: string;
  size?: number;
  className?: string;
  /** Override the line-art stroke color (defaults to theme-aware). */
  strokeColor?: string;
}) {
  const stroke = useStrokeColor(strokeColor);
  const config = PEEPS_CONFIGS[(code ?? '').toUpperCase()];
  if (!config) return null;
  return (
    <div
      className={className}
      style={{
        width: '100%',
        maxWidth: size,
        aspectRatio: '1 / 1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Peep
        body={config.body as never}
        face={config.face as never}
        hair={config.hair as never}
        accessory={(config.accessory || 'None') as never}
        facialHair={(config.facialHair || 'None') as never}
        strokeColor={stroke}
        viewBox={{ x: '0', y: '0', width: '1024', height: '1024' }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
