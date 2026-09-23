import Button from "@/components/ui/Button";
import HeroBackdrop from "@/components/ui/HeroBackdrop";
import StickyBottom from "@/components/ui/StickyBottom";

// 스플래시: 맑음 그라데이션 배경 + 로고 타일 + 워드마크 + 한 줄 소개, 하단 고정 "시작하기".
export default function SplashPage() {
  return (
    <HeroBackdrop weather="sunny" className="flex min-h-dvh flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-5 text-center">
        <div aria-hidden="true" className="h-[72px] w-[72px] rounded-[27px] bg-primary" />
        <h1 className="mt-6 text-hero-num font-bold">Bodycast</h1>
        <p className="mt-3 text-lead text-subtext">
          일정이 있는 날의 몸무게를 미리 예보해드려요
        </p>
      </main>

      <StickyBottom className="!bg-transparent">
        <p className="mb-3 text-center text-body text-subtext">
          다시 시작해도 지난 과정은 기록으로 남아요
        </p>
        <Button href="/onboarding/profile" size="lg" icon>
          시작하기
        </Button>
      </StickyBottom>
    </HeroBackdrop>
  );
}
