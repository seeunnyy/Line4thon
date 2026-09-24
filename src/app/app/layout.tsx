"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isOnboarded, useStore } from "@/lib/storage";

// /app/* 공통 가드: 프로필·아바타가 없으면 정보 입력으로 보낸다(ARCHITECTURE.md 라우팅 규칙).
// 저장소는 브라우저에만 있어 서버 렌더에서는 아무것도 그리지 않고, 읽은 뒤에 화면을 보여준다.
export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const store = useStore();
  const ready = store !== null && isOnboarded(store);

  useEffect(() => {
    if (store !== null && !isOnboarded(store)) router.replace("/onboarding/profile");
  }, [store, router]);

  return ready ? children : null;
}
