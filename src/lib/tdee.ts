// 하루 권장 섭취 칼로리(TDEE) 계산. 상수·공식은 docs/SIMULATION.md 2-1·3-0·6장만 쓴다.
// 저장 모듈과 연결하지 않는 순수 함수다.

export type Sex = "female" | "male";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active";

export const SEX_OPTIONS: { id: Sex; label: string }[] = [
  { id: "female", label: "여성" },
  { id: "male", label: "남성" },
];

// 활동계수 4단계 (SIMULATION.md 2-1).
export const ACTIVITY_OPTIONS: { id: ActivityLevel; label: string; sub: string; factor: number }[] = [
  { id: "sedentary", label: "주로 앉아 있어요", sub: "운동은 거의 안 해요", factor: 1.2 },
  { id: "light", label: "가볍게 움직여요", sub: "가끔 걷거나 운동해요", factor: 1.375 },
  { id: "moderate", label: "꽤 움직여요", sub: "운동이 일상이에요", factor: 1.55 },
  { id: "active", label: "많이 움직여요", sub: "거의 매일 운동해요", factor: 1.725 },
];

const SEX_OFFSET: Record<Sex, number> = { male: 5, female: -161 };

export interface BodyInput {
  sex: Sex | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  activity: ActivityLevel | null;
}

// Mifflin-St Jeor BMR × 활동계수. 하나라도 비었으면 null(미계산, 대체값을 넣지 않는다).
export function calcTdee({ sex, age, heightCm, weightKg, activity }: BodyInput): number | null {
  if (sex === null || age === null || heightCm === null || weightKg === null || activity === null) {
    return null;
  }
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + SEX_OFFSET[sex];
  const factor = ACTIVITY_OPTIONS.find((a) => a.id === activity)!.factor;
  return bmr * factor;
}

// TDEE 표시: 소수일 때만 정수로 반올림, "약"은 붙이지 않는다 (SIMULATION.md 6장).
export function formatTdee(tdee: number): string {
  return `${Math.round(tdee).toLocaleString("ko-KR")}kcal`;
}

// 프리셋 비교율: 초과kcal ÷ TDEE × 100, 10% 단위 반올림 (SIMULATION.md 6장).
export function excessPercent(excessKcal: number, tdee: number): number {
  return Math.round((excessKcal / tdee) * 10) * 10;
}
