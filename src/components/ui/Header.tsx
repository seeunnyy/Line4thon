"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import Avatar from "./Avatar";
import Icon from "./Icon";

type HeaderProps =
  | { variant: "brand" }
  | {
      variant: "back";
      title?: string; // 가운데 제목(h1). center를 주면 center가 우선한다.
      center?: ReactNode; // 진행 점 같은 가운데 커스텀 요소
      backHref?: string; // 있으면 링크로 이동, 없으면 브라우저 뒤로가기
      right?: ReactNode; // 오른쪽 슬롯(예: 완료 버튼)
    };

// UI-SPEC.md 5장 header 그대로: 높이 64, sticky top.
// brand: 좌우 패딩 16, 타일·워드마크 간격 12, 워드마크 24px bold, 아바타 40 (2026-09-25 시안 실측).
// back: 44px 터치 영역 좌·우 슬롯 + 가운데 제목.
export default function Header(props: HeaderProps) {
  const router = useRouter();
  const base = "sticky top-0 z-10 h-16 bg-surface shadow-header";

  if (props.variant === "brand") {
    return (
      <header
        data-spec="header"
        className={`${base} flex items-center justify-between pl-4 pr-4`}
      >
        <div className="flex items-center gap-3">
          <div
            data-spec="tile"
            className="flex h-8 w-8 items-center justify-center rounded-tile bg-primary"
          >
            <Icon name="cloud" size={18} className="text-white" />
          </div>
          <span data-spec="wordmark" className="text-display font-bold">
            Bodycast
          </span>
        </div>
        <Avatar size={40} shadow dataSpec="avatar-h" />
      </header>
    );
  }

  const backClass = "flex h-11 w-11 items-center justify-center";

  return (
    <header
      data-spec="header"
      className={`${base} grid grid-cols-[1fr_auto_1fr] items-center px-3`}
    >
      <div className="flex justify-start">
        {props.backHref ? (
          <Link href={props.backHref} aria-label="뒤로" className={backClass}>
            <Icon name="chevron-left" size={24} />
          </Link>
        ) : (
          <button
            type="button"
            aria-label="뒤로"
            onClick={() => router.back()}
            className={backClass}
          >
            <Icon name="chevron-left" size={24} />
          </button>
        )}
      </div>
      <div className="flex items-center justify-center">
        {props.center ?? <h1 className="text-cta font-bold">{props.title}</h1>}
      </div>
      <div className="flex justify-end">{props.right}</div>
    </header>
  );
}
