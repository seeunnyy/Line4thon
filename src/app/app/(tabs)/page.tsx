"use client";

import Header from "@/components/ui/Header";
import HeroBackdrop from "@/components/ui/HeroBackdrop";
import SpeechBubble from "@/components/ui/SpeechBubble";
import Mongsil from "@/components/ui/Mongsil";
import SectionTitle from "@/components/ui/SectionTitle";
import WeekStrip from "@/components/ui/WeekStrip";
import EventSummaryCard from "@/components/ui/EventSummaryCard";
import EmptyState from "@/components/ui/EmptyState";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatPill from "@/components/ui/StatPill";
import type { IconName } from "@/components/ui/Icon";
import { HOME_STATUS } from "@/mocks/sample";
import { homeBubble, type HomeState } from "@/lib/coach";
import { todayISO } from "@/lib/dates";
import type { Weather } from "@/lib/model";
import {
  buildWeek,
  pendingCheckinEvent,
  upcomingEvents,
  weatherOn,
  whenLabel,
} from "@/lib/forecast";
import { useStore } from "@/lib/storage";

const BUBBLE_ICON: Record<Weather, IconName> = { sunny: "sun", cloudy: "cloud", rain: "rain" };

// 홈. 저장된 이벤트·체크인으로 오늘의 날씨·말풍선·주간 스트립·카드를 정한다.
// 우선순위: 체크인할 지난 이벤트(ended) → 다가오는 이벤트(default) → 없음(empty).
export default function HomePage() {
  const store = useStore();
  if (!store) return null;

  const today = todayISO();
  const upcoming = upcomingEvents(store.events, today)[0] ?? null;
  const upcomingSim = upcoming ? store.simulations[upcoming.id] : undefined;
  const pending = pendingCheckinEvent(store.events, store.checkins, today);
  const state: HomeState = pending ? "ended" : upcoming ? "default" : "empty";
  const weather = weatherOn(today, store.events);
  // 오늘의 상태 카드와 함께 두는 히어로라 몽실이는 calm(작게)으로 둔다.
  const motion = "calm";
  // 오늘의 상태 카드는 이 앱이 아직 모으지 않는 값이라(저장 대상 8종 밖) 샘플로 남겨 둔다.
  const s = HOME_STATUS;

  return (
    <>
      <Header variant="brand" />
      {/* 히어로부터 하단까지 배경(날씨 그라디언트 + 떠다니는 블롭)이 페이지 끝까지 이어진다(2026-09-25 시안 실측) */}
      <HeroBackdrop weather={weather}>
        <main>
          <h1 className="sr-only">Bodycast 홈</h1>

          <div className="px-5 pb-6 pt-5 text-center">
            <SpeechBubble icon={BUBBLE_ICON[weather]} label="오늘의 예보">
              {homeBubble(state, weather, upcoming ? { event: upcoming, when: whenLabel(upcoming, today) } : null)}
            </SpeechBubble>
            <Mongsil weather={weather} height={190} motion={motion} className="mx-auto mt-2" />
            {/* 오늘의 상태 3종: 칼로리·걸음·체중 변화. 저장 대상 8종 밖이라 샘플로 남겨 둔다 */}
            <div className="mt-4 flex items-center gap-3.5">
              <StatPill icon="calorie" value={`${s.calorie.value.toLocaleString()}Kcal`} caption={`/ ${s.calorie.goal.toLocaleString()}`} />
              <StatPill icon="steps" value={`${s.steps.value}`} caption="오늘의 걸음" />
              <StatPill
                icon="scale"
                value={`${s.weightChange.value > 0 ? "+" : ""}${s.weightChange.value}kg`}
                caption={s.weightChange.period}
              />
            </div>
          </div>

          <div className="px-5 pb-6">
            <SectionTitle icon="cloud">이번주 예보</SectionTitle>
            <WeekStrip days={buildWeek(today, store.events)} className="mt-2" />

            {pending && (
              <>
                <SectionTitle icon="heart">이벤트 체크인</SectionTitle>
                <Card variant="round" className="mt-2">
                  <p className="text-lead font-bold">지난 이벤트, 어땠나요?</p>
                  <p className="mt-2 text-body">
                    다시 시작해도 이전의 기록은 남아요. 지금 상태를 가볍게 체크해 봐요.
                  </p>
                  <Button size="md" href={`/app/checkin?event=${pending.id}`} className="mt-4">
                    복귀 체크인 하기
                  </Button>
                </Card>
              </>
            )}

            {upcoming && upcomingSim && (
              <>
                <SectionTitle icon="calendar">다가오는 이벤트</SectionTitle>
                <EventSummaryCard event={upcoming} sim={upcomingSim} today={today} className="mt-2" />
              </>
            )}

            {!upcoming && (
              <>
                <SectionTitle icon="calendar">다가오는 이벤트</SectionTitle>
                <Card variant="round" className="mt-2">
                  <EmptyState
                    title="아직 등록된 이벤트가 없어요"
                    description="평소보다 많이 먹을 날을 미리 등록하면 일주일 몸무게 변화를 예측해드려요."
                    action={
                      <Button size="lg" fullWidth={false} href="/app/event/new">
                        이벤트 등록하기
                      </Button>
                    }
                  />
                </Card>
              </>
            )}
          </div>
        </main>
      </HeroBackdrop>
    </>
  );
}
