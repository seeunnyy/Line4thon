// 몽실이 레이아웃 상수. 세 가지 날씨 모습이 함께 쓰는 590×672 캔버스의 원본 픽셀이고, % 로 바꿔 쓴다.
// Mongsil(서버 컴포넌트)과 MongsilBody(클라이언트)가 같은 값을 쓰도록 한 곳에 둔다.
import type { CSSProperties } from "react";

export type MongsilWeather = "sunny" | "cloudy" | "rain";
export type Box = { x: number; y: number; w: number; h: number };

export const CANVAS = { w: 590, h: 672 } as const;
export const MONGSIL_ASPECT = CANVAS.w / CANVAS.h;

export const BODY: Record<MongsilWeather, Box> = {
  sunny: { x: 67, y: 145, w: 423, h: 523 },
  cloudy: { x: 67, y: 145, w: 422, h: 523 },
  rain: { x: 67, y: 34, w: 515, h: 634 },
};
export const SUN: Box = { x: 223, y: 8, w: 143, h: 142 };
export const CLOUD: Box = { x: 226, y: 24, w: 130, h: 100 };
// 소나기: 빗방울 5개(같은 스프라이트). delay는 떨어지는 타이밍을 어긋나게 한다.
export const DROP = { w: 30, h: 42 } as const;
export const DROPS = [
  { x: 534, y: 341, delay: "0s" },
  { x: 75, y: 125, delay: "0.5s" },
  { x: 63, y: 285, delay: "1.1s" },
  { x: 501, y: 249, delay: "0.8s" },
  { x: 172, y: 21, delay: "1.5s" },
] as const;
// 발 밑 그림자(캔버스 기준)
export const SHADOW: Box = { x: 88, y: 650, w: 380, h: 30 };

export const pctX = (v: number) => `${(v / CANVAS.w) * 100}%`;
export const pctY = (v: number) => `${(v / CANVAS.h) * 100}%`;

export function place(b: Box): CSSProperties {
  return { left: pctX(b.x), top: pctY(b.y), width: pctX(b.w), height: pctY(b.h) };
}
