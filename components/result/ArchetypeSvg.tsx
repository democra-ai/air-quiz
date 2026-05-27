'use client';

/**
 * Renders the abstract symbolic watercolor for a given profile code.
 *
 * Source: 16 hand-crafted Flux compositions following the metaphors in
 * /Users/tao.shen/jobless/marketing/character-prompts.md — translucent glass
 * torso filled with code, scissor-hands cleaving chaos, figure cocooned by
 * concentric shield rings, etc. Watercolor + ink on warm cream paper,
 * earthy palette (ivory/terracotta/sage/umber). 512×512 source, ~50 KB.
 *
 * Plain <img>: Next image optimization is disabled on Cloudflare Workers
 * runtime, and the WebPs are already sized for typical display widths
 * (~360 px on hero, ~110 px in grid).
 */

const KNOWN = new Set([
  'EOFP', 'EOFH', 'EORP', 'EORH',
  'ESFP', 'ESFH', 'ESRP', 'ESRH',
  'TOFP', 'TOFH', 'TORP', 'TORH',
  'TSFP', 'TSFH', 'TSRP', 'TSRH',
]);

export default function ArchetypeSvg({
  code,
  size = 240,
  className,
  alt,
}: {
  code: string;
  size?: number;
  className?: string;
  alt?: string;
}) {
  const upper = (code ?? '').toUpperCase();
  if (!KNOWN.has(upper)) return null;
  return (
    <img
      src={`/characters-art/${upper}.webp`}
      alt={alt ?? `${upper} archetype illustration`}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      style={{
        width: '100%',
        maxWidth: size,
        height: 'auto',
        aspectRatio: '1 / 1',
        display: 'block',
        objectFit: 'cover',
        borderRadius: 12,
      }}
      className={className}
    />
  );
}
