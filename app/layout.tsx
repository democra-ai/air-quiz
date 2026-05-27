import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';
import { Fraunces, Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import ThemeBootstrap from '@/components/shell/ThemeBootstrap';
import AnalyticsProvider from '@/components/shell/AnalyticsProvider';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  style: ['normal', 'italic'],
  axes: ['SOFT', 'WONK', 'opsz'],
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f2e8' },
    { media: '(prefers-color-scheme: dark)',  color: '#14110d' },
  ],
};

const META_TITLE  = 'AIR — The AI-Resistance Personality Test';
const META_DESC   = 'A 16-question personality test that maps your profession to one of 16 archetypes across four axes of AI resistance. Find out which kind of human AI cannot replace.';
const META_LANGS  = ['en', 'zh', 'ja', 'ko', 'de'];

async function resolveMetadataBaseFromHeaders() {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  if (!host) return process.env.NEXT_PUBLIC_BASE_URL || 'https://air.democra.ai';
  const proto = h.get('x-forwarded-proto') ?? (host.includes('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = new URL(await resolveMetadataBaseFromHeaders());
  return {
    metadataBase,
    title: { default: META_TITLE, template: '%s — AIR' },
    description: META_DESC,
    keywords: ['personality test', 'AI replacement', 'career test', '16 types', 'MBTI', 'archetype', 'AIR'],
    openGraph: {
      title: META_TITLE,
      description: META_DESC,
      siteName: 'AIR',
      type: 'website',
      url: metadataBase.toString(),
      locale: 'en_US',
      images: [{ url: '/share-card.png', width: 1200, height: 630, alt: 'AIR — The AI-Resistance Personality Test' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: META_TITLE,
      description: META_DESC,
      images: ['/share-card.png'],
    },
    robots: { index: true, follow: true },
    alternates: {
      languages: Object.fromEntries(META_LANGS.map((l) => [l, `${metadataBase.origin}/?lang=${l}`])),
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrumentSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Theme bootstrap — runs before paint to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('air-theme')||'light';document.documentElement.setAttribute('data-theme',t);if(t==='dark')document.documentElement.classList.add('dark');var l=localStorage.getItem('air-lang');if(l)document.documentElement.setAttribute('lang',l);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Quiz',
              name: 'AIR — AI-Resistance Personality Test',
              description: 'A 16-question quiz across 4 dimensions that maps your profession to one of 16 archetypes.',
              educationalLevel: 'professional',
              numberOfQuestions: 16,
              timeRequired: 'PT4M',
              inLanguage: META_LANGS,
            }),
          }}
        />
      </head>
      <body>
        <ThemeBootstrap />
        <AnalyticsProvider />
        {children}
      </body>
    </html>
  );
}
