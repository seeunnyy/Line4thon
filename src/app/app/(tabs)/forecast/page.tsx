import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import ForecastList from "@/components/ForecastList";

type ForecastState = "default" | "empty";

// UI 시안용 미리보기 스위치(로직 구현 단계에서 지운다): ?state=default|empty
export default async function ForecastPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const sp = await searchParams;
  const state: ForecastState = sp.state === "empty" ? "empty" : "default";

  return (
    <>
      <Header variant="brand" />
      <main className="px-5 pb-6">
        <h1 className="mt-6 text-display font-bold">예보</h1>
        <p className="mt-2 text-body text-subtext">이벤트별로 몸의 흐름을 미리 살펴봐요.</p>

        {state === "default" ? (
          <>
            <Button size="lg" href="/app/event/new" icon className="mt-5">
              새 이벤트 예보 만들기
            </Button>
            <ForecastList />
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
