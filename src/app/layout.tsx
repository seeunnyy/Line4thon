import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "다이어트 예보",
  description: "이벤트 대응형 다이어트 재도전 코치",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
