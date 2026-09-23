"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/app",
    label: "홈",
    icon: (
      <path
        d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: "/app/forecast",
    label: "예보",
    icon: (
      <path
        d="M17.5 19H7a4.5 4.5 0 0 1-1.4-8.8A5.5 5.5 0 0 1 16 9.1 4 4 0 0 1 17.5 19z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: "/app/log",
    label: "기록",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    href: "/app/me",
    label: "마이페이지",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 20a7 7 0 0 1 14 0" strokeLinecap="round" />
      </>
    ),
  },
];

// UI-SPEC.md 6장 탭바 규격: 높이 64+safe-area, 4열 균등, 아이콘 24(위 패딩 9),
// 라벨 12/16, 아이콘·라벨 간격 2, 활성=cobalt, 비활성=subtext, 배경 surface, 그림자 tabbar.
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
            className={`flex min-h-[44px] flex-col items-center gap-0.5 pt-[9px] text-tab ${
              active ? "text-cobalt" : "text-subtext"
            }`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              {tab.icon}
            </svg>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
