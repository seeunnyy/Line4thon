import Icon, { type IconName } from "./Icon";

// 홈 히어로 하단 스탯 pill(2026-09-25 시안 실측): 흰색 pill(높이 40, 반경 full) 왼쪽에
// primary색 아이콘 배지(48, pill보다 커서 위아래로 살짝 튀어나온다)가 겹쳐 있고, 오른쪽에
// 굵은 값 한 줄 + 작은 회색 캡션 한 줄이 온다. 3개를 나란히 두는 용도라 폭은 내용에 맞춘다.
export default function StatPill({
  icon,
  value,
  caption,
  className = "",
}: {
  icon: IconName;
  value: string;
  caption: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex h-10 min-w-0 flex-1 items-center rounded-full bg-white pr-3 shadow-panel ${className}`}
    >
      <span className="-my-1.5 flex h-12 w-12 flex-none items-center justify-center rounded-full bg-primary text-white">
        <Icon name={icon} size={22} />
      </span>
      <div className="ml-2 min-w-0 leading-tight">
        <p className="truncate text-pill font-bold text-ink">{value}</p>
        <p className="truncate text-[11px] leading-[14px] text-subtext">{caption}</p>
      </div>
    </div>
  );
}
