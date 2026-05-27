'use client';

/**
 * Renders the editorial illustration for a given profile code.
 *
 * Images live at /public/characters-art/{CODE}.webp — generated via Flux
 * with a locked editorial style anchor (warm cream paper + watercolor +
 * ink line, muted earthy palette). 512×512 source, ≈50 KB each.
 *
 * Uses a plain <img> (not next/image) because:
 *   1. Next image optimization is disabled on Cloudflare Workers runtime.
 *   2. The illustrations are already optimized WebPs sized for typical
 *      display widths (~360px on hero, ~120px in grid).
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
