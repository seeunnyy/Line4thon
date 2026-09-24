"use client";

import Header from "@/components/ui/Header";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Timeline, { type TimelineGroup } from "@/components/ui/Timeline";
import { monthLabel, todayISO } from "@/lib/dates";
import { eventListItem } from "@/lib/forecast";
import { useStore } from "@/lib/storage";

// 기록 탭(P1): 저장된 이벤트를 최근 것부터 달별로 묶는다. 예정은 "예보 확인", 끝난 것은 체크인 여부로 배지를 단다.
export default function LogPage() {
  const store = useStore();
  if (!store) return null;
  const today = todayISO();
  const empty = store.events.length === 0;

  const groups: TimelineGroup[] = [];
  for (const e of [...store.events].sort((a, b) => b.date.localeCompare(a.date))) {
    const it = eventListItem(e, store.simulations[e.id], today, store.checkins);
    const label = monthLabel(e.date);
    let group = groups.find((g) => g.label === label);
    if (!group) {
      group = { label, items: [] };
      groups.push(group);
    }
    group.items.push({
      id: it.id,
      title: it.title,
      dateLabel: it.dateLabel,
      badge: it.tone === "dday" ? "예보 확인" : it.badge,
      tone: it.tone === "dday" ? "upcoming" : it.tone,
      href: it.href,
    });
  }

  return (
    <>
      <Header variant="brand" />
      <main className="px-5 pb-6">
        <h1 className="mt-6 text-display font-bold">기록</h1>
        <p className="mt-2 text-body text-subtext">다시 시작해도 지난 과정은 기록으로 남아요.</p>

        <Card variant="round" className="mt-5 flex items-center gap-4">
          <Avatar size={48} />
          <div className="min-w-0">
            <p className="text-lead font-bold">한 번 더 시작해도 괜찮아요</p>
            <p className="mt-1 text-body text-subtext">
              지난 과정은 그대로 남고, 새 기록이 그 위에 이어져요.
            </p>
          </div>
        </Card>

        {empty ? (
          <Card variant="round" className="mt-6">
            <EmptyState
              title="아직 기록이 없어요"
              description="이벤트를 등록하고 체크인하면 여기에 쌓여요."
              action={
                <Button size="md" href="/app/event/new">
                  이벤트 예보 만들기
                </Button>
              }
            />
          </Card>
        ) : (
          <Timeline groups={groups} />
        )}
      </main>
    </>
  );
}
