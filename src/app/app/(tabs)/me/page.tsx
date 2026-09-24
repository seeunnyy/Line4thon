"use client";

import Header from "@/components/ui/Header";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";
import MenuRow from "@/components/ui/MenuRow";
import Notice from "@/components/ui/Notice";
import MeDataSection from "@/components/MeDataSection";
import { useStore } from "@/lib/storage";

// 마이페이지. 로그인·푸시 알림 항목은 없다(범위 밖). 프로필은 저장된 값을 보여준다.
export default function MyPage() {
  const store = useStore();
  if (!store?.profile) return null;
  const { nickname, tries, heightCm, weightKg } = store.profile;
  const info = [
    heightCm ? `키 ${heightCm}cm` : "키는 입력하지 않았어요",
    weightKg ? `체중 ${weightKg}kg` : "체중은 입력하지 않았어요",
  ].join(" · ");

  return (
    <>
      <Header variant="brand" />
      <main className="px-5 pb-6">
        <h1 className="mt-6 text-display font-bold">마이페이지</h1>

        <Card variant="round" className="mt-5">
          <div className="flex items-center gap-4">
            <Avatar size={64} />
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <p className="text-lead font-bold">{nickname}</p>
              <span className="inline-flex h-6 items-center rounded-full border border-line px-2 text-body text-subtext">
                {tries} 도전
              </span>
            </div>
          </div>
          <p className="mt-3 text-body text-subtext">{info}</p>
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
        <p className="mt-6 text-center text-body text-subtext">Bodycast · 데이터는 이 기기에만 저장돼요</p>
      </main>
    </>
  );
}
