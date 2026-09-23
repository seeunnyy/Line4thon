"use client";

import { useRef } from "react";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

// 두 개 이상의 패널을 번갈아 보여주는 분할 탭. role="tablist" + 각 버튼 role="tab" aria-selected.
// 좌우(위아래) 화살표로 이동하고, 선택된 탭만 tab 순서에 들어간다(roving tabindex).
// 패널은 쓰는 쪽에서 <div role="tabpanel" id={`${idBase}-panel`} aria-labelledby={`${idBase}-tab-${value}`}>로 감싼다.
// 버튼이 아니라 폼 컨트롤 계열이라 반경 0, 높이 44, 선택은 코발트 배경 + 흰 글자(Chip과 같은 규칙).
export default function SegmentedTabs<T extends string>({
  label,
  idBase,
  options,
  value,
  onChange,
  scrollable = false,
  className = "",
}: {
  label: string;
  idBase: string;
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  // true면 균등 분할 대신 가로 스크롤 한 줄(항목이 많을 때, 예: 아바타 꾸미기 카테고리)
  scrollable?: boolean;
  className?: string;
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const moveTo = (index: number) => {
    const next = options[(index + options.length) % options.length];
    onChange(next.value);
    refs.current[next.value]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      style={scrollable ? undefined : { gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      className={`gap-1 ${
        scrollable
          ? "flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "grid"
      } ${className}`}
    >
      {options.map((option, i) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(el) => {
              refs.current[option.value] = el;
            }}
            id={`${idBase}-tab-${option.value}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`${idBase}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                moveTo(i + 1);
              } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                moveTo(i - 1);
              } else if (e.key === "Home") {
                e.preventDefault();
                moveTo(0);
              } else if (e.key === "End") {
                e.preventDefault();
                moveTo(options.length - 1);
              }
            }}
            className={`h-11 text-label ${scrollable ? "flex-none whitespace-nowrap px-4" : ""} focus-visible:outline focus-visible:outline-2 ${
              scrollable ? "focus-visible:-outline-offset-2" : "focus-visible:outline-offset-2"
            } focus-visible:outline-cobalt ${
              selected ? "bg-cobalt font-bold text-white" : "bg-surface-low text-subtext"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
