"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isOnboarded, useStore } from "@/lib/storage";

// 스플래시에서 프로필·아바타가 이미 있으면 홈으로 보낸다(ARCHITECTURE.md `/` 규칙).
export default function OnboardedRedirect() {
  const router = useRouter();
  const store = useStore();

  useEffect(() => {
    if (store !== null && isOnboarded(store)) router.replace("/app");
  }, [store, router]);

  return null;
}
