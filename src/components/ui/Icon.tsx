// 24×24 선 아이콘: stroke=currentColor, 굵기 2, 끝·모서리 round, 채움 없음(탭바 아이콘과 같은 스타일).
// 12~14px에서도 읽히도록 선 몇 개로만 그린다. REGISTERED에 없는 이름은 크기만 유지한 빈 박스로 렌더한다.
export type IconName =
  | "arrow-right"
  | "chevron-left"
  | "chevron-right"
  | "close"
  | "water"
  | "heart"
  | "info"
  | "sleep"
  | "bloat-light"
  | "bloat-mid"
  | "bloat-heavy"
  | "energy-good"
  | "energy-low"
  | "sun"
  | "cloud"
  | "rain"
  | "calendar"
  | "food"
  | "trip"
  | "holiday"
  | "exam"
  | "clock"
  | "user"
  | "calorie"
  | "activity"
  | "scale";

const ROUND = { strokeLinecap: "round", strokeLinejoin: "round" } as const;
// 탭바 "예보"와 같은 구름 윤곽. rain은 이걸 줄여 위로 올리고 빗줄기를 단다.
const CLOUD = "M17.5 19H7a4.5 4.5 0 0 1-1.4-8.8A5.5 5.5 0 0 1 16 9.1 4 4 0 0 1 17.5 19z";

const REGISTERED: Partial<Record<IconName, React.ReactNode>> = {
  "arrow-right": (
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  "chevron-left": <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />,
  "chevron-right": <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />,
  close: <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" />,

  // 날씨
  sun: (
    <g {...ROUND}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </g>
  ),
  cloud: <path {...ROUND} d={CLOUD} />,
  rain: (
    <g {...ROUND}>
      <path d={CLOUD} transform="translate(2.4 -1.6) scale(0.8)" vectorEffect="non-scaling-stroke" />
      <path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3" />
    </g>
  ),

  // 오늘의 상태·기록
  water: <path {...ROUND} d="M12 3s-6 6.5-6 11a6 6 0 0 0 12 0c0-4.5-6-11-6-11z" />,
  heart: (
    <path
      {...ROUND}
      d="M12 20s-7-4.4-8.5-8.5C2.3 8 4.5 5 7.5 5c1.9 0 3.4 1 4.5 2.6C13.1 6 14.6 5 16.5 5c3 0 5.2 3 4 6.5C19 15.6 12 20 12 20z"
    />
  ),
  calorie: (
    <path
      {...ROUND}
      d="M12 3c1 3.5 5 5.5 5 10.5a5 5 0 0 1-10 0c0-2.5 1.2-4 2.5-5 .2 1.8 1 2.8 2 3.2C11 9 11.2 6 12 3z"
    />
  ),
  activity: <path {...ROUND} d="M3 12h4l2.5-6 5 12 2.5-6h4" />,
  scale: (
    <g {...ROUND}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 10a4 4 0 0 1 8 0M12 10l1.5-2.5" />
    </g>
  ),
  food: <path {...ROUND} d="M6 3v6a2 2 0 0 0 4 0V3M8 3v18M17 21V3c-2 1.5-3 4-3 7v3h3" />,

  // 일정·안내
  info: (
    <g {...ROUND}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </g>
  ),
  calendar: (
    <g {...ROUND}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </g>
  ),
  // 시계·사람은 탭바의 "기록"·"마이페이지"와 같은 모양
  clock: (
    <g {...ROUND}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </g>
  ),
  user: (
    <g {...ROUND}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </g>
  ),

  // 이벤트 종류: 회식=food, 여행=캐리어, 명절=선물 상자, 시험기간=문서
  trip: (
    <g {...ROUND}>
      <rect x="4" y="7" width="16" height="13" rx="2" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M9 11v5M15 11v5" />
    </g>
  ),
  holiday: (
    <g {...ROUND}>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M12 8v13" />
      <path d="M12 8C10.5 5 7.5 4.5 7.5 6.5S10 8 12 8zM12 8c1.5-3 4.5-3.5 4.5-1.5S14 8 12 8z" />
    </g>
  ),
  exam: (
    <g {...ROUND}>
      <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" />
      <path d="M14 3v5h5M8 13h8M8 17h5" />
    </g>
  ),

  // 체크인: 수면·에너지(배터리 칸 수), 붓기(몸통 폭 · 옆구리 호 · 바닥선. 색이 아니라 모양으로 단계를 나눈다)
  // light=좁은 캡슐, mid=타원 + 호, heavy=넓은 원 + 호 + 바닥선(무게감)
  sleep: <path {...ROUND} d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  "energy-good": (
    <g {...ROUND}>
      <rect x="2" y="7" width="17" height="10" rx="2" />
      <path d="M22 11v2M6 10v4M10 10v4M14 10v4" />
    </g>
  ),
  "energy-low": (
    <g {...ROUND}>
      <rect x="2" y="7" width="17" height="10" rx="2" />
      <path d="M22 11v2M6 10v4" />
    </g>
  ),
  "bloat-light": <rect {...ROUND} x="9" y="4" width="6" height="16" rx="3" />,
  "bloat-mid": (
    <g {...ROUND}>
      <ellipse cx="12" cy="12" rx="5" ry="8" />
      <path d="M4 9q-1.5 3 0 6M20 9q1.5 3 0 6" />
    </g>
  ),
  "bloat-heavy": (
    <g {...ROUND}>
      <ellipse cx="12" cy="11" rx="7" ry="7" />
      <path d="M2.5 8.5q-1.5 2.5 0 5M21.5 8.5q1.5 2.5 0 5M4 21.5h16" />
    </g>
  ),
};

export default function Icon({
  name,
  size = 24,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const path = REGISTERED[name];

  if (!path) {
    return (
      <span
        aria-hidden="true"
        className={`inline-block flex-none ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      className={`flex-none ${className}`}
    >
      {path}
    </svg>
  );
}
