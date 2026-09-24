"use client";

import { useState } from "react";
import EventCard from "@/components/ui/EventCard";
import SegmentedTabs from "@/components/ui/SegmentedTabs";
import type { EventListItem } from "@/lib/forecast";

type Tab = "upcoming" | "past";

const OPTIONS = [
  { value: "upcoming", label: "다가오는 이벤트" },
  { value: "past", label: "지난 이벤트" },
] as const;

// 예보 목록: 다가오는/지난 이벤트 분할 탭 + 이벤트 카드 목록.
export default function ForecastList({
  upcoming,
  past,
}: {
  upcoming: EventListItem[];
  past: EventListItem[];
}) {
  const [tab, setTab] = useState<Tab>("upcoming");
  const items = tab === "upcoming" ? upcoming : past;

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
        {items.length === 0 && (
          <p className="py-6 text-center text-body text-subtext">
            {tab === "upcoming" ? "다가오는 이벤트가 없어요." : "아직 지난 이벤트가 없어요."}
          </p>
        )}
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
