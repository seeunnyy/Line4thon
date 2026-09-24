"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import SegmentedTabs from "@/components/ui/SegmentedTabs";
import type { SimulationResult } from "@/lib/model";

type Phase = "before" | "after";

const OPTIONS = [
  { value: "before", label: "이벤트 전" },
  { value: "after", label: "이벤트 후" },
] as const;

// 이벤트 전/후 대응 가이드. 문구는 등록 때 저장한 시뮬레이션 결과의 가이드다(coach.ts 템플릿, docs/LLM.md 3장).
export default function GuideTabs({ guide }: { guide: SimulationResult["guide"] }) {
  const [phase, setPhase] = useState<Phase>("before");

  return (
    <>
      <SegmentedTabs
        label="대응 가이드 시점"
        idBase="guide"
        options={OPTIONS}
        value={phase}
        onChange={setPhase}
        className="mt-2"
      />
      <Card variant="panel" className="mt-2 px-4 pb-2 pt-3">
        <div role="tabpanel" id="guide-panel" aria-labelledby={`guide-tab-${phase}`}>
          <ul>
            {guide[phase].map((text) => (
              <li
                key={text}
                className="flex items-start gap-3 border-t border-line py-3 text-label first:border-t-0"
              >
                <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-cobalt" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </>
  );
}
