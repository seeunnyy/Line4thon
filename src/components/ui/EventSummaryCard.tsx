import Button from "./Button";
import Card from "./Card";
import type { BodyEvent, SimulationResult } from "@/lib/model";
import { dDayLabel, eventDateLabel, eventTitle } from "@/lib/forecast";
import { eventSummary } from "@/lib/coach";

// 홈의 "다가오는 이벤트" 카드: D-day 배지 + 제목 + 날짜 + 한 줄 예보 + 상세 링크.
export default function EventSummaryCard({
  event,
  sim,
  today,
  className = "",
}: {
  event: BodyEvent;
  sim: SimulationResult;
  today: string;
  className?: string;
}) {
  return (
    <Card variant="round" className={className}>
      <span className="inline-flex h-6 items-center rounded-full bg-cobalt px-3 text-body font-bold text-white">
        {dDayLabel(event, today)}
      </span>
      <p className="mt-3 text-lead font-bold">{eventTitle(event)}</p>
      <p className="mt-1 text-body text-subtext">{eventDateLabel(event)}</p>
      <p className="mt-3 text-body">{eventSummary(sim)}</p>
      <Button size="md" href={`/app/event/${event.id}/simulation`} className="mt-4">
        예보 자세히 보기
      </Button>
    </Card>
  );
}
