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
    <div className={className} style={{ background: BACKDROP[weather] }}>
      {children}
    </div>
  );
}
