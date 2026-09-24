// 앱 전체가 함께 쓰는 도메인 타입·라벨. 저장 모듈(storage.ts)·계산(simulation.ts)·화면이 모두 이 모양을 쓴다.

export type Weather = "sunny" | "cloudy" | "rain";

export const WEATHER_LABEL: Record<Weather, string> = {
  sunny: "맑음",
  cloudy: "흐림",
  rain: "소나기",
};

export const WEATHER_MOOD_LABEL: Record<Weather, string> = {
  sunny: "맑음 기류",
  cloudy: "흐림 기류",
  rain: "소나기 기류",
};

export type EventKind = "회식" | "여행" | "명절" | "시험기간";
export const EVENT_KINDS: readonly EventKind[] = ["회식", "여행", "명절", "시험기간"];

// 프리셋 kcal은 docs/SIMULATION.md 2장(650 / 1,000 / 2,000)만 쓴다.
export const AMOUNT_PRESETS = [
  { id: "light", label: "가볍게", kcal: 650 },
  { id: "normal", label: "보통", kcal: 1000 },
  { id: "many", label: "많이", kcal: 2000 },
] as const;
export type AmountPresetId = (typeof AMOUNT_PRESETS)[number]["id"];

export const TRIES = ["1차", "2차", "3차", "4차", "5차 이상"] as const;
export type Tries = (typeof TRIES)[number];

// ── 저장 대상(ARCHITECTURE.md "Data Storage", P0 5종) ─────────────

export interface Profile {
  nickname: string;
  tries: Tries;
  heightCm: number | null;
  weightKg: number | null;
}

// 몽실이는 하나(몸 고정)라 지금은 "온보딩에서 확인했다"는 표시만 둔다. 꾸미기 에셋이 생기면 여기에 붙인다.
export interface AvatarSettings {
  character: "mongsil";
}

export interface BodyEvent {
  id: string;
  kind: EventKind;
  date: string; // 첫날 YYYY-MM-DD(로컬)
  endDate: string; // 마지막 날. 하루 이벤트면 date와 같다
  kcal: number; // 기간 전체 초과 kcal 1건(SIMULATION.md 4장 6)
  preset: AmountPresetId | null; // 직접 입력이면 null
  createdAt: string;
}

// 시뮬레이션 결과(ARCHITECTURE.md: 전/후 가이드 포함). 계산값은 simulation.ts가, 문구는 coach.ts가 채운다.
export interface SimulationResult {
  eventId: string;
  kcal: number;
  fatKg: number;
  gutStartKg: number;
  waterStartKg: number;
  displayedKg: { h0: number; h24: number; h48: number; h72: number };
  guide: { before: string[]; after: string[] };
}

export type Bloat = "light" | "mid" | "heavy";
export type Energy = "good" | "low";

export interface CheckIn {
  id: string;
  eventId: string | null;
  date: string; // 체크인한 날 YYYY-MM-DD
  bloat: Bloat;
  energy: Energy;
  message: string; // 받은 코칭 메시지(템플릿 또는 LLM)
  createdAt: string;
}

// ── 화면 모양(주간 스트립·예보 결과 재생) ───────────────────────

export interface WeekDay {
  dow: string;
  date: string; // 일(day) 문자열
  weather: Weather;
  today?: boolean;
  event?: string;
}

export interface ForecastScene {
  id: string;
  day: number; // days 배열 인덱스(이벤트 장면은 이벤트 첫날). 7일 범위 밖이면 스트립에서 누를 수 없을 뿐 장면은 있다
  label: string; // 말풍선 위 작은 줄: "토요일 · 다음 날"
  weather: Weather; // 몽실이 모습·배경
  hours: number | null; // 이벤트 직후부터 지난 시간(그래프 재생 위치). 이벤트 전은 null
  line: string; // 말풍선 한 줄
  big: string | null; // 큰 숫자. 없으면 날씨 이름을 크게 쓴다
  note: string; // 큰 숫자 밑 한 줄
}

export interface ForecastStory {
  title: string;
  amount: string;
  days: WeekDay[]; // 날짜 스트립 7칸. 항상 "오늘 + 0~6일"
  event: { label: string; day: number; span: number }; // 여러 날 이벤트도 블록 하나(SIMULATION.md 4장 6)
  scenes: ForecastScene[];
}
