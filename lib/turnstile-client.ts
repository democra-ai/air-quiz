/**
 * Turnstile client helper — invisible-mode token fetch.
 *
 * Loads the Turnstile script on first use and returns a one-shot token for
 * the configured site key. Safe to call when Turnstile is disabled (no site
 * key set) — returns null.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement | string, opts: Record<string, unknown>) => string;
      execute: (widgetId: string, opts?: { action?: string }) => void;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('ssr'));
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('turnstile_script_failed'));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export function isTurnstileConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
}

export async function getTurnstileToken(action = 'quiz'): Promise<string | null> {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey || typeof window === 'undefined') return null;

  try {
    await loadScript();
    const container = document.createElement('div');
    container.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
    document.body.appendChild(container);

    return await new Promise<string | null>((resolve) => {
      if (!window.turnstile) return resolve(null);
      const id = window.turnstile.render(container, {
        sitekey: siteKey,
        action,
        size: 'invisible',
        callback: (token: string) => {
          resolve(token);
          setTimeout(() => {
            try { window.turnstile?.remove(id); container.remove(); } catch {}
          }, 0);
        },
        'error-callback': () => resolve(null),
        'timeout-callback': () => resolve(null),
      });
      // Some browsers need an explicit execute for invisible mode.
      try { window.turnstile.execute(id, { action }); } catch {}
    });
  } catch {
    return null;
  }
}
