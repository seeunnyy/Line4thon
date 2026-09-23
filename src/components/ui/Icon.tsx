// 등록된 4개(arrow-right, chevron-left, chevron-right, close)만 실제 선을 그린다.
// 그 외 이름은 전부 크기만 유지한 빈 박스(에셋 자리 비움)로 렌더한다.
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
  | "user";

const REGISTERED: Partial<Record<IconName, React.ReactNode>> = {
  "arrow-right": (
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  "chevron-left": <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />,
  "chevron-right": <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />,
  close: <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" />,
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
