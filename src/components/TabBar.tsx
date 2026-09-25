"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 탭바 아이콘은 Icon.tsx의 선 아이콘과 달리 채워 그린다(시안이 그렇게 되어 있다). 여기서만 쓰는 모양이라
// Icon.tsx 레지스트리(24×24 선 아이콘 전용 계약)에는 넣지 않고 이 파일 안에 둔다.
const TABS = [
  {
    href: "/app",
    label: "홈",
    icon: <path d="M12 3.2 3.6 10.8A1 1 0 0 0 3 11.7V20a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1v-8.3a1 1 0 0 0-.6-.9z" />,
  },
  {
    href: "/app/forecast",
    label: "예보",
    icon: <path d="M17.5 19H7a4.5 4.5 0 0 1-1.4-8.8A5.5 5.5 0 0 1 16 9.1 4 4 0 0 1 17.5 19z" />,
  },
  {
    href: "/app/log",
    label: "기록",
    icon: (
      <path d="M12 3a9 9 0 1 0 9 9 1 1 0 0 0-2 0 7 7 0 1 1-7-7 1 1 0 0 0 0-2zm.75 4.5a.75.75 0 0 0-1.5 0V12c0 .27.12.52.33.68l3 2.25a.75.75 0 1 0 .9-1.2l-2.73-2.05z" />
    ),
  },
  {
    href: "/app/me",
    label: "내 설정",
    icon: <path d="M12 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM4 21a8 8 0 0 1 16 0 1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />,
  },
];

// UI-SPEC.md 6장 탭바 규격: 높이 64+safe-area, 4열 균등, 아이콘 24(위 패딩 9),
// 라벨 12/16, 아이콘·라벨 간격 2, 활성=sky(채운 아이콘), 비활성=subtext, 배경 surface, 그림자 tabbar
// (라벨 "내 설정"·채운 아이콘·활성색 sky는 2026-09-25 시안 실측).
export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky bottom-0 grid h-[calc(64px+env(safe-area-inset-bottom))] grid-cols-4 bg-surface pb-[env(safe-area-inset-bottom)] shadow-tabbar"
      aria-label="주요 화면 이동"
    >
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-[44px] flex-col items-center gap-0.5 pt-[9px] text-tab font-bold ${
              active ? "text-sky" : "text-subtext font-normal"
            }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {tab.icon}
            </svg>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
