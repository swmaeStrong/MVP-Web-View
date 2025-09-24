import { LanguageProvider } from '@/providers/LanguageProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { SentryProvider } from '@/providers/SentryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { getServerSettings } from '@/utils/server-cookies';
import type { Metadata } from 'next';
import { Inter, Noto_Sans_KR, Poppins } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Smart Productivity Tracker for Developers',
  description:
    'From IDE coding time to YouTube content analysis. Compete with friends on leaderboards and gamify your productivity.',
  keywords: [
    'productivity',
    'developer',
    'IDE',
    'coding',
    'time tracking',
    'leaderboard',
    'GitHub',
    'Notion',
  ],
  authors: [{ name: 'Productivity Tracker Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 서버에서 쿠키를 통해 테마, 언어, 컬러 설정 가져오기
  const { theme, locale, colors } = await getServerSettings();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${notoSansKR.variable} ${poppins.variable} ${theme === 'dark' ? 'dark' : ''}`}
      style={{
        // 서버사이드에서 즉시 CSS 변수 설정
        ['--main-color' as any]: colors.mainColor,
        ['--bg-color' as any]: colors.backgroundColor,
        ['--gradient-main' as any]: `linear-gradient(to right, ${colors.mainColor}, #2563eb)`,
        backgroundColor: colors.backgroundColor,
      }}
    >
      <head />
      <body
        className='antialiased'
        style={{
          backgroundColor: colors.backgroundColor
        }}
      >
        <SentryProvider>
          <ThemeProvider initialTheme={theme} initialColors={colors}>
            <LanguageProvider initialLocale={locale}>
              <QueryProvider>
                <ToastProvider>
                  <div className='min-h-screen bg-background text-foreground'>
                    <main className='transition-all duration-300'>
                      {children}
                    </main>
                  </div>
                </ToastProvider>
              </QueryProvider>
            </LanguageProvider>
          </ThemeProvider>
        </SentryProvider>
      </body>
    </html>
  );
}
