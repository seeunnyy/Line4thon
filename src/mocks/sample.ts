// UI 시안용 샘플 데이터. 전부 "샘플"이며 실제 값이 아니다. 로직 구현 단계에서 저장 모듈 데이터로 교체한다.
// 숫자는 docs/SIMULATION.md에 있는 값(+1~2kg, 약 0.2kg, 650/1,000/2,000kcal, 48~72시간)만 쓴다.

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

export interface WeekDay {
  dow: string;
  date: string; // 일(day) 문자열. Date를 쓰지 않아 서버·클라이언트 불일치가 없다.
  weather: Weather;
  today?: boolean;
  event?: string;
}

// 샘플: 목 24(오늘·맑음) ~ 수 30. 금 25에 "회식".
export const WEEK_SAMPLE: WeekDay[] = [
  { dow: "목", date: "24", weather: "sunny", today: true },
  { dow: "금", date: "25", weather: "rain", event: "회식" },
  { dow: "토", date: "26", weather: "cloudy" },
  { dow: "일", date: "27", weather: "sunny" },
  { dow: "월", date: "28", weather: "sunny" },
  { dow: "화", date: "29", weather: "sunny" },
  { dow: "수", date: "30", weather: "cloudy" },
];

// 이벤트가 등록되지 않은 상태의 주간(이벤트 표시 없음).
export const WEEK_SAMPLE_EMPTY: WeekDay[] = WEEK_SAMPLE.map(({ event: _event, ...rest }) => rest);

// 홈 말풍선(오늘·이번 주 예보 한 줄). 실제로는 코드가 계산한 값을 LLM이 문구로 옮긴다(docs/LLM.md).
export const HOME_BUBBLE: Record<"default" | "ended" | "empty", Record<Weather, string>> = {
  default: {
    sunny: "이번 주 금요일 회식이 있어요. 오늘은 평소처럼 지내도 괜찮아요.",
    cloudy: "오늘은 흐린 흐름이에요. 무리하지 말고 평소 리듬을 지켜요.",
    rain: "소나기가 지나가는 날이에요. 숫자가 잠시 오르내려도 자연스러운 변동이에요.",
  },
  ended: {
    sunny: "지난 이벤트, 어땠나요? 가볍게 지금 상태를 체크해 봐요.",
    cloudy: "지난 이벤트, 어땠나요? 가볍게 지금 상태를 체크해 봐요.",
    rain: "지난 이벤트, 어땠나요? 가볍게 지금 상태를 체크해 봐요.",
  },
  empty: {
    sunny: "아직 등록된 이벤트가 없어요. 이벤트를 등록하면 예보를 보여드려요.",
    cloudy: "아직 등록된 이벤트가 없어요. 이벤트를 등록하면 예보를 보여드려요.",
    rain: "아직 등록된 이벤트가 없어요. 이벤트를 등록하면 예보를 보여드려요.",
  },
};

// 홈 히어로 "오늘의 상태" 카드(화면 시안용). 목표 수치는 docs/SIMULATION.md에 없는 값이라 전부 샘플이다.
// 활동은 걸음 수·목표 진행바 없이 한 일만 보여준다(DESIGN.md "수치 압박 요소" 제외 원칙).
export const HOME_STATUS = {
  condition: "좋음",
  calorie: { value: 1240, goal: 1800 },
  water: { value: 1.2, goal: 2.0 },
  activity: { value: "산책 30분" },
  meals: { done: 2, total: 3 },
  weightChange: { value: -0.4, period: "지난 7일" },
};

export const SAMPLE_EVENT = {
  id: "sample-1",
  type: "회식",
  title: "금요일 회식",
  dDay: "D-1",
  dateLabel: "9월 25일 금요일 · 저녁",
  summary: "다음 날 체중계에 약 +1~2kg 보일 수 있어요. 대부분 수분이라 며칠 안에 서서히 빠져요.",
} as const;

// ── 예보 목록 ─────────────────────────────────────────────

export type EventKind = "회식" | "여행" | "명절" | "시험기간";

export interface SampleEventItem {
  id: string;
  type: EventKind;
  title: string;
  dateLabel: string;
  badge: string;
  tone: "dday" | "done" | "pending";
  body: string;
}

export const EVENTS_UPCOMING: SampleEventItem[] = [
  {
    id: SAMPLE_EVENT.id,
    type: "회식",
    title: SAMPLE_EVENT.title,
    dateLabel: SAMPLE_EVENT.dateLabel,
    badge: SAMPLE_EVENT.dDay,
    tone: "dday",
    body: "다음 날 체중계에 약 +1~2kg 보일 수 있어요.",
  },
];

// 지난 이벤트 샘플. 체크인을 마친 것과 아직 안 한 것을 하나씩 둔다.
export const EVENTS_PAST: SampleEventItem[] = [
  {
    id: "sample-2",
    type: "회식",
    title: "지난주 회식",
    dateLabel: "9월 18일 금요일 · 저녁",
    badge: "체크인 완료",
    tone: "done",
    body: "체크인을 마쳤어요. 기록에서 다시 볼 수 있어요.",
  },
  {
    id: "sample-3",
    type: "여행",
    title: "제주 여행",
    dateLabel: "8월 · 여행",
    badge: "체크인 전",
    tone: "pending",
    body: "이벤트가 끝났어요. 지금 상태를 가볍게 체크해 봐요.",
  },
];

// ── 이벤트 등록 ───────────────────────────────────────────

export const EVENT_KINDS: readonly EventKind[] = ["회식", "여행", "명절", "시험기간"];

// 프리셋 kcal은 docs/SIMULATION.md 2장(650 / 1,000 / 2,000)만 쓴다.
export const AMOUNT_PRESETS = [
  { id: "light", label: "가볍게", kcal: "약 650kcal" },
  { id: "normal", label: "보통", kcal: "약 1,000kcal" },
  { id: "many", label: "많이", kcal: "약 2,000kcal" },
] as const;

export type AmountPresetId = (typeof AMOUNT_PRESETS)[number]["id"];

// ── 예보 결과 ─────────────────────────────────────────────

// 검증 예시(SIMULATION.md 5장): 회식 1회 +1,500kcal → 실제 지방 약 0.2kg, 다음 날 체중계 +1~2kg.
export const SIM_SAMPLE = {
  title: "금요일 회식",
  amount: "약 1,500kcal",
  displayed: "다음 날 +1~2kg",
  displayedNote: "대부분 수분과 장내용물이라 며칠 안에 서서히 빠져요.",
  fat: "약 0.2kg",
  fatNote: "이벤트가 끝나도 남는 실제 변화는 이 정도예요.",
  coach: "숫자에 놀라지 마세요. 대부분 시간이 지나면 자연스럽게 빠지는 수분이에요.",
  coachCaption: "48~72시간에 걸쳐 서서히 수렴해요",
} as const;

// 이중 그래프의 시점별 설명(샘플 곡선). 좌표는 DualGraph가 갖고, 문구만 여기 둔다.
export const GRAPH_POINTS = [
  { axis: "이벤트 직후", label: "이벤트 직후", text: "표시체중이 가장 높은 때예요" },
  { axis: "24시간", label: "다음 날", text: "체중계에 약 +1~2kg 보일 수 있어요" },
  { axis: "48시간", label: "이틀 뒤", text: "대부분 빠지고 실제 지방선에 가까워져요" },
  { axis: "72시간", label: "3일 뒤", text: "실제 지방선(약 0.2kg)에 수렴해요" },
] as const;

// 이벤트 전/후 대응 가이드 샘플. 실제로는 LLM이 계산값을 받아 문구로 옮긴다(docs/LLM.md).
export const GUIDE_SAMPLE = {
  before: [
    "그날도 평소처럼 식사해요",
    "단백질과 채소를 평소 식사에 곁들여요",
    "물은 평소만큼 마셔요",
  ],
  after: [
    "다음 끼니는 평소 식사로 이어가요",
    "수분이 빠질 때까지 하루이틀 지켜봐요",
    "체중은 7일 평균으로 함께 봐요",
  ],
} as const;

// ── 기록 ──────────────────────────────────────────────────

export interface LogItem {
  id: string;
  title: string;
  dateLabel: string;
  badge: string;
  tone: "upcoming" | "done" | "pending";
  href?: string;
}

// 이번 달 2건(예정 1 + 체크인 완료 1), 지난달 1건(체크인 전). "이벤트 대응 경험" 누적은 P2라 넣지 않는다.
export const LOG_SAMPLE: { label: string; items: LogItem[] }[] = [
  {
    label: "이번 달",
    items: [
      {
        id: "log-1",
        title: "금요일 회식",
        dateLabel: "9월 25일 금요일 · 저녁",
        badge: "예보 확인",
        tone: "upcoming",
        href: `/app/event/${SAMPLE_EVENT.id}/simulation`,
      },
      {
        id: "log-2",
        title: "지난주 회식",
        dateLabel: "9월 18일 금요일 · 저녁",
        badge: "체크인 완료",
        tone: "done",
      },
    ],
  },
  {
    label: "지난달",
    items: [
      {
        id: "log-3",
        title: "제주 여행",
        dateLabel: "8월 · 여행",
        badge: "체크인 전",
        tone: "pending",
        href: "/app/checkin",
      },
    ],
  },
];

// ── 마이페이지·아바타 꾸미기 ──────────────────────────────

export const PROFILE_SAMPLE = {
  nickname: "지은",
  tries: "3차 도전",
  info: "키 165cm · 체중은 입력하지 않았어요",
} as const;

// 몸 모양 옵션은 없다(몸은 고정). 카테고리는 얼굴·머리·색·표정·옷·소품만 다룬다.
export const AVATAR_CATEGORIES = ["얼굴형", "헤어", "피부톤", "표정", "의상", "소품"] as const;
export type AvatarCategory = (typeof AVATAR_CATEGORIES)[number];

// 피부톤 자리 표시 색(임의 값, 에셋 확정 전 플레이스홀더).
export const SKIN_TONES = ["#F6DCCB", "#EBC3A6", "#D8A585", "#B98060", "#8F5E40", "#5E3B2A"] as const;
