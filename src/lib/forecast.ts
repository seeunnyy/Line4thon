import type {
  BodyEvent,
  CheckIn,
  ForecastScene,
  ForecastStory,
  SimulationResult,
  Weather,
  WeekDay,
} from "./model";
import { addDays, dayOf, diffDays, dowOf, longDateLabel, shortDateLabel } from "./dates";
import { kcalLabel, kgLabel, simulate } from "./simulation";
import { eventSummary, guideTemplate } from "./coach";

// 저장된 이벤트를 화면 모양(주간 스트립·D-day·예보 결과 장면)으로 바꾼다.
// "날씨"는 실제 기상이 아니라 몸 상태 은유다(DESIGN.md). 규칙은 예보 결과 장면과 같다:
// 이벤트 기간 = 소나기, 끝난 다음 날(24시간) = 흐림, 그 밖 = 맑음.

export const isMultiDay = (e: BodyEvent) => e.endDate !== e.date;

export function weatherOn(iso: string, events: BodyEvent[]): Weather {
  if (events.some((e) => iso >= e.date && iso <= e.endDate)) return "rain";
  if (events.some((e) => iso === addDays(e.endDate, 1))) return "cloudy";
  return "sunny";
}

export function buildWeek(today: string, events: BodyEvent[]): WeekDay[] {
  return Array.from({ length: 7 }, (_, i) => {
    const iso = addDays(today, i);
    const ev = events.find((e) => iso >= e.date && iso <= e.endDate);
    return {
      dow: dowOf(iso),
      date: dayOf(iso),
      weather: weatherOn(iso, events),
      today: i === 0,
      event: ev?.kind,
    };
  });
}

export function eventTitle(e: BodyEvent): string {
  return isMultiDay(e) ? e.kind : `${dowOf(e.date)}요일 ${e.kind}`;
}

export function eventDateLabel(e: BodyEvent): string {
  return isMultiDay(e)
    ? `${shortDateLabel(e.date)} ~ ${shortDateLabel(e.endDate)}`
    : longDateLabel(e.date);
}

// "D-3" / "D-DAY" / "진행 중"
export function dDayLabel(e: BodyEvent, today: string): string {
  const n = diffDays(today, e.date);
  if (n > 0) return `D-${n}`;
  if (n === 0) return "D-DAY";
  return "진행 중";
}

// 홈 말풍선용 "내일" / "9월 25일 금요일에"
export function whenLabel(e: BodyEvent, today: string): string {
  const n = diffDays(today, e.date);
  if (n <= 0) return "오늘";
  if (n === 1) return "내일";
  if (n === 2) return "모레";
  return `${longDateLabel(e.date)}에`;
}

export type EventStatus = "upcoming" | "pending" | "done";

export function eventStatus(e: BodyEvent, today: string, checkins: CheckIn[]): EventStatus {
  if (e.endDate >= today) return "upcoming";
  return checkins.some((c) => c.eventId === e.id) ? "done" : "pending";
}

const byDate = (a: BodyEvent, b: BodyEvent) => a.date.localeCompare(b.date);

export function upcomingEvents(events: BodyEvent[], today: string): BodyEvent[] {
  return events.filter((e) => e.endDate >= today).sort(byDate);
}

// 끝난 이벤트는 최근 것부터
export function pastEvents(events: BodyEvent[], today: string): BodyEvent[] {
  return events.filter((e) => e.endDate < today).sort((a, b) => byDate(b, a));
}

export function pendingCheckinEvent(
  events: BodyEvent[],
  checkins: CheckIn[],
  today: string,
): BodyEvent | null {
  return pastEvents(events, today).find((e) => eventStatus(e, today, checkins) === "pending") ?? null;
}

// 예보 목록·기록 타임라인 카드 한 장
export interface EventListItem {
  id: string;
  type: BodyEvent["kind"];
  title: string;
  dateLabel: string;
  badge: string;
  tone: "dday" | "done" | "pending";
  body: string;
  href: string;
}

export function eventListItem(
  e: BodyEvent,
  sim: SimulationResult | undefined,
  today: string,
  checkins: CheckIn[],
): EventListItem {
  const status = eventStatus(e, today, checkins);
  const base = { id: e.id, type: e.kind, title: eventTitle(e), dateLabel: eventDateLabel(e) };
  if (status === "upcoming")
    return {
      ...base,
      badge: dDayLabel(e, today),
      tone: "dday",
      body: sim ? eventSummary(sim) : "",
      href: `/app/event/${e.id}/simulation`,
    };
  if (status === "done")
    return {
      ...base,
      badge: "체크인 완료",
      tone: "done",
      body: "체크인을 마쳤어요. 기록에서 다시 볼 수 있어요.",
      href: `/app/event/${e.id}/simulation`,
    };
  return {
    ...base,
    badge: "체크인 전",
    tone: "pending",
    body: "이벤트가 끝났어요. 지금 상태를 가볍게 체크해 봐요.",
    href: `/app/checkin?event=${e.id}`,
  };
}

// 이벤트 등록 때 한 번 계산해 저장한다(ARCHITECTURE.md: 시뮬레이션 결과 = 전/후 가이드 포함).
export function makeSimulationResult(e: BodyEvent): SimulationResult {
  const s = simulate(e.kcal);
  return {
    eventId: e.id,
    kcal: s.kcal,
    fatKg: s.fatKg,
    gutStartKg: s.gutStartKg,
    waterStartKg: s.waterStartKg,
    displayedKg: { h0: s.displayedAt(0), h24: s.displayedAt(24), h48: s.displayedAt(48), h72: s.displayedAt(72) },
    guide: guideTemplate(isMultiDay(e)),
  };
}

// ── 예보 결과: 이벤트 전날 → 이벤트 직후 → 24·48·72시간 장면 ─────────────
// 여러 날 이벤트는 마지막 날 다음 날부터 24시간이 시작된다(기간 전체를 한 건으로 본다).

export function buildStory(e: BodyEvent, sim: SimulationResult, today: string): ForecastStory {
  const days = buildWeek(today, [e]).map(({ event: _event, ...d }) => d);
  const multi = isMultiDay(e);
  const start = diffDays(today, e.date);
  const end = diffDays(today, e.endDate);
  const span = end - start + 1;
  const dayName = (offset: number) => `${dowOf(addDays(today, offset))}요일`;
  const eventWord = multi ? `${e.kind}이 끝난 직후` : `${e.kind} 직후`;
  const eventDays = multi
    ? `${dowOf(e.date)}~${dowOf(e.endDate)}`
    : `${dowOf(e.date)}요일`;

  const scenes: ForecastScene[] = [
    {
      id: "before",
      day: start - 1,
      label: `${dayName(start - 1)} · ${e.kind} 전날`,
      weather: "sunny",
      hours: null,
      line: sim.guide.before[0],
      big: kcalLabel(sim.kcal),
      note: multi ? "기간 전체를 하나로 본 기준이에요" : "이번 예보의 기준 섭취량이에요",
    },
    {
      id: "event",
      day: start,
      label: `${eventDays} · ${eventWord}`,
      weather: "rain",
      hours: 0,
      line: "표시체중이 가장 높은 때예요",
      big: null,
      note: "숫자가 잠시 오르내려도 자연스러운 변동이에요",
    },
    {
      id: "h24",
      day: end + 1,
      label: `${dayName(end + 1)} · 다음 날`,
      weather: "cloudy",
      hours: 24,
      line: `체중계에 ${kgLabel(sim.displayedKg.h24, true)} 보일 수 있어요`,
      big: kgLabel(sim.displayedKg.h24, true).replace("약 ", ""),
      note: "대부분 수분과 장내용물이라 며칠 안에 서서히 빠져요.",
    },
    {
      id: "h48",
      day: end + 2,
      label: `${dayName(end + 2)} · 이틀 뒤`,
      weather: "sunny",
      hours: 48,
      line: "대부분 빠지고 실제 지방선에 가까워져요",
      big: "48~72시간",
      note: "48~72시간에 걸쳐 서서히 수렴해요",
    },
    {
      id: "h72",
      day: end + 3,
      label: `${dayName(end + 3)} · 3일 뒤`,
      weather: "sunny",
      hours: 72,
      line: `실제 지방선(${kgLabel(sim.fatKg)})에 수렴해요`,
      big: kgLabel(sim.fatKg),
      note: "이벤트가 끝나도 남는 실제 변화는 이 정도예요.",
    },
  ];

  return {
    title: eventTitle(e),
    amount: multi ? `기간 전체 ${kcalLabel(sim.kcal)}` : kcalLabel(sim.kcal),
    days,
    // 스트립은 항상 오늘 + 0~6일. 이벤트 블록이 스트립 끝을 넘으면 넘는 만큼 자른다.
    event: { label: e.kind, day: start, span: Math.max(1, Math.min(span, days.length - start)) },
    scenes,
  };
}
