import Link from "next/link";
import Card from "./Card";
import Icon from "./Icon";
import SampleTag from "./SampleTag";
import StatusBadge from "./StatusBadge";
import { SAMPLE_EVENT, type SampleEventItem } from "@/mocks/sample";

// 예보 목록의 이벤트 카드(샘플). 카드 전체가 결과 화면(샘플)으로 가는 링크다.
export default function EventCard({ item }: { item: SampleEventItem }) {
  return (
    <Link
      href={`/app/event/${SAMPLE_EVENT.id}/simulation`}
      className="block rounded-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt"
    >
      <Card variant="round">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex h-6 items-center rounded-full border border-line px-2 text-body text-subtext">
            {item.type}
          </span>
          <div className="flex items-center gap-1">
            <StatusBadge tone={item.tone}>{item.badge}</StatusBadge>
            <SampleTag />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-lead font-bold">{item.title}</p>
          <Icon name="chevron-right" size={16} className="text-subtext" />
        </div>
        <p className="mt-1 text-body text-subtext">{item.dateLabel}</p>
        <p className="mt-3 text-body">{item.body}</p>
      </Card>
    </Link>
  );
}
