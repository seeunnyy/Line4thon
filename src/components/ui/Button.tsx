"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import Icon from "./Icon";

type Size = "lg" | "md" | "sm";

interface ButtonProps {
  size?: Size;
  href?: string;
  disabled?: boolean;
  icon?: boolean; // lg 전용, 오른쪽 arrow-right(15px), 글자와 간격 20
  onClick?: MouseEventHandler;
  type?: "button" | "submit";
  children: ReactNode;
  className?: string;
  dataSpec?: string;
}

// 모든 버튼은 코발트 배경 + 흰 글자다. lg=56/pill28, md=44/pill, sm=보이는 pill 36(클릭영역 44).
const SIZE: Record<Size, string> = {
  lg: "h-14 w-full rounded-pill text-cta font-bold gap-5",
  md: "h-11 rounded-full text-[15px] leading-none font-bold px-5",
  sm: "h-9 rounded-full text-[14px] leading-none font-bold px-4",
};

export default function Button({
  size = "md",
  href,
  disabled = false,
  icon = false,
  onClick,
  type = "button",
  children,
  className = "",
  dataSpec,
}: ButtonProps) {
  const color = disabled
    ? "bg-line text-[#7B7F8C]"
    : "bg-cobalt text-white active:bg-cobalt-pressed";
  const shadow = size === "lg" && !disabled ? "shadow-md" : "";

  const classes = [
    "inline-flex items-center justify-center transition-colors motion-reduce:transition-none",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt",
    color,
    shadow,
    SIZE[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span>{children}</span>
      {size === "lg" && icon && <Icon name="arrow-right" size={15} />}
    </>
  );

  if (size === "sm") {
    // 보이는 pill은 36px(data-spec은 이 안쪽 span에), 클릭 영역은 바깥에서 44px로 확보한다.
    const hit = `inline-flex min-h-[44px] items-center justify-center ${disabled ? "pointer-events-none" : ""}`;
    return href ? (
      <Link href={href} className={hit} aria-disabled={disabled}>
        <span data-spec={dataSpec} className={classes}>
          {content}
        </span>
      </Link>
    ) : (
      <button type={type} onClick={onClick} disabled={disabled} className={hit}>
        <span data-spec={dataSpec} className={classes}>
          {content}
        </span>
      </button>
    );
  }

  return href ? (
    <Link href={href} data-spec={dataSpec} className={classes} aria-disabled={disabled}>
      {content}
    </Link>
  ) : (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-spec={dataSpec}
      className={classes}
    >
      {content}
    </button>
  );
}
