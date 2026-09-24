// 날씨별 몽실이 안무. poseAt(weather, t[초], tapAge[초] | null) → 엔진(engine.ts)에 넘길 값.
// 각도는 라디안, bob은 이미지 px(음수 = 위), squash는 발 기준 세로 배율.
// 움직임은 일부러 작게(±7° 안팎) 둔다: 화면 전체를 흔들지 않고 "살아 있다"는 느낌만 준다.
import type { MongsilWeather } from "./layout";
import type { Pose } from "./engine";

const D = Math.PI / 180;
const TAU = Math.PI * 2;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
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

// 탭하면 한 번 통 (0.7초)
export const TAP_SECONDS = 0.7;
function tap(age: number | null) {
  if (age == null || age < 0 || age > TAP_SECONDS) return { y: 0, s: 1, roll: 0 };
  const h = hop(age / TAP_SECONDS, 16);
  return { y: h.y, s: h.s, roll: Math.sin(age * 20) * 0.02 * Math.exp(-age * 5) };
}

// 맑음: 통통 뛰고, 고개를 천천히 좌우로. 5초마다 선글라스가 반짝.
function sunny(t: number): Pose {
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
function cloudy(t: number): Pose {
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
function rain(t: number): Pose {
  const T = 6.0;
  const tt = t % T;
  const st = clamp((tt - 0.4) / 0.6, 0, 1);
  const h = tt > 0.4 && tt < 1.0 ? hop(st, 9) : { y: 0, s: 1 };
  const startle = tt > 0.4 && tt < 2.2 ? Math.exp(-(tt - 0.4) * 1.6) : 0;
  const shiverEnv = tt > 2.2 && tt < 3.6 ? Math.sin((Math.PI * (tt - 2.2)) / 1.4) : 0;
  const sh = Math.sin(t * 58) * shiverEnv;
  const bt = (t % 3.3) - 2.6;
  const blink = bt > 0 && bt < 0.17 ? Math.sin((Math.PI * bt) / 0.17) : 0;
  const look = Math.sin((TAU * t) / 5.6);
  return {
    yaw: 7 * look * D,
    pitch: -1.5 * Math.sin((TAU * t) / 6.0) * D,
    roll: (1.0 * Math.sin((TAU * t) / 4.4) + 0.5 * sh) * D,
    lean: 0.006 * Math.sin((TAU * t) / 4.4) + 0.003 * sh,
    bob: -h.y + 0.6 * sh,
    squash: h.s,
    eye: {
      blink,
      lookX: 2.6 * look,
      lookY: -0.6 * Math.sin((TAU * t) / 5.6 + 1),
      browY: -4.5 * startle - 1.0 * Math.sin((TAU * t) / 5.6 + 0.5),
    },
  };
}

export function poseAt(weather: MongsilWeather, t: number, tapAge: number | null = null): Pose {
  const P = weather === "sunny" ? sunny(t) : weather === "cloudy" ? cloudy(t) : rain(t);
  const r = tap(tapAge);
  P.bob = (P.bob ?? 0) - r.y;
  P.squash = (P.squash ?? 1) * r.s;
  P.roll = (P.roll ?? 0) + r.roll;
  return P;
}

// 발 밑 그림자: 몸이 뜨면 작고 옅어진다. 반환: 가로 배율, 불투명도.
export function shadowFor(P: Pose): { scale: number; opacity: number } {
  const lift = clamp(-(P.bob ?? 0) / 28, 0, 1);
  return { scale: 1 - 0.3 * lift, opacity: 1 - 0.45 * lift };
}
