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
        {/* 데스크톱에서는 폭 최대 430px 폰 프레임을 중앙에, 모바일에서는 화면 전체를 채운다.
            같은 마크업이라 데스크톱용 별도 레이아웃을 따로 만들지 않는다. */}
        <div className="flex min-h-dvh justify-center">
          <div className="min-h-dvh w-full max-w-[430px] bg-white pt-[env(safe-area-inset-top)] shadow-none sm:shadow-xl">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
