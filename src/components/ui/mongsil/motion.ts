// 날씨별 몽실이 안무. poseAt(weather, t[초], tapAge[초] | null, mode) → 엔진(engine.ts)에 넘길 값.
// 각도는 라디안, bob·travel·발 들기는 몸 그림 px(bob 음수 = 위), squash는 발 기준 세로 배율.
//
// 두 가지 모드:
//  - "calm"   : 원본 표정 그대로, 제자리에서 ±7° 안팎으로만 움직임(작은 움직임).
//  - "lively" : 몸을 크게 쓰고(고개 갸웃·통통·팔 흔들기·뒤뚱뒤뚱 걷기) 표정이 계속 바뀐다.
//               13초쯤 걸리는 한 바퀴를 "장면(beat)" 여러 개로 짠다. 장면마다 표정과 자세 목표가 있고,
//               장면이 바뀔 때 표정은 fade초 동안 섞이고 자세는 move초 동안 부드럽게 넘어간다.
//               한 바퀴가 끝날 때마다 걷는 방향이 좌우로 번갈아 바뀐다.
import type { MongsilWeather } from "./layout";
import { REST_FACE, type EyeMix, type Face, type Pose } from "./engine";

export type MotionMode = "calm" | "lively";

const D = Math.PI / 180;
const TAU = Math.PI * 2;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const easeInOut = (k: number) => k * k * (3 - 2 * k);
const easeOut = (k: number) => 1 - (1 - k) * (1 - k);

// 통통: p(0..1) 한 번 뛰는 동안의 높이(px)와 스쿼시(웅크렸다 → 늘어났다 → 착지 → 출렁).
function hop(p: number, height: number) {
  if (p < 0.1) return { y: 0, s: 1 - 0.05 * easeInOut(p / 0.1) };
  if (p < 0.16) return { y: 0, s: 0.95 + 0.1 * easeOut((p - 0.1) / 0.06) };
  if (p < 0.5) {
    const k = (p - 0.16) / 0.34;
    return { y: 4 * k * (1 - k) * height, s: 1.05 - 0.05 * k };
  }
  if (p < 0.56) return { y: 0, s: 1 - 0.06 * easeOut((p - 0.5) / 0.06) };
  const k = (p - 0.56) / 0.44;
  return { y: 0, s: 1 - 0.06 * Math.exp(-6 * k) * Math.cos(TAU * 1.5 * k) };
}
const HOP_SECONDS = 0.7;

// ───────────────────────── 표정 ─────────────────────────
const E = (open: number, calm: number, happy: number): EyeMix => ({ open, calm, happy });
const OPEN = E(1, 0, 0);
const HAPPY = E(0, 0, 1);
const face = (w: MongsilWeather, o: Partial<Face>): Face => ({ ...REST_FACE[w], ...o });

const lerpEye = (a: EyeMix, b: EyeMix, k: number): EyeMix => ({ open: lerp(a.open, b.open, k), calm: lerp(a.calm, b.calm, k), happy: lerp(a.happy, b.happy, k) });
function lerpFace(a: Face, b: Face, k: number): Face {
  return {
    eyeL: lerpEye(a.eyeL, b.eyeL, k),
    eyeR: lerpEye(a.eyeR, b.eyeR, k),
    blinkL: lerp(a.blinkL, b.blinkL, k),
    blinkR: lerp(a.blinkR, b.blinkR, k),
    lookX: lerp(a.lookX, b.lookX, k),
    lookY: lerp(a.lookY, b.lookY, k),
    browY: lerp(a.browY, b.browY, k),
    smile: lerp(a.smile, b.smile, k),
    mouthO: lerp(a.mouthO, b.mouthO, k),
    glasses: lerp(a.glasses, b.glasses, k),
  };
}

// 탭했을 때 표정: 눈 찡긋(맑음은 선글라스도 이마로 올라간다)
const WINK: Record<MongsilWeather, Face> = {
  sunny: face("sunny", { glasses: 1, eyeL: HAPPY, eyeR: OPEN, smile: 1.7 }),
  cloudy: face("cloudy", { eyeL: OPEN, eyeR: HAPPY, smile: 1.5 }),
  rain: face("rain", { eyeL: HAPPY, mouthO: 0, smile: 1.5, browY: -1 }),
};

// 깜빡임: T초마다 len초 동안 눈이 납작해진다(뜬 눈에만 적용된다)
function blinkAt(t: number, T = 3.3, off = 2.6, len = 0.17) {
  const bt = (t % T) - off;
  return bt > 0 && bt < len ? Math.sin((Math.PI * bt) / len) : 0;
}

// ───────────────────────── 몸 자세 ─────────────────────────
const KEYS = ["yaw", "pitch", "roll", "lean", "squash", "bob", "travel", "headTilt", "headShiftX", "headShiftY", "armL", "armR", "bag", "footL", "footR"] as const;
type Key = (typeof KEYS)[number];
type Body = Partial<Record<Key, number>>;
const dflt = (k: Key) => (k === "squash" ? 1 : 0);
const get = (b: Body, k: Key) => b[k] ?? dflt(k);

type Beat = {
  d: number; // 길이(초)
  face: Face; // 이 장면의 표정. 앞 장면에서 fade초 동안 섞인다
  fade?: number;
  base?: Body; // 이 장면에서 도달·유지하는 자세(생략한 값은 0)
  move?: number; // 자세가 넘어가는 시간(초, 기본 0.5)
  osc?: (t: number) => Body; // 덧붙는 흔들림(장면 안쪽 시간 t초). 장면 양 끝 0.25초는 서서히 나타나고 사라진다.
  hops?: number[]; // 통 뛰는 시각(장면 안쪽 초)
  gaze?: (t: number) => [number, number]; // 눈동자 이동(px)
  glint?: (t: number) => number; // 선글라스 반짝임(-5 이하 = 꺼짐)
};

// 뒤뚱뒤뚱 걷기: 한 걸음 주기 STEP초. 발을 번갈아 들고, 몸이 서 있는 발 쪽으로 기울고, 팔과 가방이 반대로 출렁인다.
const STEP = 0.72;
const WALK_W = TAU / STEP;
function walk(arm = 0.3, sway = 1): (t: number) => Body {
  return (t) => {
    const s = Math.sin(WALK_W * t);
    return {
      roll: 0.06 * s * sway,
      headTilt: -0.05 * s * sway,
      yaw: 0.03 * s * sway,
      bob: -5 * Math.abs(Math.cos(WALK_W * t)),
      footL: 15 * Math.max(0, s),
      footR: 15 * Math.max(0, -s),
      armL: arm * s,
      armR: arm * s,
      bag: -0.3 * Math.sin(WALK_W * t - 0.7),
    };
  };
}
const TRAVEL = 68; // 걸어서 움직이는 거리(몸 그림 px). 캔버스 여백(가로 28%) 안에 들어온다.
const FACE_YAW = 0.2; // 걷는 방향을 보는 각도

// 걷는 장면 3개(오른쪽으로 → 돌아서기 → 되돌아오기)를 만드는 도우미. dir = +1(오른쪽 먼저) / -1(왼쪽 먼저)
function walkBeats(f: Face, dir: number, arm: number, sway: number): Beat[] {
  return [
    { d: 1.7, face: f, fade: 0.4, base: { travel: TRAVEL * dir, yaw: FACE_YAW * dir, lean: 0.025 * dir }, move: 1.7, osc: walk(arm, sway) },
    { d: 0.7, face: f, base: { travel: TRAVEL * dir, yaw: -FACE_YAW * dir, lean: -0.02 * dir }, move: 0.5 },
    { d: 1.7, face: f, base: { travel: 0, yaw: -FACE_YAW * dir, lean: -0.025 * dir }, move: 1.7, osc: walk(arm, sway) },
  ];
}

const sweep = (period: number, ax: number, ay = 0) => (t: number): [number, number] => [ax * Math.sin((TAU * t) / period), ay * Math.sin((TAU * t) / period + 1.2)];

// 맑음: 선글라스 쓴 무표정 → 씨익 → 선글라스 올리고 눈 뜸 → 윙크 → 선글라스 내리고 걷기
function sunnyScript(dir: number): Beat[] {
  const w = "sunny";
  const cool = face(w, { smile: 0 });
  const grin = face(w, { smile: 1.6 });
  const lift = face(w, { glasses: 1, smile: 1.2 });
  const up = face(w, { glasses: 1, eyeL: OPEN, eyeR: OPEN, smile: 1.2 });
  const wink = WINK.sunny;
  const down = face(w, { smile: 1.4 });
  const stroll = face(w, { smile: 1.4 });
  return [
    { d: 1.8, face: cool, fade: 0.4, base: { headTilt: -0.16, yaw: 0.1 * dir, roll: -0.02 }, move: 0.6, glint: (t) => (t > 0.5 && t < 1.4 ? -0.4 + (t - 0.5) * 2.1 : -10) },
    { d: 1.8, face: grin, base: { headTilt: 0.2, yaw: -0.12 * dir, roll: 0.03, armL: 0.3 }, hops: [0.5] },
    { d: 0.45, face: lift, fade: 0.35, base: { headTilt: -0.05, pitch: -0.05 }, move: 0.45 },
    { d: 1.8, face: up, fade: 0.3, base: { headTilt: -0.1, yaw: 0.08 * dir, pitch: 0.02 }, gaze: sweep(1.8, 3.5, 1) },
    { d: 1.6, face: wink, fade: 0.25, base: { headTilt: 0.22, yaw: -0.1 * dir, armL: 0.55 }, hops: [0.35], osc: (t) => ({ armL: 0.22 * Math.sin(TAU * 2.2 * t) }) },
    { d: 0.9, face: down, fade: 0.4, base: {}, move: 0.5 },
    ...walkBeats(stroll, dir, 0.3, 1),
    { d: 0.7, face: face(w, { smile: 1 }), fade: 0.5, base: {}, move: 0.6 },
  ];
}

// 흐림: 졸다가(눈 감음) → 눈 뜬 무표정 → 웃는 눈 → 윙크 → 눈 감고 콧노래하며 걷기
function cloudyScript(dir: number): Beat[] {
  const w = "cloudy";
  const doze = face(w, { smile: 0.8 });
  const open = face(w, { eyeL: OPEN, eyeR: OPEN, smile: 0 });
  const joy = face(w, { eyeL: HAPPY, eyeR: HAPPY, smile: 1.6 });
  const wink = WINK.cloudy;
  const calm = face(w, { smile: 1.2 });
  const stroll = face(w, { eyeL: HAPPY, eyeR: HAPPY, smile: 1.25 });
  return [
    { d: 2.0, face: doze, fade: 0.5, base: { headTilt: -0.14, roll: -0.02, pitch: 0.04 }, move: 0.8, osc: (t) => ({ pitch: 0.015 * Math.sin((TAU * t) / 2.0) }) },
    { d: 2.0, face: open, fade: 0.45, base: { headTilt: 0.2, yaw: 0.1 * dir }, move: 0.7, gaze: sweep(2.0, 3.5, 0.8) },
    { d: 1.9, face: joy, fade: 0.3, base: { headTilt: -0.18, roll: 0.03, armL: 0.5, armR: -0.5 }, hops: [0.5], osc: (t) => ({ armL: 0.2 * Math.sin(TAU * 2 * t), armR: -0.2 * Math.sin(TAU * 2 * t + 0.6) }) },
    { d: 1.5, face: wink, fade: 0.25, base: { headTilt: 0.22, yaw: -0.08 * dir }, hops: [0.4] },
    { d: 0.9, face: calm, fade: 0.4, base: {}, move: 0.5 },
    ...walkBeats(stroll, dir, 0.3, 1),
    { d: 0.8, face: REST_FACE.cloudy, fade: 0.5, base: {}, move: 0.6 },
  ];
}

// 소나기: 깜짝(눈썹 올라감 + 뜀 + 우산 떨림) → 무표정 → 안심 미소 → 윙크 → 우산 들고 걷기
function rainScript(dir: number): Beat[] {
  const w = "rain";
  const startle = face(w, { browY: -5 });
  const flat = face(w, { mouthO: 0, smile: 0, browY: 0 });
  const relief = face(w, { mouthO: 0, smile: 1, browY: -1.5 });
  const wink = WINK.rain;
  const stroll = face(w, { mouthO: 0, smile: 1.1, browY: -0.5 });
  return [
    { d: 1.2, face: startle, fade: 0.25, base: { pitch: -0.04 }, move: 0.3, hops: [0.1], osc: (t) => ({ roll: 0.012 * Math.sin(58 * t), armR: 0.03 * Math.sin(58 * t + 1) }) },
    { d: 1.9, face: flat, fade: 0.35, base: { headTilt: -0.2, yaw: 0.08 * dir, armR: -0.05 }, move: 0.7, gaze: sweep(1.9, 3, 0.8) },
    { d: 1.6, face: relief, fade: 0.35, base: { headTilt: 0.2, yaw: -0.1 * dir, armR: 0.06 }, hops: [0.5], osc: (t) => ({ armR: 0.05 * Math.sin(TAU * 1.6 * t) }) },
    { d: 1.5, face: wink, fade: 0.25, base: { headTilt: -0.2, yaw: 0.1 * dir, armR: -0.08 }, hops: [0.4] },
    ...walkBeats(stroll, dir, 0.26, 1).map((b) => (b.osc ? { ...b, osc: (t: number) => ({ ...b.osc!(t), armR: 0.08 * Math.sin(WALK_W * t) }) } : b)),
    { d: 0.9, face: face(w, { mouthO: 0, smile: 0.6 }), fade: 0.5, base: {}, move: 0.6 },
  ];
}

type Timeline = { beats: Beat[]; starts: number[]; total: number };
function timeline(beats: Beat[]): Timeline {
  const starts: number[] = [];
  let acc = 0;
  for (const b of beats) {
    starts.push(acc);
    acc += b.d;
  }
  return { beats, starts, total: acc };
}
const SCRIPTS: Record<MongsilWeather, [Timeline, Timeline]> = {
  sunny: [timeline(sunnyScript(1)), timeline(sunnyScript(-1))],
  cloudy: [timeline(cloudyScript(1)), timeline(cloudyScript(-1))],
  rain: [timeline(rainScript(1)), timeline(rainScript(-1))],
};
// 한 바퀴 길이(초)
export const LIVELY_SECONDS: Record<MongsilWeather, number> = {
  sunny: SCRIPTS.sunny[0].total,
  cloudy: SCRIPTS.cloudy[0].total,
  rain: SCRIPTS.rain[0].total,
};

const BLINK_PHASE: Record<MongsilWeather, number> = { sunny: 2.6, cloudy: 1.9, rain: 2.6 };

function lively(weather: MongsilWeather, t: number, tapAge: number | null): Pose {
  const pair = SCRIPTS[weather];
  const total = pair[0].total;
  const loop = Math.floor(t / total);
  const tl = pair[loop % 2 === 0 ? 0 : 1];
  const local = t - loop * total;
  let i = 0;
  while (i < tl.beats.length - 1 && local >= tl.starts[i + 1]) i++;
  const beat = tl.beats[i];
  const prev = i > 0 ? tl.beats[i - 1] : tl.beats[tl.beats.length - 1];
  const tau = local - tl.starts[i];

  // 자세 목표(이전 장면 목표 → 이 장면 목표)
  const e = easeInOut(clamp(tau / (beat.move ?? 0.5), 0, 1));
  const out = {} as Record<Key, number>;
  for (const k of KEYS) out[k] = lerp(get(prev.base ?? {}, k), get(beat.base ?? {}, k), e);

  // 장면 안의 흔들림
  const env = easeInOut(clamp(tau / 0.25, 0, 1)) * easeInOut(clamp((beat.d - tau) / 0.25, 0, 1));
  if (beat.osc) {
    const o = beat.osc(tau);
    for (const k of KEYS) if (o[k] != null) out[k] += env * (o[k] as number);
  }
  // 늘 조금씩 숨 쉬듯
  out.yaw += 0.02 * Math.sin((TAU * t) / 6.8);
  out.roll += 0.012 * Math.sin((TAU * t) / 3.4 + 1);
  out.bob += -1.2 * (0.5 + 0.5 * Math.sin((TAU * t) / 4.2));

  // 통통
  let hopY = 0;
  let hopS = 1;
  for (const h of beat.hops ?? []) {
    const p = (tau - h) / HOP_SECONDS;
    if (p >= 0 && p <= 1) {
      const r = hop(p, 14);
      hopY = Math.max(hopY, r.y);
      hopS *= r.s;
    }
  }

  // 표정
  const fk = easeInOut(clamp(tau / (beat.fade ?? 0.3), 0, 1));
  let f = lerpFace(prev.face, beat.face, fk);
  const gz = beat.gaze ? beat.gaze(tau) : [0, 0];
  const blink = blinkAt(t, 3.3, BLINK_PHASE[weather]);
  f = { ...f, lookX: f.lookX + gz[0] * env, lookY: f.lookY + gz[1] * env, blinkL: Math.max(f.blinkL, blink), blinkR: Math.max(f.blinkR, blink) };

  // 탭: 눈 찡긋 + 한 번 통 + 갸웃
  let tapY = 0;
  let tapS = 1;
  let tapRoll = 0;
  let tapTilt = 0;
  if (tapAge != null && tapAge >= 0 && tapAge <= TAP_SECONDS) {
    const w = easeInOut(clamp(tapAge / 0.12, 0, 1)) * (1 - easeInOut(clamp((tapAge - 0.62) / 0.28, 0, 1)));
    f = lerpFace(f, WINK[weather], w);
    const h = hop(tapAge / TAP_SECONDS, 18);
    tapY = h.y;
    tapS = h.s;
    tapRoll = Math.sin(tapAge * 20) * 0.02 * Math.exp(-tapAge * 5);
    tapTilt = 0.16 * w;
  }

  return {
    yaw: out.yaw,
    pitch: out.pitch,
    roll: out.roll + tapRoll,
    lean: out.lean,
    squash: out.squash * hopS * tapS,
    bob: out.bob - hopY - tapY,
    travel: out.travel,
    headTilt: out.headTilt + tapTilt,
    headShiftX: out.headShiftX,
    headShiftY: out.headShiftY,
    armL: out.armL,
    armR: out.armR,
    bag: out.bag,
    footL: out.footL,
    footR: out.footR,
    glint: beat.glint ? beat.glint(tau) : -10,
    shadeK: 0.3, // 크게 돌아설 때 음영이 얼룩져 보이지 않게 약하게
    face: f,
  };
}

// ───────────────────────── 차분한 모드(원본 표정, 작은 움직임) ─────────────────────────
export const TAP_SECONDS = 0.9;
const CALM_TAP_SECONDS = 0.7;
function calmTap(age: number | null) {
  if (age == null || age < 0 || age > CALM_TAP_SECONDS) return { y: 0, s: 1, roll: 0 };
  const h = hop(age / CALM_TAP_SECONDS, 16);
  return { y: h.y, s: h.s, roll: Math.sin(age * 20) * 0.02 * Math.exp(-age * 5) };
}

// 맑음: 통통 뛰고, 고개를 천천히 좌우로. 5초마다 선글라스가 반짝.
function sunnyCalm(t: number): Pose {
  const T = 3.4;
  const h = hop((t % T) / T, 12);
  const q = (t % 5.2) / 1.0;
  return {
    yaw: 7 * D * Math.sin((TAU * t) / 6.8),
    pitch: -1.2 * D * Math.sin((TAU * t) / 3.4 + 0.5),
    roll: 1.4 * D * Math.sin((TAU * t) / 3.4 + 1.0),
    lean: 0.01 * Math.sin((TAU * t) / 3.4 + 0.6),
    bob: -h.y,
    squash: h.s,
    glint: q < 1 ? -0.4 + q * 1.9 : -10,
  };
}

// 흐림: 숨 쉬듯 느리게 흔들리고 고개를 살짝 끄덕.
function cloudyCalm(t: number): Pose {
  const breath = Math.sin((TAU * t) / 4.2);
  return {
    yaw: 5 * D * Math.sin((TAU * t) / 8.6),
    pitch: 2.4 * D * (0.5 + 0.5 * Math.sin((TAU * t) / 6.4 - 1.2)),
    roll: 1.3 * D * Math.sin((TAU * t) / 6.4 + 0.4),
    lean: 0.02 * Math.sin((TAU * t) / 6.4),
    bob: -1.5 * (0.5 + 0.5 * breath),
    squash: 1 + 0.01 * breath,
  };
}

// 소나기: 6초 주기. 깜짝(0.4초에 살짝 뜀 + 눈썹 올라감) → 두리번 → 떨림(2.2~3.6초), 깜빡임은 3.3초마다.
function rainCalm(t: number): Pose {
  const T = 6.0;
  const tt = t % T;
  const st = clamp((tt - 0.4) / 0.6, 0, 1);
  const h = tt > 0.4 && tt < 1.0 ? hop(st, 9) : { y: 0, s: 1 };
  const startle = tt > 0.4 && tt < 2.2 ? Math.exp(-(tt - 0.4) * 1.6) : 0;
  const shiverEnv = tt > 2.2 && tt < 3.6 ? Math.sin((Math.PI * (tt - 2.2)) / 1.4) : 0;
  const sh = Math.sin(t * 58) * shiverEnv;
  const blink = blinkAt(t, 3.3, 2.6);
  const look = Math.sin((TAU * t) / 5.6);
  return {
    yaw: 7 * look * D,
    pitch: -1.5 * Math.sin((TAU * t) / 6.0) * D,
    roll: (1.0 * Math.sin((TAU * t) / 4.4) + 0.5 * sh) * D,
    lean: 0.006 * Math.sin((TAU * t) / 4.4) + 0.003 * sh,
    bob: -h.y + 0.6 * sh,
    squash: h.s,
    face: {
      blinkL: blink,
      blinkR: blink,
      lookX: 2.6 * look,
      lookY: -0.6 * Math.sin((TAU * t) / 5.6 + 1),
      browY: -4.5 * startle - 1.0 * Math.sin((TAU * t) / 5.6 + 0.5),
    },
  };
}

export function poseAt(weather: MongsilWeather, t: number, tapAge: number | null = null, mode: MotionMode = "lively"): Pose {
  if (mode === "lively") return lively(weather, t, tapAge);
  const P = weather === "sunny" ? sunnyCalm(t) : weather === "cloudy" ? cloudyCalm(t) : rainCalm(t);
  const r = calmTap(tapAge);
  P.bob = (P.bob ?? 0) - r.y;
  P.squash = (P.squash ?? 1) * r.s;
  P.roll = (P.roll ?? 0) + r.roll;
  return P;
}

// 탭 반응이 끝나는 시간(초)
export function tapSeconds(mode: MotionMode): number {
  return mode === "lively" ? TAP_SECONDS : CALM_TAP_SECONDS;
}

// 발 밑 그림자: 몸이 뜨면 작고 옅어진다. dx = 걸어서 옆으로 간 거리(몸 그림 px)를 그림자도 따라간다.
export function shadowFor(P: Pose): { scale: number; opacity: number; dx: number } {
  const lift = clamp(-(P.bob ?? 0) / 28, 0, 1);
  return { scale: 1 - 0.3 * lift, opacity: 1 - 0.45 * lift, dx: P.travel ?? 0 };
}
