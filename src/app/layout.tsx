import type { Metadata } from "next";
import { Inter, Noto_Sans_KR, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "개발자를 위한 스마트 생산성 추적기",
  description: "IDE별 코딩 시간부터 유튜브 콘텐츠 분석까지. 친구들과 리더보드 경쟁하며 생산성을 게임처럼 즐겨보세요.",
  keywords: ["생산성", "개발자", "IDE", "코딩", "시간추적", "리더보드", "GitHub", "노션"],
  authors: [{ name: "Productivity Tracker Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoSansKR.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
