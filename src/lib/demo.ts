import type { BodyEvent, CheckIn } from "./model";
import { addDays, todayISO } from "./dates";
import { checkinTemplate } from "./coach";
import { makeSimulationResult } from "./forecast";
import { PRESET_KCAL } from "./simulation";
import { getStore, replaceStore } from "./storage";

// 마이페이지 "데모 데이터 불러오기"(시연용). 날짜는 오늘 기준으로 만든다:
// 내일 회식(예보) · 지난주 회식(체크인 완료) · 지난달 여행 3일(체크인 전). 이미 있는 프로필은 그대로 둔다.
export function loadDemoData() {
  const today = todayISO();
  const now = new Date().toISOString();
  const ev = (id: string, kind: BodyEvent["kind"], date: string, endDate: string, preset: BodyEvent["preset"] & string): BodyEvent => ({
    id,
    kind,
    date,
    endDate,
    kcal: PRESET_KCAL[preset],
    preset,
    createdAt: now,
  });

  const events = [
    ev("demo-1", "회식", addDays(today, 1), addDays(today, 1), "normal"),
    ev("demo-2", "회식", addDays(today, -7), addDays(today, -7), "normal"),
    ev("demo-3", "여행", addDays(today, -35), addDays(today, -33), "many"),
  ];
  const checkin: CheckIn = {
    id: "demo-ci-1",
    eventId: "demo-2",
    date: addDays(today, -6),
    bloat: "mid",
    energy: "low",
    message: checkinTemplate({ bloat: "mid", energy: "low" }),
    createdAt: now,
  };

  const prev = getStore();
  replaceStore({
    profile: prev.profile ?? {
      nickname: "지은",
      tries: "3차",
      sex: null,
      age: null,
      heightCm: 165,
      weightKg: null,
      activity: null,
    },
    avatar: { character: "mongsil" },
    events,
    simulations: Object.fromEntries(events.map((e) => [e.id, makeSimulationResult(e)])),
    checkins: [checkin],
  });
}
