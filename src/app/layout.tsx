import { QueryProvider } from '@/providers/QueryProvider';
import { SentryProvider } from '@/providers/SentryProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={`${inter.variable} ${notoSansKR.variable} ${poppins.variable}`}
    >
      <body className='font-sans antialiased'>
        <SentryProvider>
          <ThemeProvider>
            <QueryProvider>
              <ToastProvider>
                <div className='min-h-screen bg-background text-foreground'>
                  <main className='transition-all duration-300'>
                    {children}
                  </main>
                </div>
              </ToastProvider>
            </QueryProvider>
          </ThemeProvider>
        </SentryProvider>
      </body>
    </html>
  );
}
