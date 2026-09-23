"use client";

import { useState } from "react";
import EventCard from "@/components/ui/EventCard";
import SegmentedTabs from "@/components/ui/SegmentedTabs";
import { EVENTS_PAST, EVENTS_UPCOMING } from "@/mocks/sample";

type Tab = "upcoming" | "past";

const OPTIONS = [
  { value: "upcoming", label: "다가오는 이벤트" },
  { value: "past", label: "지난 이벤트" },
] as const;

// 예보 목록: 다가오는/지난 이벤트 분할 탭 + 이벤트 카드 목록(샘플).
export default function ForecastList() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const items = tab === "upcoming" ? EVENTS_UPCOMING : EVENTS_PAST;

  return (
    <>
      <SegmentedTabs
        label="이벤트 보기"
        idBase="forecast"
        options={OPTIONS}
        value={tab}
        onChange={setTab}
        className="mt-6"
      />
      <div role="tabpanel" id="forecast-panel" aria-labelledby={`forecast-tab-${tab}`} className="mt-4">
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id}>
              <EventCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
