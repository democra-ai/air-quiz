/**
 * Client-side anonymous ID — replacement for Firebase anonymous auth.
 *
 * Firebase `signInAnonymously` existed mainly to satisfy Firestore security
 * rules (`allow create: if request.auth != null`). On Cloudflare the write
 * path is protected by server-side Turnstile + KV rate-limit, so all we need
 * client-side is a stable random identifier per browser.
 */

const KEY = 'air:anon_uid';

export function getAnonymousUid(): string {
  if (typeof window === 'undefined') return '';
  try {
    const existing = window.localStorage.getItem(KEY);
    if (existing) return existing;
    const uid = `anon_${crypto.randomUUID()}`;
    window.localStorage.setItem(KEY, uid);
    return uid;
  } catch {
    // localStorage blocked — fall back to session-scoped id
    return `anon_${crypto.randomUUID()}`;
  }
}
