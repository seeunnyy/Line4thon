import Button from "./Button";
import Card from "./Card";
import SampleTag from "./SampleTag";
import { SAMPLE_EVENT } from "@/mocks/sample";

// 홈의 "다가오는 이벤트" 카드(샘플): D-day 배지 + 제목 + 날짜 + 한 줄 예보 + 상세 링크.
export default function EventSummaryCard({ className = "" }: { className?: string }) {
  return (
    <Card variant="round" className={className}>
      <div className="flex items-center justify-between">
        <span className="inline-flex h-6 items-center rounded-full bg-cobalt px-3 text-body font-bold text-white">
          {SAMPLE_EVENT.dDay}
        </span>
        <SampleTag />
      </div>
      <p className="mt-3 text-lead font-bold">{SAMPLE_EVENT.title}</p>
      <p className="mt-1 text-body text-subtext">{SAMPLE_EVENT.dateLabel}</p>
      <p className="mt-3 text-body">{SAMPLE_EVENT.summary}</p>
      <Button size="md" href={`/app/event/${SAMPLE_EVENT.id}/simulation`} className="mt-4">
        예보 자세히 보기
      </Button>
    </Card>
  );
}
