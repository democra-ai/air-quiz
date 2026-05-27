'use client';

import Link from 'next/link';
import { useLang } from './useLang';
import { ui } from '@/lib/ui_text';

export default function Footer() {
  const [lang] = useLang();
  const t = ui(lang).footer;

  return (
    <footer
      style={{
        marginTop: 'clamp(4rem, 10vw, 8rem)',
        borderTop: '1px solid var(--paper-rule)',
        background: 'var(--paper-deep)',
      }}
    >
      <div className="page" style={{ padding: 'clamp(3rem, 6vw, 5rem) var(--gutter)' }}>
        <div className="footer-grid">
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: '2.2rem',
                letterSpacing: '0.04em',
                color: 'var(--ink-strong)',
                fontVariationSettings: '"opsz" 108, "SOFT" 60, "WONK" 1',
                lineHeight: 1,
              }}
            >
              AIR
            </div>
            <p className="smallcaps" style={{ marginTop: 10 }}>
              {t.tagline}
            </p>
            <p
              style={{
                marginTop: 18,
                color: 'var(--ink-mute)',
                fontSize: '0.92rem',
                lineHeight: 1.55,
                maxWidth: 320,
              }}
            >
              {t.blurb}
            </p>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="smallcaps">{t.nav_heading}</span>
            <FooterLink href="/">{t.nav_home}</FooterLink>
            <FooterLink href="/?quiz=1">{t.nav_take}</FooterLink>
            <FooterLink href="/#archetypes">{t.nav_archetypes}</FooterLink>
            <FooterLink href="https://risk.democra.ai" external>{t.nav_macro}</FooterLink>
          </nav>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="smallcaps">{t.colophon_heading}</span>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-mute)', lineHeight: 1.55, maxWidth: 260 }}>
              {t.colophon_body}
            </p>
          </div>
        </div>

        <hr className="rule-h" style={{ marginTop: 'clamp(3rem, 5vw, 4rem)' }} />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem 2rem',
            justifyContent: 'space-between',
            paddingTop: 18,
            alignItems: 'center',
          }}
        >
          <span className="marginalia">
            {t.copy_notice.replace('{year}', String(new Date().getFullYear()))}
          </span>
          <span className="marginalia">{t.version_note}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) {
  const base: React.CSSProperties = {
    color: 'var(--ink)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    padding: '4px 0',
    borderBottom: '1px solid transparent',
    transition: 'border-color .15s ease, color .15s ease',
  };
  const enter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = 'var(--accent)';
    e.currentTarget.style.borderBottomColor = 'var(--accent)';
  };
  const leave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = 'var(--ink)';
    e.currentTarget.style.borderBottomColor = 'transparent';
  };
  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" style={base} onMouseEnter={enter} onMouseLeave={leave}>{children}</a>;
  }
  return <Link href={href} style={base} onMouseEnter={enter} onMouseLeave={leave}>{children}</Link>;
}
