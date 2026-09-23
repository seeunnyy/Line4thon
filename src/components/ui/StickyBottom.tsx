import type { ReactNode } from "react";

// 스크롤 화면 하단 고정 영역. 좌우 20, 위 12, 아래 24 + safe-area-inset-bottom.
export default function StickyBottom({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`sticky bottom-0 z-10 bg-surface px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-3 ${className}`}
    >
      {children}
    </div>
  );
}
