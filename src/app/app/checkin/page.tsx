"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import CoachCard from "@/components/ui/CoachCard";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";
import ChipGroup from "@/components/ui/ChipGroup";
import Chip from "@/components/ui/Chip";
import Notice from "@/components/ui/Notice";
import Button from "@/components/ui/Button";
import TextLink from "@/components/ui/TextLink";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";

const BLOAT_OPTIONS: { key: string; label: string; icon: IconName }[] = [
  { key: "light", label: "가벼움", icon: "bloat-light" },
  { key: "mid", label: "약간 부음", icon: "bloat-mid" },
  { key: "heavy", label: "묵직함", icon: "bloat-heavy" },
];

const ENERGY_OPTIONS: { key: string; label: string; icon: IconName }[] = [
  { key: "good", label: "개운함", icon: "energy-good" },
  { key: "low", label: "피곤함", icon: "energy-low" },
];

// 이 화면은 (tabs) 그룹 밖이라 탭바가 없다 (DESIGN.md "하위 흐름에서는 숨김" 규칙).
// 수치·저장·API는 없다. 칩 선택 상태만 useState로 보여준다.
export default function CheckinPage() {
  const [bloat, setBloat] = useState("mid"); // 처음 선택: 약간 부음
  const [energy, setEnergy] = useState("low"); // 처음 선택: 피곤함

  return (
    <>
      <Header variant="brand" />
      <main className="px-5 pb-[calc(24px+env(safe-area-inset-bottom))]">
        <h1 data-spec="h1" className="mt-2 text-display font-bold">
          이벤트가 끝났나요?
          <br />
          복귀 체크인
        </h1>

        <p data-spec="sub" className="mt-3 text-body text-subtext">
          하루 일탈은 전체의 실패가 아니에요.
          <br />
          다시 시작해도 이전의 기록은 고스란히 남아있어요.
        </p>

        <CoachCard
          dataSpec={{
            root: "coach",
            avatar: "coach-avatar",
            bubble: "bubble",
            bubbleText: "bubble-text",
            caption: "caption",
          }}
          captionIcon="water"
          caption="체수분은 하루나 이틀 내에 서서히 걷혀요"
          message={
            <>
              “어제 맛있는 시간 보내셨나요?
              <br />
              숫자에 놀라지 마세요, 지금은
              <br />
              수분이 잠시 머물러 있는 자연스러운 소나기 시간이에요!”
            </>
          }
        />

        <SectionTitle icon="info" dataSpec="section">
          현재 몸 상태 자가 체크
        </SectionTitle>

        <Card variant="panel" dataSpec="panel" className="mt-2 pb-4 pl-4 pr-[25px] pt-4">
          <div
            data-spec="label-1"
            className="mb-2 flex h-5 items-center gap-[3px] text-label text-subtext"
          >
            <Icon name="bloat-mid" size={12} />
            <span>체감 붓기 정도</span>
          </div>
          <ChipGroup label="체감 붓기 정도">
            {BLOAT_OPTIONS.map((opt, i) => (
              <Chip
                key={opt.key}
                size="tall"
                icon={opt.icon}
                label={opt.label}
                selected={bloat === opt.key}
                onClick={() => setBloat(opt.key)}
                dataSpec={`chip-1-${i + 1}`}
              />
            ))}
          </ChipGroup>

          <div className="h-3" aria-hidden="true" />

          <div
            data-spec="label-2"
            className="mb-2 flex h-5 items-center gap-[3px] text-label text-subtext"
          >
            <Icon name="sleep" size={14} />
            <span>수면 및 에너지 상태</span>
          </div>
          <ChipGroup label="수면 및 에너지 상태">
            {ENERGY_OPTIONS.map((opt, i) => (
              <Chip
                key={opt.key}
                size="row-compact"
                icon={opt.icon}
                label={opt.label}
                selected={energy === opt.key}
                onClick={() => setEnergy(opt.key)}
                dataSpec={`chip-2-${i + 1}`}
              />
            ))}
          </ChipGroup>
        </Card>

        <Notice dataSpec="notice" textDataSpec="notice-text">
          Bodycast의 복귀 가이드는 일상적인 자기돌봄 및 행동 완충 가이드이며, 전문 의사나
          영양사의 의학적 진단 및 처방을 대신하지 않습니다. 몸의 이상 징후가 있을 때는
          전문의와 상의하세요.
        </Notice>

        <Button size="lg" href="/app" icon dataSpec="cta" className="mt-6">
          체크인 완료하기
        </Button>

        <TextLink href="/app" dataSpec="link" className="mt-px">
          홈 예보로 바로 건너뛰기
        </TextLink>
      </main>
    </>
  );
}
