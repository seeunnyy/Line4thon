import Header from "@/components/ui/Header";
import SectionTitle from "@/components/ui/SectionTitle";
import Notice from "@/components/ui/Notice";
import StickyBottom from "@/components/ui/StickyBottom";
import Button from "@/components/ui/Button";
import GuideTabs from "@/components/simulation/GuideTabs";
import WeekPlayer from "@/components/simulation/WeekPlayer";
import { STORY_SAMPLE, STORY_TRIP_SAMPLE } from "@/mocks/sample";

// 예보 결과: 몽실이와 내 한 주를 미리 지나가 보는 화면. 지금은 어떤 id로 열어도 같은 샘플을 보여준다(저장·계산 없음).
// UI 시안용 미리보기 스위치(로직 구현 단계에서 지운다):
//   ?event=trip(여러 날 이벤트 블록)  ?scene=0~4(처음 보여줄 장면)
export default async function SimulationResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ event?: string; scene?: string }>;
}) {
  await params;
  const sp = await searchParams;
  const story = sp.event === "trip" ? STORY_TRIP_SAMPLE : STORY_SAMPLE;
  const scene = Number.parseInt(sp.scene ?? "0", 10) || 0;

  return (
    <div className="flex min-h-dvh flex-col">
      <Header variant="back" backHref="/app/forecast" title="예보 결과" />

      <main className="flex-1 px-5 pb-6">
        <WeekPlayer story={story} initialScene={scene} />

        <SectionTitle icon="heart">이벤트 대응 가이드</SectionTitle>
        <GuideTabs />

        <Notice>예보는 참고용이에요. 몸의 이상 징후가 있을 때는 전문의와 상의하세요.</Notice>
      </main>

      <StickyBottom>
        <Button href="/app/checkin" size="lg" icon>
          이벤트 끝나면 체크인하기
        </Button>
      </StickyBottom>
    </div>
  );
}
