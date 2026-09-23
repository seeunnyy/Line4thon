"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

// 바텀시트(확인 대화상자). 프레임 폭(390, 모바일은 최대 430)에 맞춘 고정 컨테이너 안에 뜬다.
// 접근성: role="dialog" aria-modal, 제목 연결, 열리면 첫 버튼에 포커스, Tab은 시트 안에서만 순환,
// ESC·배경 탭으로 닫기, 닫으면 열기 전 위치로 포커스 복귀, 열려 있는 동안 본문 스크롤 잠금.
// 모션은 motion-safe에서만(prefers-reduced-motion이면 바로 나타난다).
export default function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const trigger = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>("button, a[href]") ?? []);
    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const els = focusables();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      trigger?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 sm:w-[390px]">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 motion-safe:animate-fade-in"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-x-0 bottom-0 rounded-t-card bg-card px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-3 shadow-tabbar motion-safe:animate-sheet-up"
      >
        <div aria-hidden="true" className="mx-auto h-1 w-10 rounded-full bg-line" />
        <h2 id={titleId} className="mt-5 text-cta font-bold">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
