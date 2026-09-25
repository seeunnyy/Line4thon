import type { ReactNode } from "react";
import Icon, { type IconName } from "./Icon";

// 섹션 제목: cobalt 배지(24×24, 반경 8) 안에 흰 아이콘 + 굵은 16px 글자, 간격 8, 높이 24.
// 배지는 아이콘 이름과 무관하게 항상 같은 모양이라, 어떤 페이지에서 어떤 아이콘을 넘겨도 같은 규칙이 적용된다
// (2026-09-25 시안 실측: "이번주 예보"·"다가오는 이벤트" 제목의 진한 파랑 사각 배지).
export default function SectionTitle({
  icon = "info",
  children,
  dataSpec,
}: {
  icon?: IconName;
  children: ReactNode;
  dataSpec?: string;
}) {
  return (
    <h2 data-spec={dataSpec} className="mt-[25px] flex h-6 items-center gap-2 text-heading font-bold">
      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-cobalt text-white">
        <Icon name={icon} size={14} />
      </span>
      <span>{children}</span>
    </h2>
  );
}
