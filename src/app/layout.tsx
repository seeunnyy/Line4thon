import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bodycast",
  description: "이벤트 대응형 다이어트 재도전 코치",
};

// 확대·축소는 막지 않는다 (maximumScale/userScalable 미지정).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-slate-100 text-ink antialiased">
        {/* 데스크톱에서는 390px 고정 폰 프레임, 모바일에서는 360~430px 유동.
            같은 마크업이라 데스크톱용 별도 레이아웃을 따로 만들지 않는다. */}
        <div className="flex min-h-dvh justify-center">
          <div
            data-spec="frame"
            className="relative min-h-dvh w-full max-w-[430px] bg-surface pt-[env(safe-area-inset-top)] sm:w-[390px] sm:shadow-xl"
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
