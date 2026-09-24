import Link from "next/link";
import Card from "./Card";
import Icon from "./Icon";
import StatusBadge from "./StatusBadge";
import type { EventListItem } from "@/lib/forecast";

// 예보 목록의 이벤트 카드. 카드 전체가 링크다(예정·완료 → 예보 결과, 체크인 전 → 체크인).
export default function EventCard({ item }: { item: EventListItem }) {
  return (
    <Link
      href={item.href}
      className="block rounded-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt"
    >
      <Card variant="round">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex h-6 items-center rounded-full border border-line px-2 text-body text-subtext">
            {item.type}
          </span>
          <StatusBadge tone={item.tone}>{item.badge}</StatusBadge>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-lead font-bold">{item.title}</p>
          <Icon name="chevron-right" size={16} className="text-subtext" />
        </div>
        <p className="mt-1 text-body text-subtext">{item.dateLabel}</p>
        {item.body && <p className="mt-3 text-body">{item.body}</p>}
      </Card>
    </Link>
  );
}
