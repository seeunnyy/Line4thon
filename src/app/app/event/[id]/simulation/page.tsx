"use client";

import { useParams } from "next/navigation";
import Header from "@/components/ui/Header";
import SectionTitle from "@/components/ui/SectionTitle";
import Notice from "@/components/ui/Notice";
import StickyBottom from "@/components/ui/StickyBottom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import GuideTabs from "@/components/simulation/GuideTabs";
import WeekPlayer from "@/components/simulation/WeekPlayer";
import { buildStory, eventStatus } from "@/lib/forecast";
import { todayISO } from "@/lib/dates";
import { useStore } from "@/lib/storage";

// 예보 결과: 몽실이와 내 한 주를 미리 지나가 보는 화면. 등록 때 저장한 이벤트·시뮬레이션 결과로 그린다.
export default function SimulationResultPage() {
  const { id } = useParams<{ id: string }>();
  const store = useStore();
  if (!store) return null;

  const event = store.events.find((e) => e.id === id);
  const sim = event ? store.simulations[event.id] : undefined;
  const today = todayISO();

  if (!event || !sim) {
    return (
      <div className="flex min-h-dvh flex-col">
        <Header variant="back" backHref="/app/forecast" title="예보 결과" />
        <main className="flex-1 px-5 pb-6">
          <Card variant="round" className="mt-6">
            <EmptyState
              title="예보를 찾을 수 없어요"
              description="지워졌거나 다른 기기에서 만든 예보예요."
              action={
                <Button size="md" href="/app/event/new">
                  이벤트 예보 만들기
                </Button>
              }
            />
          </Card>
        </main>
      </div>
    );
  }

  const status = eventStatus(event, today, store.checkins);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header variant="back" backHref="/app/forecast" title="예보 결과" />

      <main className="flex-1 px-5 pb-6">
        <WeekPlayer story={buildStory(event, sim, today)} sim={sim} />

        <SectionTitle icon="heart">이벤트 대응 가이드</SectionTitle>
        <GuideTabs guide={sim.guide} />

        <Notice>예보는 참고용이에요. 몸의 이상 징후가 있을 때는 전문의와 상의하세요.</Notice>
      </main>

      <StickyBottom>
        {status === "done" ? (
          <Button href="/app/log" size="lg" icon>
            기록에서 보기
          </Button>
        ) : (
          <Button href={`/app/checkin?event=${event.id}`} size="lg" icon>
            {status === "pending" ? "지금 체크인하기" : "이벤트 끝나면 체크인하기"}
          </Button>
        )}
      </StickyBottom>
    </div>
  );
}
