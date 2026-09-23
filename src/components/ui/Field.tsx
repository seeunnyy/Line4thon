"use client";

import { useId } from "react";
import type { ChangeEventHandler, HTMLInputTypeAttribute } from "react";

// 입력창: 높이 52, 배경 surface-low, 반경 0(폼 컨트롤 규칙), 글자 16px(iOS 자동 확대 방지),
// focus는 코발트 2px 아웃라인. 라벨과 입력은 htmlFor/id로 연결한다.
export default function Field({
  label,
  optional = false,
  unit,
  helper,
  value,
  onChange,
  type = "text",
  inputMode,
  maxLength,
  min,
  placeholder,
  className = "",
}: {
  label: string;
  optional?: boolean;
  unit?: string;
  helper?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  type?: HTMLInputTypeAttribute;
  inputMode?: "numeric" | "decimal" | "text";
  maxLength?: number;
  min?: string;
  placeholder?: string;
  className?: string;
}) {
  const id = useId();
  const helperId = `${id}-helper`;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-label text-subtext">
        {label}
        {optional && <span className="ml-1">(선택)</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          maxLength={maxLength}
          min={min}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-describedby={helper ? helperId : undefined}
          className={`h-[52px] w-full bg-surface-low px-4 text-[16px] leading-6 text-ink placeholder:text-subtext/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cobalt ${
            unit ? "pr-12" : ""
          } ${type === "date" ? "text-left [&::-webkit-date-and-time-value]:text-left" : ""}`}
        />
        {unit && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-label text-subtext"
          >
            {unit}
          </span>
        )}
      </div>
      {helper && (
        <p id={helperId} className="mt-2 text-body text-subtext">
          {helper}
        </p>
      )}
    </div>
  );
}
