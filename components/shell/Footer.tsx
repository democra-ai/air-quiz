'use client';

import Link from 'next/link';
import { useLang } from './useLang';
import { L, translations } from '@/lib/translations';

export default function Footer() {
  const [lang] = useLang();
  const t = translations[lang];
  const zh = lang === 'zh';

  return (
    <footer
      style={{
        marginTop: 'clamp(4rem, 10vw, 8rem)',
        borderTop: '1px solid var(--paper-rule)',
        background: 'var(--paper-deep)',
      }}
    >
      <div className="page" style={{ padding: 'clamp(3rem, 6vw, 5rem) var(--gutter)' }}>
        <div
          style={{
            display: 'grid',
            gap: 'clamp(2rem, 4vw, 4rem)',
            gridTemplateColumns: 'minmax(220px, 1fr) auto auto',
            alignItems: 'start',
          }}
        >
          {/* Masthead */}
          <div>
            <div className="italic-display" style={{ fontSize: '2rem', color: 'var(--ink-strong)' }}>
              air
            </div>
            <p className="smallcaps" style={{ marginTop: 6 }}>
              {zh ? 'AI 抗性人格测试' : 'AI-Resistance Personality Test'}
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
              {zh
                ? '一份 16 题的问卷，把你的职业映射到 16 个原型之一。基于 BLS、O*NET、Anthropic Economic Index。'
                : 'A 16-question survey mapping your profession to one of 16 archetypes. Built on BLS, O*NET, and the Anthropic Economic Index.'}
            </p>
          </div>

          {/* Navigation */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="smallcaps">{zh ? '导航' : 'Navigate'}</span>
            <FooterLink href="/">{zh ? '首页' : 'Home'}</FooterLink>
            <FooterLink href="/?quiz=1">{zh ? '开始测试' : 'Take the test'}</FooterLink>
            <FooterLink href="/#types">{zh ? '16 种类型' : '16 archetypes'}</FooterLink>
            <FooterLink href="https://risk.democra.ai" external>
              {zh ? '宏观报告 →' : 'Macro report →'}
            </FooterLink>
          </nav>

          {/* Colophon */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="smallcaps">{zh ? '关于' : 'Colophon'}</span>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-mute)', lineHeight: 1.55, maxWidth: 260 }}>
              {zh
                ? '排版采用 Fraunces 与 Instrument Sans。由 Democra AI 设计与制作。'
                : 'Set in Fraunces and Instrument Sans. Designed and engineered by Democra AI.'}
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
            © {new Date().getFullYear()} Democra · MIT License
          </span>
          <span className="marginalia">
            v0.1 · {zh ? '编辑实验性版本' : 'Editorial preview'}
          </span>
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
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={base}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderBottomColor = 'var(--accent)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.borderBottomColor = 'transparent'; }}
      >{children}</a>
    );
  }
  return (
    <Link href={href} style={base}
      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent)'; (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'var(--accent)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink)'; (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'transparent'; }}
    >{children}</Link>
  );
}
