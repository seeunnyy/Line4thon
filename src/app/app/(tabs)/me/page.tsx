import Header from "@/components/ui/Header";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import SampleTag from "@/components/ui/SampleTag";
import SectionTitle from "@/components/ui/SectionTitle";
import MenuRow from "@/components/ui/MenuRow";
import Notice from "@/components/ui/Notice";
import MeDataSection from "@/components/MeDataSection";
import { PROFILE_SAMPLE } from "@/mocks/sample";

// 마이페이지. 로그인·푸시 알림 항목은 없다(범위 밖). 프로필 값은 전부 샘플이다.
export default function MyPage() {
  return (
    <>
      <Header variant="brand" />
      <main className="px-5 pb-6">
        <h1 className="mt-6 text-display font-bold">마이페이지</h1>

        <Card variant="round" className="mt-5">
          <div className="flex items-center gap-4">
            <Avatar size={64} />
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <p className="text-lead font-bold">{PROFILE_SAMPLE.nickname}</p>
              <span className="inline-flex h-6 items-center rounded-full border border-line px-2 text-body text-subtext">
                {PROFILE_SAMPLE.tries}
              </span>
            </div>
            <SampleTag className="self-start" />
          </div>
          <p className="mt-3 text-body text-subtext">{PROFILE_SAMPLE.info}</p>
          <Button size="md" href="/onboarding/profile" className="mt-4">
            내 정보 수정하기
          </Button>
        </Card>

        <SectionTitle icon="user">꾸미기</SectionTitle>
        <Card variant="panel" className="mt-2">
          <MenuRow label="아바타 꾸미기" href="/app/me/avatar" />
        </Card>

        <MeDataSection />

        <Notice>예보는 참고용이에요. 몸의 이상 징후가 있을 때는 전문의와 상의하세요.</Notice>
        <p className="mt-6 text-center text-body text-subtext">Bodycast · 화면 시안 버전</p>
      </main>
    </>
  );
}
