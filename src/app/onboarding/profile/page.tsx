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

const TRIES = ["1차", "2차", "3차", "4차", "5차 이상"] as const;

// 정보 입력(온보딩 1/2). 저장은 없다 — 입력·선택 상태만 화면에 보여주고, 다음 화면으로 이동한다.
export default function ProfilePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [tries, setTries] = useState<string | null>(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const ready = nickname.trim().length > 0 && tries !== null;

  return (
    <div className="flex min-h-dvh flex-col">
      <Header variant="back" backHref="/" center={<ProgressDots total={2} current={1} />} />

      <main className="flex-1 px-5 pb-6">
        <h1 className="mt-2 text-display font-bold">나를 소개해 주세요</h1>
        <p className="mt-3 text-body text-subtext">
          닉네임과 몇 번째 도전인지만 있으면 시작할 수 있어요.
        </p>

        <Field
          className="mt-6"
          label="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={10}
          placeholder="불리고 싶은 이름"
          helper="최대 10자예요."
        />

        <div className="mt-6">
          <p id="tries-label" className="mb-2 text-label text-subtext">
            몇 번째 도전인가요?
          </p>
          <ChipGroup label="몇 번째 도전인가요?" columns={3}>
            {TRIES.map((t) => (
              <Chip
                key={t}
                size="row"
                label={t}
                selected={tries === t}
                onClick={() => setTries(t)}
              />
            ))}
          </ChipGroup>
          <p className="mt-2 text-body text-subtext">
            지금이 몇 번째 도전인지 골라 주세요. 정답은 없어요.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Field
            label="키"
            optional
            unit="cm"
            inputMode="numeric"
            value={height}
            onChange={(e) => setHeight(e.target.value.replace(/[^0-9]/g, ""))}
            maxLength={3}
          />
          <Field
            label="현재 체중"
            optional
            unit="kg"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value.replace(/[^0-9.]/g, ""))}
            maxLength={5}
          />
        </div>
        <p className="mt-2 text-body text-subtext">나중에 마이페이지에서 입력해도 돼요.</p>
      </main>

      <StickyBottom>
        <Button
          size="lg"
          icon
          disabled={!ready}
          onClick={() => router.push("/onboarding/avatar")}
        >
          다음
        </Button>
      </StickyBottom>
    </div>
  );
}
