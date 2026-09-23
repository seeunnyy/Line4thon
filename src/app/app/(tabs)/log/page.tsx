import Header from "@/components/ui/Header";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Timeline from "@/components/ui/Timeline";
import { LOG_SAMPLE } from "@/mocks/sample";

// UI 시안용 미리보기 스위치(로직 구현 단계에서 지운다): ?state=default|empty
export default async function LogPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const sp = await searchParams;
  const empty = sp.state === "empty";

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
          <Timeline groups={LOG_SAMPLE} />
        )}
      </main>
    </>
  );
}
