"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import ProgressDots from "@/components/ui/ProgressDots";
import Field from "@/components/ui/Field";
import ChipGroup from "@/components/ui/ChipGroup";
import Chip from "@/components/ui/Chip";
import StickyBottom from "@/components/ui/StickyBottom";
import Button from "@/components/ui/Button";
import TextLink from "@/components/ui/TextLink";

// Mifflin-St Jeor 공식이 여성/남성 두 가지만 정의돼 있어 선택지도 둘이다(docs/SIMULATION.md 2-1).
const SEXES = ["여성", "남성"] as const;

// 활동계수 4단계(docs/SIMULATION.md 2-1). 계수는 계산 로직 구현 때 저장 모듈에서 쓴다.
const ACTIVITIES = [
  { id: "sedentary", label: "주로 앉아 있어요", sub: "운동은 거의 안 해요" },
  { id: "light", label: "가볍게 움직여요", sub: "가끔 걷거나 운동해요" },
  { id: "moderate", label: "꽤 움직여요", sub: "운동이 일상이에요" },
  { id: "active", label: "많이 움직여요", sub: "거의 매일 운동해요" },
] as const;

// 몸 정보 입력(온보딩 2/3). 모두 선택 입력이다. 저장·TDEE 계산은 없다 — 입력·선택 상태만 화면에 보여준다.
export default function BodyPage() {
  const router = useRouter();
  const [sex, setSex] = useState<string | null>(null);
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<string | null>(null);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header
        variant="back"
        backHref="/onboarding/profile"
        center={<ProgressDots total={3} current={2} />}
      />

      <main className="flex-1 px-5 pb-6">
        <h1 className="mt-2 text-display font-bold">평소 하루를 알려 주세요</h1>
        <p className="mt-3 text-body text-subtext">
          하루 권장 섭취 칼로리를 계산해 이벤트 없는 날의 기준으로 써요. 모두 선택이라 건너뛰어도
          괜찮아요.
        </p>

        <div className="mt-6">
          <p className="mb-2 text-label text-subtext">성별</p>
          <ChipGroup label="성별" columns={2}>
            {SEXES.map((s) => (
              <Chip
                key={s}
                size="row"
                label={s}
                selected={sex === s}
                onClick={() => setSex(s)}
              />
            ))}
          </ChipGroup>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Field
            label="나이"
            unit="세"
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ""))}
            maxLength={3}
          />
          <Field
            label="키"
            unit="cm"
            inputMode="numeric"
            value={height}
            onChange={(e) => setHeight(e.target.value.replace(/[^0-9]/g, ""))}
            maxLength={3}
          />
          <Field
            label="체중"
            unit="kg"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value.replace(/[^0-9.]/g, ""))}
            maxLength={5}
          />
        </div>

        <div className="mt-6">
          <p className="mb-2 text-label text-subtext">평소 얼마나 움직이나요?</p>
          <ChipGroup label="평소 얼마나 움직이나요?" columns={2}>
            {ACTIVITIES.map((a) => (
              <Chip
                key={a.id}
                size="stack"
                label={a.label}
                subLabel={a.sub}
                selected={activity === a.id}
                onClick={() => setActivity(a.id)}
              />
            ))}
          </ChipGroup>
        </div>
        <p className="mt-2 text-body text-subtext">나중에 마이페이지에서 입력해도 돼요.</p>
      </main>

      <StickyBottom>
        <Button size="lg" icon onClick={() => router.push("/onboarding/avatar")}>
          다음
        </Button>
        <TextLink href="/onboarding/avatar" className="mt-1">
          나중에 할게요
        </TextLink>
      </StickyBottom>
    </div>
  );
}
