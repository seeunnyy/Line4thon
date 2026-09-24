import type { AmountPresetId } from "./model";

// 이벤트 시뮬레이션 엔진(룰 기반). 상수·공식은 docs/SIMULATION.md 2·4장만 쓴다 — 여기 없는 숫자를 추가하지 않는다.
// 외부 의존 없는 순수 함수라 tests/simulation.check.ts로 5장 검증 예시를 바로 확인할 수 있다.

export const KCAL_PER_KG_FAT = 7700;
export const PRESET_KCAL: Record<AmountPresetId, number> = { light: 650, normal: 1000, many: 2000 };
const ANCHOR_LOW = 650;
const ANCHOR_HIGH = 2000;
const GLYCOGEN_WATER_KG = [1.5, 2] as const; // 글리코겐+수분 총 변동
const SODIUM_FLUID_KG = [0, 2] as const; // 나트륨 세포외액 0~2L ≈ 0~2kg
const GUT_KG = [0.5, 1.0] as const; // 장내용물 500~1,000g
export const GUT_CLEAR_H = 48; // 장내용물 대표 해소 시점
export const WATER_CLEAR_H = 60; // 글리코겐+나트륨 대표 해소 시점
export const SPAN_H = 72; // 표시체중 전체 수렴 48~72시간의 상한

const lerp = ([low, high]: readonly [number, number], r: number) => low + r * (high - low);

// 4장 2: 강도 비율
export function intensityRatio(kcal: number): number {
  return Math.min(1, Math.max(0, (kcal - ANCHOR_LOW) / (ANCHOR_HIGH - ANCHOR_LOW)));
}

export interface Components {
  fatKg: number;
  gutStartKg: number;
  waterStartKg: number; // 글리코겐·수분 + 나트륨 세포외액(하나의 곡선)
}

// 4장 5: 표시체중_변화량(t)
export function displayedKg({ fatKg, gutStartKg, waterStartKg }: Components, t: number): number {
  return (
    fatKg +
    gutStartKg * Math.max(0, 1 - t / GUT_CLEAR_H) +
    waterStartKg * Math.max(0, 1 - t / WATER_CLEAR_H)
  );
}

export interface Simulation extends Components {
  kcal: number;
  displayedAt: (hours: number) => number; // 표시체중 변화량(kg)
}

export function simulate(kcal: number): Simulation {
  const r = intensityRatio(kcal);
  const c: Components = {
    fatKg: kcal / KCAL_PER_KG_FAT,
    gutStartKg: lerp(GUT_KG, r),
    waterStartKg: lerp(GLYCOGEN_WATER_KG, r) + lerp(SODIUM_FLUID_KG, r),
  };
  return { kcal, ...c, displayedAt: (t) => displayedKg(c, t) };
}

// 화면 문구용 "약 0.2kg" / "약 +1.7kg". 예보라 소수 첫째 자리까지만 쓴다(SIMULATION.md 6장).
export function kgLabel(kg: number, sign = false): string {
  const v = Math.round(kg * 10) / 10;
  return `약 ${sign ? "+" : ""}${v.toFixed(1)}kg`;
}

export function kcalLabel(kcal: number): string {
  return `약 ${Math.round(kcal).toLocaleString("ko-KR")}kcal`;
}
