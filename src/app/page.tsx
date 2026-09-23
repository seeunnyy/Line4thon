import Link from "next/link";

export default function SplashPage() {
  return (
    <main className="flex min-h-dvh flex-col px-6">
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <p className="text-2xl font-semibold text-primary">Bodycast</p>
        <p className="text-subtext">일정이 있는 날의 몸무게를 미리 예보해드려요</p>
      </div>

      <Link
        href="/onboarding/profile"
        className="mb-[calc(1.5rem+env(safe-area-inset-bottom))] block w-full rounded-full bg-primary py-4 text-center font-medium text-on-brand"
      >
        시작하기
      </Link>
    </main>
  );
}
