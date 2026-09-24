import type { Bloat, BodyEvent, Energy, SimulationResult, Weather } from "./model";
import { kgLabel } from "./simulation";

// 고정 템플릿 문구. LLM 없이도 항상 동작하는 기본값이고, /api/coach가 LLM 호출에 실패하면 이 문구로 대체한다.
// docs/LLM.md 3장 안전 규칙을 지킨다: 미리 덜 먹기·굶기·보상 운동 권유 없음, 체형 평가 없음, 음식 도덕화 없음,
// 체중 변화는 "일시적 변동"으로만 설명. 숫자는 계산 결과(simulation.ts)를 인용만 한다.

// 이벤트 전/후 대응 가이드(버퍼 식단 = 평소 식사 유지 + 균형)
export function guideTemplate(multiDay: boolean): SimulationResult["guide"] {
  return {
    before: [
      multiDay ? "기간 중에도 끼니는 평소 리듬대로 챙겨요" : "그날도 평소처럼 식사해요",
      "단백질과 채소를 평소 식사에 곁들여요",
      "물은 평소만큼 마셔요",
    ],
    after: [
      "다음 끼니는 평소 식사로 이어가요",
      "수분이 빠질 때까지 하루이틀 지켜봐요",
      "체중은 7일 평균으로 함께 봐요",
    ],
  };
}

// 예보 목록·홈 카드의 한 줄 요약
export function eventSummary(sim: SimulationResult): string {
  return `다음 날 체중계에 ${kgLabel(sim.displayedKg.h24, true)} 보일 수 있어요. 대부분 수분이라 며칠 안에 서서히 빠져요.`;
}

const BLOAT_LINE: Record<Bloat, string> = {
  light: "몸이 가볍게 느껴진다니 다행이에요.",
  mid: "살짝 부은 느낌은 수분이 잠시 머물러서예요. 48~72시간에 걸쳐 서서히 걷혀요.",
  heavy: "묵직한 느낌은 수분과 장내용물이 잠시 머물러서예요. 48~72시간에 걸쳐 서서히 걷혀요.",
};

const ENERGY_LINE: Record<Energy, string> = {
  good: "개운한 컨디션이니 평소 하던 가벼운 활동을 그대로 이어가요.",
  low: "피곤하다면 오늘은 잠을 조금 더 챙겨요. 운동으로 만회하려 하지 않아도 괜찮아요.",
};

export function checkinTemplate(input: { bloat: Bloat; energy: Energy }): string {
  return `${BLOAT_LINE[input.bloat]} ${ENERGY_LINE[input.energy]} 다음 끼니는 평소 식사로 이어가면 충분해요. 다시 시작해도 지난 기록은 그대로 남아요.`;
}

// 홈 말풍선(오늘 한 줄)
export type HomeState = "default" | "ended" | "empty";


export function homeBubble(
  state: HomeState,
  weather: Weather,
  upcoming: { event: BodyEvent; when: string } | null,
): string {
  if (state === "ended") return "지난 이벤트, 어땠나요? 가볍게 지금 상태를 체크해 봐요.";
  if (weather === "rain")
    return "소나기가 지나가는 날이에요. 숫자가 잠시 오르내려도 자연스러운 변동이에요.";
  if (weather === "cloudy") return "오늘은 흐린 흐름이에요. 무리하지 말고 평소 리듬을 지켜요.";
  if (state === "empty" || !upcoming)
    return "아직 등록된 이벤트가 없어요. 이벤트를 등록하면 예보를 보여드려요.";
  const { event, when } = upcoming;
  return `${when} ${event.kind}이 있어요. 오늘은 평소처럼 지내도 괜찮아요.`;
}
