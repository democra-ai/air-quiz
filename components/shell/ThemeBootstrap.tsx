'use client';

/**
 * Theme bootstrap runs entirely as the inline <script> in app/layout.tsx
 * before paint (defaults to light, restores user choice if saved).
 *
 * No system-preference fallback by design — the editorial palette is built
 * around the warm ivory paper and that's the default first experience.
 * Dark mode is opt-in via the nav toggle.
 */
export default function ThemeBootstrap() {
  return null;
}
