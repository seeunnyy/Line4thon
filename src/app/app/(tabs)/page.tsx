import Header from "@/components/ui/Header";
import HeroBackdrop from "@/components/ui/HeroBackdrop";
import SpeechBubble from "@/components/ui/SpeechBubble";
import Mongsil from "@/components/ui/Mongsil";
import WeatherPill from "@/components/ui/WeatherPill";
import SectionTitle from "@/components/ui/SectionTitle";
import WeekStrip from "@/components/ui/WeekStrip";
import EventSummaryCard from "@/components/ui/EventSummaryCard";
import EmptyState from "@/components/ui/EmptyState";
import Card from "@/components/ui/Card";
import SampleTag from "@/components/ui/SampleTag";
import Button from "@/components/ui/Button";
import StatusStatCard from "@/components/ui/StatusStatCard";
import Link from "next/link";
import {
  HOME_BUBBLE,
  HOME_STATUS,
  WEEK_SAMPLE,
  WEEK_SAMPLE_EMPTY,
  type Weather,
} from "@/mocks/sample";

type HomeState = "default" | "ended" | "empty";

// UI 시안용 미리보기 스위치(로직 구현 단계에서 지운다):
//   ?state=default|ended|empty  ?weather=sunny|cloudy|rain  ?motion=calm|lively(몽실이 움직임 크기, 기본 calm)
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; weather?: string; motion?: string }>;
}) {
  const sp = await searchParams;
  const state: HomeState = (["default", "ended", "empty"] as const).find((s) => s === sp.state) ?? "default";
  const weather: Weather = (["sunny", "cloudy", "rain"] as const).find((w) => w === sp.weather) ?? "sunny";
  // 오늘의 상태 카드와 함께 두는 히어로라 기본은 calm(작게). ?motion=lively로 크게 볼 수 있다.
  const motion = sp.motion === "lively" ? "lively" : "calm";
  const s = HOME_STATUS;

  return (
    <>
      <Header variant="brand" />
      <main>
        <h1 className="sr-only">Bodycast 홈</h1>

        {/* 히어로: 날씨에 따라 배경·pill 문구가 바뀐다 */}
        <HeroBackdrop weather={weather} className="px-5 pb-6 pt-5 text-center">
          <SpeechBubble icon="sun" label="오늘의 예보">
            {HOME_BUBBLE[state][weather]}
          </SpeechBubble>
          {/* 오늘의 상태: 왼쪽 3 | 몽실이 | 오른쪽 3. 폭 확보를 위해 몽실이는 calm + 190px */}
          <div className="mt-4 flex justify-end">
            <SampleTag />
          </div>
          <div className="mt-2 flex items-stretch gap-1.5">
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
              <StatusStatCard icon="heart" label="컨디션" value={s.condition} />
              <StatusStatCard
                icon="calorie"
                label="칼로리"
                value={`${s.calorie.value.toLocaleString()}kcal`}
                caption={`/ ${s.calorie.goal.toLocaleString()}`}
                progress={s.calorie.value / s.calorie.goal}
                barColor="cobalt"
              />
              <StatusStatCard
                icon="water"
                label="물 섭취량"
                value={`${s.water.value.toFixed(1)}L`}
                caption={`/ ${s.water.goal.toFixed(1)}L`}
                progress={s.water.value / s.water.goal}
                barColor="primary"
              />
            </div>
            <Mongsil weather={weather} height={190} motion={motion} className="self-center" />
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
              <StatusStatCard icon="activity" label="활동" value={s.activity.value} />
              <StatusStatCard
                icon="food"
                label="식단 기록"
                value={`${s.meals.done}/${s.meals.total}끼`}
                progress={s.meals.done / s.meals.total}
                barColor="positive"
              />
              <StatusStatCard
                icon="scale"
                label="체중 변화"
                value={`${s.weightChange.value > 0 ? "+" : ""}${s.weightChange.value}kg`}
                caption={s.weightChange.period}
              />
            </div>
          </div>
          {/* 맞춤 기록: 버튼이 아니라 칩 스타일(bg surface-low, 반경 0, 높이 44). 시안 단계라 기록 탭으로만 이동한다 */}
          <div className="mt-4 flex justify-center">
            <Link
              href="/app/log"
              className="inline-flex h-11 items-center justify-center bg-surface-low px-4 text-body text-subtext"
            >
              맞춤 기록
            </Link>
          </div>
          <div className="mt-4 flex justify-center">
            <WeatherPill weather={weather} />
          </div>
          <p className="mt-2 text-body text-subtext">일정과 컨디션을 바탕으로 한 예보예요</p>
        </HeroBackdrop>

        <div className="px-5 pb-6">
          <SectionTitle icon="calendar">이번 주 예보</SectionTitle>
          <WeekStrip days={state === "empty" ? WEEK_SAMPLE_EMPTY : WEEK_SAMPLE} className="mt-2" />

          {state === "default" && (
            <>
              <SectionTitle icon="calendar">다가오는 이벤트</SectionTitle>
              <EventSummaryCard className="mt-2" />
            </>
          )}

          {state === "ended" && (
            <>
              <SectionTitle icon="heart">이벤트 체크인</SectionTitle>
              <Card variant="round" className="mt-2">
                <div className="flex justify-end">
                  <SampleTag />
                </div>
                <p className="mt-1 text-lead font-bold">지난 이벤트, 어땠나요?</p>
                <p className="mt-2 text-body">
                  다시 시작해도 이전의 기록은 남아요. 지금 상태를 가볍게 체크해 봐요.
                </p>
                <Button size="md" href="/app/checkin" className="mt-4">
                  복귀 체크인 하기
                </Button>
              </Card>
            </>
          )}

          {state === "empty" && (
            <>
              <SectionTitle icon="calendar">다가오는 이벤트</SectionTitle>
              <Card variant="round" className="mt-2">
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
            </>
          )}
        </div>
      </main>
    </>
  );
}
