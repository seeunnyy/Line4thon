"use client";

import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import ForecastList from "@/components/ForecastList";
import { todayISO } from "@/lib/dates";
import { eventListItem, pastEvents, upcomingEvents } from "@/lib/forecast";
import type { BodyEvent } from "@/lib/model";
import { useStore } from "@/lib/storage";

// 예보 탭: 저장된 이벤트를 다가오는/지난 이벤트로 나눠 보여준다. 이벤트가 하나도 없으면 빈 상태.
export default function ForecastPage() {
  const store = useStore();
  if (!store) return null;
  const today = todayISO();
  const item = (e: BodyEvent) => eventListItem(e, store.simulations[e.id], today, store.checkins);

  return (
    <>
      <Header variant="brand" />
      <main className="px-5 pb-6">
        <h1 className="mt-6 text-display font-bold">예보</h1>
        <p className="mt-2 text-body text-subtext">이벤트별로 몸의 흐름을 미리 살펴봐요.</p>

        {store.events.length > 0 ? (
          <>
            <Button size="lg" href="/app/event/new" icon className="mt-5">
              새 이벤트 예보 만들기
            </Button>
            <ForecastList
              upcoming={upcomingEvents(store.events, today).map(item)}
              past={pastEvents(store.events, today).map(item)}
            />
          </>
        ) : (
          <Card variant="round" className="mt-6">
            <EmptyState
              title="아직 등록된 이벤트가 없어요"
              description="이벤트를 등록하면 예보를 보여드려요."
              action={
                <Button size="md" href="/app/event/new">
                  이벤트 예보 만들기
                </Button>
              }
            />
          </Card>
        )}
      </main>
    </>
  );
}
