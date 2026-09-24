import Card from "./Card";
import Icon, { type IconName } from "./Icon";

type BarColor = "cobalt" | "primary" | "positive" | "accent";

const BAR_FILL: Record<BarColor, string> = {
  cobalt: "bg-cobalt",
  primary: "bg-primary",
  positive: "bg-positive",
  accent: "bg-accent",
};

// 홈 히어로 "오늘의 상태" 작은 카드. 아이콘(빈 박스 규칙) + 라벨 + 굵은 값 + 선택적 목표 캡션 + 선택적 진행바(4px).
// 진행바 채움색은 cobalt/primary/positive/accent 중에서만 고른다. 새 색을 추가하지 않는다.
export default function StatusStatCard({
  icon,
  label,
  value,
  caption,
  progress,
  barColor = "cobalt",
  className = "",
}: {
  icon: IconName;
  label: string;
  value: string;
  caption?: string;
  // 0~1. 없으면 진행바를 그리지 않는다.
  progress?: number;
  barColor?: BarColor;
  className?: string;
}) {
  const pct = progress === undefined ? undefined : Math.round(Math.min(Math.max(progress, 0), 1) * 100);

  return (
    <Card variant="tile" className={`text-left ${className}`}>
      <div className="flex items-center gap-1 text-body text-subtext">
        <Icon name={icon} size={16} />
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-1 truncate text-label font-bold text-ink">{value}</p>
      {caption && <p className="truncate text-body text-subtext">{caption}</p>}
      {pct !== undefined && (
        <div
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          className="mt-1 h-1 overflow-hidden rounded-full bg-line"
        >
          <div className={`h-full rounded-full ${BAR_FILL[barColor]}`} style={{ width: `${pct}%` }} />
        </div>
      )}
    </Card>
  );
}
