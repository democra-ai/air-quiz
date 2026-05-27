'use client';

import { useEffect } from 'react';
import {
  initAnalytics,
  trackScrollDepth,
  trackVisibilityChange,
  trackEngagementTime,
  trackUtmParams,
  trackExternalLink,
} from '@/lib/analytics';

/**
 * Client-only telemetry bootstrap. Light footprint: page view, scroll depth,
 * UTMs, external-link clicks, engagement on unload. Quiz events emit from
 * inside the quiz components themselves via trackQuiz* helpers.
 */
export default function AnalyticsProvider() {
  useEffect(() => { initAnalytics(); }, []);

  // Scroll depth (25/50/75/100)
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    const reached = new Set<number>();
    const onScroll = () => {
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      if (dh <= 0) return;
      const pct = Math.round((window.scrollY / dh) * 100);
      for (const m of milestones) {
        if (pct >= m && !reached.has(m)) { reached.add(m); trackScrollDepth(m); }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Engagement on unload
  useEffect(() => {
    const t0 = Date.now();
    const onUnload = () => trackEngagementTime(Math.round((Date.now() - t0) / 1000));
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, []);

  // Tab visibility
  useEffect(() => {
    const onChange = () => trackVisibilityChange(!document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  // UTM capture
  useEffect(() => {
    try {
      const u = new URL(window.location.href);
      const keys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'];
      const params: Record<string,string> = {};
      keys.forEach((k) => { const v = u.searchParams.get(k); if (v) params[k] = v; });
      trackUtmParams(params);
    } catch {}
  }, []);

  // External link delegation
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.href;
      if (href && !href.startsWith(window.location.origin) && !href.startsWith('#') && !href.startsWith('/')) {
        trackExternalLink(href, a.textContent?.trim().slice(0, 80) || '');
      }
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
