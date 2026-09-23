import Header from "@/components/ui/Header";
import Card from "@/components/ui/Card";
import CoachCard from "@/components/ui/CoachCard";
import SectionTitle from "@/components/ui/SectionTitle";
import SampleTag from "@/components/ui/SampleTag";
import Notice from "@/components/ui/Notice";
import StickyBottom from "@/components/ui/StickyBottom";
import Button from "@/components/ui/Button";
import DualGraph from "@/components/simulation/DualGraph";
import GuideTabs from "@/components/simulation/GuideTabs";
import { SIM_SAMPLE } from "@/mocks/sample";

// 예보 결과. 지금은 어떤 id로 열어도 같은 샘플을 보여준다(저장·계산 없음).
export default async function SimulationResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;

  return (
    <div className="flex min-h-dvh flex-col">
      <Header variant="back" backHref="/app/forecast" title="예보 결과" />

      <main className="flex-1 px-5 pb-6">
        <Card variant="round" className="mt-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-body text-subtext">
              {SIM_SAMPLE.title} · {SIM_SAMPLE.amount}
            </p>
            <SampleTag>직접 입력 샘플</SampleTag>
          </div>
          <p className="mt-3 text-body text-subtext">체중계에 보일 수 있는 숫자</p>
          <p className="text-hero-num font-bold">{SIM_SAMPLE.displayed}</p>
          <p className="mt-2 text-body">{SIM_SAMPLE.displayedNote}</p>
          <div className="mt-4 border-t border-line pt-4">
            <p className="text-lead font-bold text-positive">실제 지방은 {SIM_SAMPLE.fat}</p>
            <p className="mt-1 text-body text-subtext">{SIM_SAMPLE.fatNote}</p>
          </div>
        </Card>

        <CoachCard message={SIM_SAMPLE.coach} caption={SIM_SAMPLE.coachCaption} captionSize="body" />

        <SectionTitle icon="info">표시체중 vs 실제 지방</SectionTitle>
        <Card variant="panel" className="mt-2">
          <DualGraph />
        </Card>

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
