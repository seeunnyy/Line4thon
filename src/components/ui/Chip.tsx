"use client";

import Icon, { type IconName } from "./Icon";

type ChipSize = "tall" | "row" | "row-compact" | "stack";

interface ChipProps {
  size: ChipSize;
  selected: boolean;
  icon?: IconName;
  label: string;
  subLabel?: string;
  onClick?: () => void;
  dataSpec?: string;
  className?: string;
}

// 비선택 bg surface-low + subtext, 선택 bg cobalt + 흰 글자. 글자 12/18, 반경 0(폼 컨트롤 규칙).
export default function Chip({
  size,
  selected,
  icon,
  label,
  subLabel,
  onClick,
  dataSpec,
  className = "",
}: ChipProps) {
  const color = selected ? "bg-cobalt text-white" : "bg-surface-low text-subtext";

  if (size === "row-compact") {
    // 체크인 전용: 보이는 높이는 38px 그대로 두고(레이아웃 좌표 유지), 클릭 영역만
    // 위아래 3px씩 늘려 44px로 만든다(가상 요소). 세로로 이웃한 칩이 없어 히트 영역이 겹치지 않는다.
    return (
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={onClick}
        data-spec={dataSpec}
        data-touch-ok="hit area 44px via pseudo-element"
        className={`relative flex h-[38px] flex-1 items-center justify-center gap-1 text-body before:absolute before:-inset-y-[3px] before:inset-x-0 before:content-[''] ${color} ${className}`}
      >
        {icon && <Icon name={icon} size={16} />}
        {label}
      </button>
    );
  }

  if (size === "tall") {
    return (
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={onClick}
        data-spec={dataSpec}
        className={`flex h-[57px] flex-1 flex-col items-center gap-0 pt-[5px] text-body ${color} ${className}`}
      >
        {icon && <Icon name={icon} size={24} />}
        <span>{label}</span>
      </button>
    );
  }

  if (size === "row") {
    return (
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={onClick}
        data-spec={dataSpec}
        className={`flex h-11 flex-1 items-center justify-center gap-1 text-body ${color} ${className}`}
      >
        {icon && <Icon name={icon} size={16} />}
        {label}
      </button>
    );
  }

  // stack: 두 줄(라벨 13/18 bold + 보조 12/18)
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      data-spec={dataSpec}
      className={`flex h-16 flex-1 flex-col items-center justify-center gap-0 ${color} ${className}`}
    >
      <span className="text-label font-bold">{label}</span>
      {subLabel && <span className="text-body">{subLabel}</span>}
    </button>
  );
}
