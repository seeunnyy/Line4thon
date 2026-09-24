"use client";

import { useSyncExternalStore } from "react";
import type { AvatarSettings, BodyEvent, CheckIn, Profile, SimulationResult } from "./model";

// 저장 모듈. localStorage 접근은 이 파일에만 둔다(ARCHITECTURE.md) — 나중에 서버 저장으로 바꿀 때 여기만 고친다.
// 클라이언트 컴포넌트에서만 쓴다. 서버 렌더와 첫 하이드레이션에서는 useStore()가 null을 돌려준다.

const KEY = "bodycast:v1";

export interface StoreData {
  profile: Profile | null;
  avatar: AvatarSettings | null;
  events: BodyEvent[];
  simulations: Record<string, SimulationResult>;
  checkins: CheckIn[];
}

export const EMPTY_STORE: StoreData = {
  profile: null,
  avatar: null,
  events: [],
  simulations: {},
  checkins: [],
};

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cached: StoreData = EMPTY_STORE;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null; // 사생활 보호 모드 등에서 막히면 빈 저장소로 본다
  }
}

// useSyncExternalStore는 같은 값이면 같은 객체를 돌려받아야 하므로, 원문이 바뀔 때만 다시 파싱한다.
export function getStore(): StoreData {
  const raw = readRaw();
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    cached = raw ? { ...EMPTY_STORE, ...(JSON.parse(raw) as Partial<StoreData>) } : EMPTY_STORE;
  } catch {
    cached = EMPTY_STORE;
  }
  return cached;
}

function write(next: StoreData) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // 저장이 막혀도 앱은 멈추지 않는다(이번 화면에서만 반영되지 않음)
  }
  listeners.forEach((l) => l());
}

export function updateStore(fn: (prev: StoreData) => StoreData) {
  write(fn(getStore()));
}

export function clearStore() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // 무시
  }
  listeners.forEach((l) => l());
}

export function replaceStore(next: StoreData) {
  write(next);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) cb();
  };
  window.addEventListener("storage", onStorage); // 다른 탭에서 바뀐 경우
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useStore(): StoreData | null {
  return useSyncExternalStore<StoreData | null>(subscribe, getStore, () => null);
}

// ── 쓰기 도우미 ─────────────────────────────────────────

export function newId(prefix: string): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rand}`;
}

export function saveProfile(profile: Profile) {
  updateStore((s) => ({ ...s, profile }));
}

export function saveAvatar(avatar: AvatarSettings) {
  updateStore((s) => ({ ...s, avatar }));
}

export function saveEvent(event: BodyEvent, simulation: SimulationResult) {
  updateStore((s) => ({
    ...s,
    events: [...s.events.filter((e) => e.id !== event.id), event],
    simulations: { ...s.simulations, [event.id]: simulation },
  }));
}

export function saveCheckIn(checkin: CheckIn) {
  updateStore((s) => ({ ...s, checkins: [...s.checkins, checkin] }));
}

export function isOnboarded(s: StoreData): boolean {
  return s.profile !== null && s.avatar !== null;
}
