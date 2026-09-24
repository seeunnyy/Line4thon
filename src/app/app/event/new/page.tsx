"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import SectionTitle from "@/components/ui/SectionTitle";
import ChipGroup from "@/components/ui/ChipGroup";
import Chip from "@/components/ui/Chip";
import Field from "@/components/ui/Field";
import SegmentedTabs from "@/components/ui/SegmentedTabs";
import Notice from "@/components/ui/Notice";
import StickyBottom from "@/components/ui/StickyBottom";
import Button from "@/components/ui/Button";
import type { IconName } from "@/components/ui/Icon";
import {
  AMOUNT_PRESETS,
  EVENT_KINDS,
  type AmountPresetId,
  type BodyEvent,
  type EventKind,
} from "@/lib/model";
import { PRESET_KCAL, kcalLabel } from "@/lib/simulation";
import { makeSimulationResult } from "@/lib/forecast";
import { excessPercent } from "@/lib/tdee";
import { getStore, newId, profileTdee, saveEvent } from "@/lib/storage";

type AmountMode = "preset" | "direct";

const KIND_ICON: Record<EventKind, IconName> = {
  회식: "food",
  여행: "trip",
  명절: "holiday",
  시험기간: "exam",
};

const MODE_OPTIONS = [
  { value: "preset", label: "프리셋 고르기" },
  { value: "direct", label: "직접 입력" },
] as const;

// 이벤트 등록. "예보 보기"를 누르면 이벤트와 시뮬레이션 결과를 저장하고 결과 화면으로 간다.
export default function NewEventPage() {
  const router = useRouter();
  const [kind, setKind] = useState<EventKind | null>(null);
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [mode, setMode] = useState<AmountMode>("preset");
  const [preset, setPreset] = useState<AmountPresetId | null>(null);
  const [kcal, setKcal] = useState("");
  // 프리셋 비교 문구용 TDEE(SIMULATION.md 6장). 몸 정보가 다 없으면 null이라 문구를 숨긴다.
  const [tdee, setTdee] = useState<number | null>(null);
  useEffect(() => setTdee(profileTdee(getStore().profile)), []);
  const selectedPreset = AMOUNT_PRESETS.find((p) => p.id === preset);

  const multiDay = kind === "여행" || kind === "명절";
  const amountReady = mode === "preset" ? preset !== null : Number(kcal) > 0;
  const ready = kind !== null && date !== "" && amountReady;

  const submit = () => {
    if (!ready || kind === null) return;
    const event: BodyEvent = {
      id: newId("ev"),
      kind,
      date,
      endDate: multiDay && endDate >= date ? endDate : date,
      kcal: mode === "preset" && preset ? PRESET_KCAL[preset] : Number(kcal),
      preset: mode === "preset" ? preset : null,
      createdAt: new Date().toISOString(),
    };
    saveEvent(event, makeSimulationResult(event));
    router.push(`/app/event/${event.id}/simulation`);
  };

  // 명절을 고르면 "많이"를 미리 채운다(SIMULATION.md 4장). 이미 고른 값이 있으면 그대로 둔다.
  const chooseKind = (next: EventKind) => {
    setKind(next);
    if (next === "명절" && preset === null) setPreset("many");
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <Header variant="back" backHref="/app/forecast" title="이벤트 등록" />

      <main className="flex-1 px-5 pb-6">
        <SectionTitle icon="calendar">어떤 이벤트인가요?</SectionTitle>
        <ChipGroup label="이벤트 종류" className="mt-2">
          {EVENT_KINDS.map((k) => (
            <Chip
              key={k}
              size="tall"
              icon={KIND_ICON[k]}
              label={k}
              selected={kind === k}
              onClick={() => chooseKind(k)}
            />
          ))}
        </ChipGroup>

        <SectionTitle icon="clock">언제인가요?</SectionTitle>
        <Field
          className="mt-2"
          label={multiDay ? "첫날" : "날짜"}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {multiDay && (
          <Field
            className="mt-3"
            label="마지막 날"
            optional
            type="date"
            min={date || undefined}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        )}

        <SectionTitle icon="food">얼마나 먹을 것 같나요?</SectionTitle>
        <SegmentedTabs
          label="먹는 양 입력 방식"
          idBase="amount"
          options={MODE_OPTIONS}
          value={mode}
          onChange={setMode}
          className="mt-2"
        />
        <div role="tabpanel" id="amount-panel" aria-labelledby={`amount-tab-${mode}`} className="mt-3">
          {mode === "preset" ? (
            <>
              <ChipGroup label="먹는 양 프리셋">
                {AMOUNT_PRESETS.map((p) => (
                  <Chip
                    key={p.id}
                    size="stack"
                    label={p.label}
                    subLabel={kcalLabel(p.kcal)}
                    selected={preset === p.id}
                    onClick={() => setPreset(p.id)}
                  />
                ))}
              </ChipGroup>
              {selectedPreset && tdee !== null && tdee > 0 && (
                <p className="mt-2 text-body text-subtext">
                  하루 권장량보다 약 {excessPercent(selectedPreset.kcal, tdee)}% 더 먹는 양이에요.
                </p>
              )}
              {kind === "명절" && preset === "many" && (
                <p className="mt-2 text-body text-subtext">
                  명절은 상차림이 푸짐한 편이라 &lsquo;많이&rsquo;로 골라 뒀어요. 바꿔도 돼요.
                </p>
              )}
            </>
          ) : (
            <Field
              label="평소보다 더 먹을 칼로리"
              unit="kcal"
              inputMode="numeric"
              maxLength={5}
              value={kcal}
              onChange={(e) => setKcal(e.target.value.replace(/[^0-9]/g, ""))}
              helper="평소 식사는 빼고 더 먹는 만큼만 적어요. 대략 어림해도 괜찮아요."
            />
          )}
        </div>

        <Notice>예보는 참고용이에요. 몸의 이상 징후가 있을 때는 전문의와 상의하세요.</Notice>
      </main>

      <StickyBottom>
        <Button
          size="lg"
          icon
          disabled={!ready}
          onClick={submit}
        >
          예보 보기
        </Button>
      </StickyBottom>
    </div>
  );
}
