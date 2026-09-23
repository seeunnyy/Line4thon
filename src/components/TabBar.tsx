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

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="flex border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]"
      aria-label="주요 화면 이동"
    >
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 py-2"
            aria-current={active ? "page" : undefined}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={active ? "text-primary" : "text-subtext"}
              aria-hidden="true"
            >
              {tab.icon}
            </svg>
            <span
              className={`text-xs ${active ? "font-medium text-primary" : "text-subtext"}`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
