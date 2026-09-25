import type { ReactNode } from "react";

export type BackdropWeather = "sunny" | "cloudy" | "rain";

// 날씨별 메시 그라데이션 배경. 값은 [가정]이고 무드 재현용이라 정확도 요구는 없다.
// (왼쪽 위 / 오른쪽 / 왼쪽 가운데 / 아래 가운데 네 곳에 색을 번지게 하고, 바탕색 위에 얹는다.)
const BACKDROP: Record<BackdropWeather, string> = {
  sunny: [
    "radial-gradient(70% 45% at 0% 0%, #BAD3FF 0%, rgba(186,211,255,0) 100%)",
    "radial-gradient(60% 45% at 100% 30%, #B3EDEA 0%, rgba(179,237,234,0) 100%)",
    "radial-gradient(55% 40% at 0% 60%, #D7E2FE 0%, rgba(215,226,254,0) 100%)",
    "radial-gradient(60% 40% at 60% 100%, #FCF0F1 0%, rgba(252,240,241,0) 100%)",
    "#F6F3FE",
  ].join(", "),
  cloudy: [
    "radial-gradient(70% 45% at 0% 0%, #C9D3E6 0%, rgba(201,211,230,0) 100%)",
    "radial-gradient(60% 45% at 100% 30%, #E4E7F0 0%, rgba(228,231,240,0) 100%)",
    "radial-gradient(55% 40% at 0% 60%, #DDE2EE 0%, rgba(221,226,238,0) 100%)",
    "radial-gradient(60% 40% at 60% 100%, #E4E7F0 0%, rgba(228,231,240,0) 100%)",
    "#F3F3F8",
  ].join(", "),
  rain: [
    "radial-gradient(70% 45% at 0% 0%, #9FB8E0 0%, rgba(159,184,224,0) 100%)",
    "radial-gradient(60% 45% at 100% 30%, #B8C6E6 0%, rgba(184,198,230,0) 100%)",
    "radial-gradient(55% 40% at 0% 60%, #C9D7F0 0%, rgba(201,215,240,0) 100%)",
    "radial-gradient(60% 40% at 60% 100%, #C9D7F0 0%, rgba(201,215,240,0) 100%)",
    "#EEF1FA",
  ].join(", "),
};

// 몽실이 뒤에 떠다니는 그라디언트 덩어리 3개(시안 2026-09-25 추가분). 흐림 배경 위에 primary/cobalt를
// 낮은 불투명도로 흐리게 얹고, 느리게 각자 다른 속도로 이동·확대되며 떠 있는 듯한 인상을 준다.
// 배경 장식일 뿐이라 aria-hidden이고, prefers-reduced-motion에서는 motion-safe: 접두사로 멈춘다.
function GradientBlobs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="absolute -left-20 top-4 h-64 w-64 rounded-full bg-primary/40 blur-3xl motion-safe:animate-blob-float-1" />
      <span className="absolute -right-24 top-[220px] h-72 w-72 rounded-full bg-cobalt/25 blur-3xl motion-safe:animate-blob-float-2" />
      <span className="absolute -left-28 top-[420px] h-80 w-80 rounded-full bg-primary/35 blur-3xl motion-safe:animate-blob-float-3" />
    </div>
  );
}

export default function HeroBackdrop({
  weather = "sunny",
  children,
  className = "",
}: {
  weather?: BackdropWeather;
  children?: ReactNode;
  className?: string;
}) {
  return (
    // min-h: 내용이 탭바 위 화면을 다 못 채워도(짧은 상태 등) 배경이 탭바 바로 위까지는 항상 이어지게 한다
    // (헤더 64 + 탭바 64 여유분을 뺀 값). 내용이 더 길면 자연스럽게 그만큼 늘어난다.
    <div
      className="relative min-h-[calc(100dvh-128px)] overflow-hidden"
      style={{ background: BACKDROP[weather] }}
    >
      <GradientBlobs />
      <div className={`relative ${className}`}>{children}</div>
    </div>
  );
}
