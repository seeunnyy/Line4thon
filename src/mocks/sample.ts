// 아직 저장 모듈에 대응하는 데이터가 없는 화면의 샘플 값만 남긴다. 쓰는 화면에는 "샘플" 표시를 붙인다.
// 이벤트·시뮬레이션·체크인·프로필은 저장 모듈(src/lib/storage.ts) 데이터로 교체됐다.

// 홈 히어로 하단 스탯 pill(화면 시안용). 목표 수치는 docs/SIMULATION.md에 없는 값이라 전부 샘플이다.
// 활동은 걸음 수·목표 진행바 없이 한 일만 보여준다(DESIGN.md "수치 압박 요소" 제외 원칙).
export const HOME_STATUS = {
  condition: "좋음",
  calorie: { value: 1240, goal: 1800 },
  water: { value: 1.2, goal: 2.0 },
  steps: { value: 207 },
  activity: { value: "산책 30분" },
  meals: { done: 2, total: 3 },
  weightChange: { value: -0.4, period: "지난 7일보다" },
};

// ── 아바타 꾸미기(P2, 에셋 없음) ─────────────────────────

// 몸 모양 옵션은 없다(몸은 고정). 카테고리는 얼굴·머리·색·표정·옷·소품만 다룬다.
export const AVATAR_CATEGORIES = ["얼굴형", "헤어", "피부톤", "표정", "의상", "소품"] as const;
export type AvatarCategory = (typeof AVATAR_CATEGORIES)[number];

// 피부톤 자리 표시 색(임의 값, 에셋 확정 전 플레이스홀더).
export const SKIN_TONES = ["#F6DCCB", "#EBC3A6", "#D8A585", "#B98060", "#8F5E40", "#5E3B2A"] as const;
