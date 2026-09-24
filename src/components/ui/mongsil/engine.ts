// 몽실이 2.5D 엔진. 의존성 없는 직접 작성 WebGL(3D 라이브러리 아님).
// - 렌더 한 장(mongsil-*.png)을 격자 메시로 깔고, 깊이맵(mongsil-*-depth.png)으로 볼록하게 만든 뒤
//   요/피치/롤 회전 + 스쿼시&스트레치 + 젤리 기울기로 움직인다. 원근 없는 정사영이라 기본 자세는 원본 이미지와 똑같다.
// - 부위별 스키닝: 고개 갸웃(머리), 팔·가방 회전, 발 들기. 가중치는 로드할 때 정점마다 미리 굽는다:
//   가우시안 영역(RIG의 c, s) × 끈·가방 마스크(몸 그림 색에서 만듦) — 팔은 끈·가방 위에서 0에 가깝고 가방은 끈·가방 위에서만 움직인다.
//   부위 가중치의 합은 1을 넘지 않는다(겹친 영역의 변위가 더해져 끈이 꺾이거나 가방이 끌려가지 않게).
// - 소나기의 우산은 몸에서 분리된 부품 두 장(뒤 우산 = 윗면·안쪽 / 앞 막대 = 손잡이·막대)이라 몸과 따로 흔들린다.
// - 표정: 얼굴 부품(눈 열림/감김/웃음눈, 입 굽힘·O, 눈썹, 선글라스)은 mongsil-*-parts.png 아틀라스의 별도 메시이고,
//   부품을 지운 빈 얼굴(patch)이 원본 얼굴 위를 덮는다. 기본 표정으로 합치면 원본 렌더와 같다.
// - 그림 위에 보이는 소품(해·구름·빗방울)은 여기 없고 Mongsil.tsx의 CSS 애니메이션이다.
import { FACE, SMILE, UMBRELLA, type SpriteName } from "./faceData";
import type { Box, MongsilWeather } from "./layout";

export type EyeMix = { open: number; calm: number; happy: number };
export type Face = {
  eyeL: EyeMix; // 눈 종류(0~1, 가장 큰 한 종류만 그림): 뜬 눈 / 감은 눈(‿) / 웃는 눈(⌒). 값이 작을수록 감기거나 줄어든 상태
  eyeR: EyeMix;
  blinkL: number; // 뜬 눈이 감기는 정도(0~1)
  blinkR: number;
  lookX: number; // 눈동자 이동(px)
  lookY: number;
  browY: number; // 눈썹 위아래(px, 음수 = 위). 소나기만 눈썹이 있다
  smile: number; // 입: 0 = 일자(무표정), 1 = 원본 미소, 1.6 = 활짝
  mouthO: number; // 놀란 입(O) 0~1
  glasses: number; // 선글라스: 0 = 쓴 상태, 1 = 이마 위로 올림 (맑음만)
};
export type Pose = {
  yaw?: number; // 좌우 고개 돌림(rad)
  pitch?: number; // 끄덕임(rad)
  roll?: number; // 몸 전체 갸웃(rad)
  lean?: number; // 젤리 기울기(몸 높이 대비 비율)
  squash?: number; // 발 기준 세로 배율(1 = 그대로)
  bob?: number; // 위아래(몸 그림 px, 음수 = 위)
  travel?: number; // 좌우 이동(몸 그림 px, 양수 = 오른쪽)
  headTilt?: number; // 머리만 갸웃(rad, 양수 = 시계 방향)
  headShiftX?: number; // 머리가 기울면서 옆으로 쏠림(px)
  headShiftY?: number;
  armL?: number; // 화면 왼쪽 팔(rad)
  armR?: number; // 화면 오른쪽 팔(소나기는 우산 전체)
  bag?: number; // 가방 흔들림(rad)
  footL?: number; // 발 들기(px)
  footR?: number;
  shadeK?: number; // 회전에 따른 음영 변화 세기
  glint?: number; // 선글라스 반짝임 위치(-5 이하 = 꺼짐)
  face?: Partial<Face>;
};

export type MongsilEngine = {
  render: (pose: Pose) => void;
  resize: (bufferW: number, bufferH: number) => void;
  dispose: () => void;
};

// 원본 렌더의 표정(정지 그림과 같은 얼굴). 안무는 여기서 출발해서 여기로 돌아온다.
export const REST_FACE: Record<MongsilWeather, Face> = {
  sunny: { eyeL: { open: 0, calm: 0, happy: 0 }, eyeR: { open: 0, calm: 0, happy: 0 }, blinkL: 0, blinkR: 0, lookX: 0, lookY: 0, browY: 0, smile: 1, mouthO: 0, glasses: 0 },
  cloudy: { eyeL: { open: 0, calm: 1, happy: 0 }, eyeR: { open: 0, calm: 1, happy: 0 }, blinkL: 0, blinkR: 0, lookX: 0, lookY: 0, browY: 0, smile: 1, mouthO: 0, glasses: 0 },
  rain: { eyeL: { open: 1, calm: 0, happy: 0 }, eyeR: { open: 1, calm: 0, happy: 0 }, blinkL: 0, blinkR: 0, lookX: 0, lookY: 0, browY: 0, smile: 0, mouthO: 1, glasses: 0 },
};

// 캔버스는 몸 그림보다 사방으로 조금 크다(걷거나 뛰거나 고개를 갸웃할 때 삐져나가는 곳).
export const CANVAS_MARGIN = { x: 0.28, top: 0.1, bottom: 0.03 } as const;
export function canvasBox(body: Box): Box {
  return {
    x: body.x - body.w * CANVAS_MARGIN.x,
    y: body.y - body.h * CANVAS_MARGIN.top,
    w: body.w * (1 + 2 * CANVAS_MARGIN.x),
    h: body.h * (1 + CANVAS_MARGIN.top + CANVAS_MARGIN.bottom),
  };
}

// 몸 그림 좌표계의 뼈대 값. pivot = 발 가운데(움직임의 기준점).
type Limb = { c: [number, number]; s: [number, number]; p: [number, number] };
type Rig = {
  pivot: [number, number];
  head: { p: [number, number]; y0: number; y1: number };
  armL: Limb;
  armR: Limb;
  bag: Limb;
  footL: Limb;
  footR: Limb;
  umbrella?: { p: [number, number]; z: number }; // 우산을 든 손 자리(우산이 돌아가는 중심)와 우산의 깊이
};
export const RIG: Record<MongsilWeather, Rig> = {
  sunny: {
    pivot: [212, 520],
    head: { p: [212, 290], y0: 200, y1: 335 },
    armL: { c: [48, 322], s: [46, 78], p: [88, 268] },
    armR: { c: [380, 305], s: [44, 58], p: [352, 268] },
    bag: { c: [365, 398], s: [40, 52], p: [335, 340] },
    footL: { c: [140, 497], s: [58, 36], p: [140, 497] },
    footR: { c: [292, 497], s: [58, 36], p: [292, 497] },
  },
  cloudy: {
    pivot: [211, 520],
    head: { p: [211, 290], y0: 200, y1: 335 },
    armL: { c: [48, 322], s: [46, 78], p: [88, 268] },
    armR: { c: [380, 305], s: [44, 58], p: [352, 268] },
    bag: { c: [365, 398], s: [40, 52], p: [335, 340] },
    footL: { c: [140, 497], s: [58, 36], p: [140, 497] },
    footR: { c: [292, 497], s: [58, 36], p: [292, 497] },
  },
  rain: {
    pivot: [205, 631],
    head: { p: [205, 400], y0: 310, y1: 445 },
    armL: { c: [47, 438], s: [46, 78], p: [88, 380] },
    armR: { c: [382, 383], s: [44, 62], p: [368, 400] }, // 우산을 든 손(주먹): 우산과 같은 중심으로 돌아간다
    bag: { c: [362, 508], s: [40, 52], p: [332, 450] },
    footL: { c: [128, 612], s: [58, 36], p: [128, 612] },
    footR: { c: [292, 612], s: [58, 36], p: [292, 612] },
    umbrella: { p: [368, 400], z: 88 },
  },
};

const CELL = 6; // 메시 한 칸(px). 작을수록 얇은 부분(우산 손잡이)이 덜 일그러진다.
const DEPTH_SCALE = 2; // 깊이 PNG: 밝기 = z(px) × 2, 가로세로 절반 해상도

const VS = `
attribute vec2 a_uv; attribute float a_z; attribute vec2 a_n; attribute float a_b;
attribute vec4 a_w; attribute vec2 a_w2; // 미리 구운 가중치: 왼팔·오른팔·가방·왼발 / 오른발·머리 (합 ≤ 1)
uniform vec4 u_rect; uniform vec4 u_uvr; uniform vec4 u_ltf; uniform vec3 u_ltr; uniform float u_bend;
uniform vec2 u_size; uniform vec2 u_pivot; uniform vec2 u_canvas; uniform vec2 u_off;
uniform vec3 u_rot; uniform vec3 u_pose;
uniform vec2 u_head; uniform vec3 u_headA; uniform float u_skin; uniform vec3 u_umb;
uniform vec4 u_limbB[5]; uniform vec2 u_limbC[5];
varying vec2 v_uv; varying vec2 v_luv; varying float v_shade; varying float v_shade0;
// 부위 하나의 변위: 중심 B.xy로 B.z만큼 돌리고 C만큼 옮긴 것 × 가중치
vec2 limb(vec2 pi, vec4 B, vec2 C, float w){
  float c = cos(B.z), s = sin(B.z);
  vec2 rr = pi - B.xy;
  return w * (vec2(rr.x * c - rr.y * s, rr.x * s + rr.y * c) - rr + C);
}
void main(){
  vec2 pi = u_rect.xy + a_uv * u_rect.zw;
  pi.y -= u_bend * a_b;
  vec2 lr = (pi - u_ltf.xy) * u_ltf.zw;
  float cl = cos(u_ltr.z), sl = sin(u_ltr.z);
  pi = u_ltf.xy + vec2(lr.x * cl - lr.y * sl, lr.x * sl + lr.y * cl) + u_ltr.xy;
  // 부위별 스키닝 (모든 변위는 같은 기준 위치에서 계산해서 더한다)
  vec2 d = vec2(0.0);
  if (u_skin > 0.5) {
    // 우산 부품: 손 자리를 중심으로 통째로 돌아간다
    vec2 ru = pi - u_umb.xy;
    float cu = cos(u_umb.z), su = sin(u_umb.z);
    d = vec2(ru.x * cu - ru.y * su, ru.x * su + ru.y * cu) - ru;
  } else {
    d += limb(pi, vec4(u_head, u_headA.x, 0.0), u_headA.yz, a_w2.y);
    d += limb(pi, u_limbB[0], u_limbC[0], a_w.x);
    d += limb(pi, u_limbB[1], u_limbC[1], a_w.y);
    d += limb(pi, u_limbB[2], u_limbC[2], a_w.z);
    d += limb(pi, u_limbB[3], u_limbC[3], a_w.w);
    d += limb(pi, u_limbB[4], u_limbC[4], a_w2.x);
  }
  pi += d;
  vec3 p = vec3(pi - u_pivot, a_z);
  vec3 n0 = vec3(a_n, sqrt(max(0.0, 1.0 - dot(a_n, a_n))));
  vec3 n = n0;
  float h = clamp(-p.y / u_size.y, 0.0, 1.0);
  p.x += u_pose.x * u_size.x * pow(h, 1.6);
  float s = u_pose.y;
  p.y *= s; p.x *= inversesqrt(s); p.z *= inversesqrt(s);
  float cy = cos(u_rot.x), sy = sin(u_rot.x);
  p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
  n = vec3(n.x * cy + n.z * sy, n.y, -n.x * sy + n.z * cy);
  float cp = cos(u_rot.y), sp = sin(u_rot.y);
  float ty = -0.5 * u_size.y;
  vec3 q3 = p - vec3(0.0, ty, 0.0);
  p = vec3(q3.x, q3.y * cp + q3.z * sp, -q3.y * sp + q3.z * cp) + vec3(0.0, ty, 0.0);
  n = vec3(n.x, n.y * cp + n.z * sp, -n.y * sp + n.z * cp);
  float cr = cos(u_rot.z), sr = sin(u_rot.z);
  p.xy = vec2(p.x * cr - p.y * sr, p.x * sr + p.y * cr);
  n.xy = vec2(n.x * cr - n.y * sr, n.x * sr + n.y * cr);
  p.y += u_pose.z;
  vec2 c = p.xy + u_pivot + u_off;
  gl_Position = vec4(c.x / u_canvas.x * 2.0 - 1.0, 1.0 - c.y / u_canvas.y * 2.0, 0.0, 1.0);
  v_uv = u_uvr.xy + a_uv * u_uvr.zw;
  v_luv = a_uv;
  vec3 L = normalize(vec3(-0.45, -0.55, 0.70));
  v_shade = dot(n, L);
  v_shade0 = dot(n0, L);
}`;

const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D u_tex; uniform float u_alpha; uniform float u_shadeK; uniform float u_glint;
varying vec2 v_uv; varying vec2 v_luv; varying float v_shade; varying float v_shade0;
void main(){
  vec4 c = texture2D(u_tex, v_uv);
  float k = 1.0 + u_shadeK * (v_shade - v_shade0);
  c.rgb = min(c.rgb * k, vec3(c.a));
  if (u_glint > -5.0) {
    vec3 un = c.rgb / max(c.a, 0.001);
    float lum = dot(un, vec3(0.299, 0.587, 0.114));
    float lens = (1.0 - smoothstep(0.10, 0.24, lum)) * step(0.9, c.a);
    float d = abs(v_luv.x + 0.35 * v_luv.y - u_glint);
    float I = smoothstep(0.075, 0.0, d);
    c.rgb += vec3(0.55) * I * lens * c.a;
  }
  gl_FragColor = c * u_alpha;
}`;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`image failed: ${src}`));
    img.src = src;
  });
}

type Depth = { w: number; h: number; z: Float32Array };
function readDepth(img: HTMLImageElement): Depth {
  const c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const x = c.getContext("2d", { willReadFrequently: true });
  if (!x) throw new Error("no 2d context");
  x.drawImage(img, 0, 0);
  const d = x.getImageData(0, 0, c.width, c.height).data;
  const z = new Float32Array(c.width * c.height);
  for (let i = 0; i < z.length; i++) z[i] = d[i * 4] / DEPTH_SCALE; // px
  return { w: c.width, h: c.height, z };
}

// 이미지 px 좌표의 값(깊이 PNG는 절반 해상도라 쌍선형 보간).
function sample(D: Depth, g: Float32Array, x: number, y: number): number {
  const fx = Math.min(D.w - 1.001, Math.max(0, x / 2 - 0.5));
  const fy = Math.min(D.h - 1.001, Math.max(0, y / 2 - 0.5));
  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const tx = fx - x0;
  const ty = fy - y0;
  const a = g[y0 * D.w + x0];
  const b = g[y0 * D.w + x0 + 1];
  const c = g[(y0 + 1) * D.w + x0];
  const d = g[(y0 + 1) * D.w + x0 + 1];
  return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty;
}

// 끈·가방 마스크(0~1, 절반 해상도). 몸·팔은 흰색·회청색이고 끈·가방은 채도가 있으면서 어둡거나(초록·주황) 아주 어둡다.
// 볼터치(분홍)는 채도는 있지만 밝아서 빠진다.
type Mask = { w: number; h: number; m: Float32Array; mb: Float32Array };
function accessoryMask(img: HTMLImageElement): Mask {
  const W = img.naturalWidth;
  const H = img.naturalHeight;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d", { willReadFrequently: true });
  if (!x) throw new Error("no 2d context");
  x.drawImage(img, 0, 0);
  const d = x.getImageData(0, 0, W, H).data;
  const w = Math.ceil(W / 2);
  const h = Math.ceil(H / 2);
  const m = new Float32Array(w * h);
  for (let py = 0; py < H; py++) {
    for (let px = 0; px < W; px++) {
      const i = (py * W + px) * 4;
      if (d[i + 3] < 128) continue;
      const hi = Math.max(d[i], d[i + 1], d[i + 2]);
      const lo = Math.min(d[i], d[i + 1], d[i + 2]);
      if (((hi - lo) / Math.max(1, hi) > 0.18 && hi < 205) || hi < 128) m[(py >> 1) * w + (px >> 1)] = 1;
    }
  }
  // 상자 흐림 두 번 → 2배(끈·가방 둘레까지 1에 가깝게)
  const blur = (src: Float32Array, R: number) => {
    let m2 = src;
    for (let pass = 0; pass < 2; pass++) {
      for (const horiz of [true, false]) {
        const o = new Float32Array(w * h);
        for (let j = 0; j < h; j++) {
          for (let i = 0; i < w; i++) {
            let s = 0;
            let n = 0;
            for (let k = -R; k <= R; k++) {
              const a = horiz ? i + k : i;
              const b = horiz ? j : j + k;
              if (a < 0 || b < 0 || a >= w || b >= h) continue;
              s += m2[b * w + a];
              n++;
            }
            o[j * w + i] = s / n;
          }
        }
        m2 = o;
      }
    }
    for (let i = 0; i < m2.length; i++) m2[i] = Math.min(1, m2[i] * 2);
    return m2;
  };
  // 팔은 좁게(6px) 흐린 마스크로 끈·가방에서 떼고, 가방은 넓게(16px) 흐린 마스크로 움직인다
  // (가방은 끝이 30px 넘게 움직여서 가중치가 급하게 떨어지면 가장자리가 찢어진다).
  return { w, h, m: blur(m, 3), mb: blur(m, 8) };
}

// 정점 가중치 [왼팔, 오른팔, 가방, 왼발, 오른발, 머리]. 팔은 끈·가방 위에서 0에 가깝고, 가방은 끈·가방 위에서만 움직인다.
// 영역이 겹쳐서 변위가 더해지지 않게 합이 1을 넘으면 나눠서 맞춘다.
function skinWeights(rig: Rig, mask: Mask, x: number, y: number): number[] {
  const g = (l: Limb) => {
    const qx = (x - l.c[0]) / l.s[0];
    const qy = (y - l.c[1]) / l.s[1];
    return Math.exp(-0.5 * (qx * qx + qy * qy));
  };
  const mi = Math.min(mask.w - 1, Math.max(0, Math.round(x / 2 - 0.5)));
  const mj = Math.min(mask.h - 1, Math.max(0, Math.round(y / 2 - 0.5)));
  const acc = mask.m[mj * mask.w + mi];
  const accBag = mask.mb[mj * mask.w + mi];
  const t = Math.min(1, Math.max(0, (y - rig.head.y0) / (rig.head.y1 - rig.head.y0)));
  const head = 1 - t * t * (3 - 2 * t);
  const w = [g(rig.armL) * (1 - acc), g(rig.armR) * (1 - acc), g(rig.bag) * accBag, g(rig.footL), g(rig.footR), head];
  const sum = w.reduce((a, b) => a + b, 0);
  return sum > 1 ? w.map((v) => v / sum) : w;
}

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type);
  if (!s) throw new Error("no shader");
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader compile failed");
  return s;
}

type Layer = {
  tex: WebGLTexture;
  vb: WebGLBuffer;
  ib: WebGLBuffer;
  count: number;
  rect: Box;
  uvr: [number, number, number, number];
  fx: number; // 축소·확대의 기준점(부품이면 눈·입의 중심)
  fy: number;
};
type LayerOpts = { lift?: number; bend?: boolean; uvr?: [number, number, number, number]; fc?: [number, number]; z?: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const NO_WEIGHTS = [0, 0, 0, 0, 0, 0];

export async function createEngine(
  canvas: HTMLCanvasElement,
  weather: MongsilWeather,
  // 파일 이름 → 주소. 기본은 /avatar/ 아래 정적 파일.
  resolve: (file: string) => string = (f) => `/avatar/${f}`,
): Promise<MongsilEngine> {
  const ctx = (canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: "low-power" }) ??
    canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
  if (!ctx) throw new Error("no webgl");
  const gl: WebGLRenderingContext = ctx;

  const rigInfo = RIG[weather];
  const hasUmbrella = !!rigInfo.umbrella;
  // 소나기는 우산을 지운 몸 그림(-body)을 쓴다. 우산은 별도 시트.
  const [img, dimg, aimg, uimg] = await Promise.all([
    loadImage(resolve(hasUmbrella ? `mongsil-${weather}-body.png` : `mongsil-${weather}.png`)),
    loadImage(resolve(`mongsil-${weather}-depth.png`)),
    loadImage(resolve(`mongsil-${weather}-parts.png`)),
    hasUmbrella ? loadImage(resolve(`mongsil-${weather}-umbrella.png`)) : Promise.resolve(null),
  ]);
  const D = readDepth(dimg);
  const accMask = accessoryMask(img);
  const W = img.naturalWidth;
  const H = img.naturalHeight;
  const marginX = CANVAS_MARGIN.x * W;
  const marginTop = CANVAS_MARGIN.top * H;
  const CW = W * (1 + 2 * CANVAS_MARGIN.x);
  const CH = H * (1 + CANVAS_MARGIN.top + CANVAS_MARGIN.bottom);
  const face = FACE[weather];
  const rig = RIG[weather];

  const prog = gl.createProgram();
  if (!prog) throw new Error("no program");
  const vs = compile(gl, gl.VERTEX_SHADER, VS);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FS);
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link failed");
  gl.useProgram(prog);

  const uniformNames = [
    "u_rect", "u_uvr", "u_ltf", "u_ltr", "u_bend", "u_size", "u_pivot", "u_canvas", "u_off", "u_rot", "u_pose",
    "u_head", "u_headA", "u_skin", "u_umb", "u_limbB", "u_limbC", "u_tex", "u_alpha", "u_shadeK", "u_glint",
  ] as const;
  const U = {} as Record<(typeof uniformNames)[number], WebGLUniformLocation | null>;
  for (const n of uniformNames) U[n] = gl.getUniformLocation(prog, n);
  const A = {
    uv: gl.getAttribLocation(prog, "a_uv"),
    z: gl.getAttribLocation(prog, "a_z"),
    n: gl.getAttribLocation(prog, "a_n"),
    b: gl.getAttribLocation(prog, "a_b"),
    w: gl.getAttribLocation(prog, "a_w"),
    w2: gl.getAttribLocation(prog, "a_w2"),
  };
  const STRIDE = 12 * 4;

  const textures: WebGLTexture[] = [];
  const buffers: WebGLBuffer[] = [];

  function texture(image: HTMLImageElement): WebGLTexture {
    const t = gl.createTexture();
    if (!t) throw new Error("no texture");
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    textures.push(t);
    return t;
  }
  const bodyTex = texture(img);
  const partsTex = texture(aimg);

  function layer(tex: WebGLTexture, rect: Box, nx: number, ny: number, o: LayerOpts = {}): Layer {
    const lift = o.lift ?? 0;
    const verts: number[] = [];
    const idx: number[] = [];
    const cx = (x: number) => Math.min(W - 1, Math.max(0, x));
    const cy = (y: number) => Math.min(H - 1, Math.max(0, y));
    const zf = (x: number, y: number) => sample(D, D.z, cx(x), cy(y));
    for (let j = 0; j <= ny; j++) {
      for (let i = 0; i <= nx; i++) {
        const u = i / nx;
        const v = j / ny;
        const x = rect.x + u * rect.w;
        const y = rect.y + v * rect.h;
        const z = o.z ?? zf(x, y) + lift;
        const e = 14; // 음영용 기울기는 넓게 재서 깊이 능선이 각져 보이지 않게 한다
        const dzx = o.z != null ? 0 : (zf(x + e, y) - zf(x - e, y)) / (2 * e);
        const dzy = o.z != null ? 0 : (zf(x, y + e) - zf(x, y - e)) / (2 * e);
        const l = Math.hypot(dzx, dzy, 1);
        // 입 굽힘 곡선(부품 그림 안 x 위치 → 처짐 px)
        let bend = 0;
        if (o.bend) {
          const sx = u * rect.w;
          if (sx >= SMILE.x0 && sx <= SMILE.x1) {
            const k = Math.min(SMILE.sag.length - 1.001, Math.max(0, sx - SMILE.x0));
            const k0 = Math.floor(k);
            bend = SMILE.sag[k0] * (1 - (k - k0)) + SMILE.sag[k0 + 1] * (k - k0);
          }
        }
        // 우산 부품(깊이 고정)은 u_skin 경로로 따로 움직여서 가중치가 없다
        const sw = o.z != null ? NO_WEIGHTS : skinWeights(rig, accMask, x, y);
        verts.push(u, v, z, -dzx / l, -dzy / l, bend, ...sw);
      }
    }
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const a = j * (nx + 1) + i;
        const b = a + 1;
        const c = a + nx + 1;
        const d = c + 1;
        idx.push(a, c, b, b, c, d);
      }
    }
    const vb = gl.createBuffer();
    const ib = gl.createBuffer();
    if (!vb || !ib) throw new Error("no buffer");
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
    buffers.push(vb, ib);
    return { tex, vb, ib, count: idx.length, rect, uvr: o.uvr ?? [0, 0, 1, 1], fx: o.fc?.[0] ?? rect.x + rect.w / 2, fy: o.fc?.[1] ?? rect.y + rect.h / 2 };
  }

  const body = layer(bodyTex, { x: 0, y: 0, w: W, h: H }, Math.ceil(W / CELL), Math.ceil(H / CELL));
  const AW = face.atlas.w;
  const AH = face.atlas.h;
  const patch = layer(
    partsTex,
    { x: face.patch.x, y: face.patch.y, w: face.patch.w, h: face.patch.h },
    Math.ceil(face.patch.w / CELL),
    Math.ceil(face.patch.h / CELL),
    { uvr: [face.patch.ax / AW, face.patch.ay / AH, face.patch.w / AW, face.patch.h / AH] },
  );
  const sprites: Partial<Record<SpriteName, Layer>> = {};
  const LIFT: Record<SpriteName, number> = { glasses: 6, eyeL: 2, eyeR: 2, arcL: 2, arcR: 2, arcUpL: 2, arcUpR: 2, smile: 1.5, mouthO: 1.5, browL: 2, browR: 2 };
  for (const [name, sp] of Object.entries(face.sprites) as [SpriteName, NonNullable<(typeof face.sprites)[SpriteName]>][]) {
    const nx = name === "smile" ? 20 : name === "glasses" ? 18 : 6;
    const ny = name === "glasses" ? 6 : name === "smile" ? 3 : 4;
    sprites[name] = layer(
      partsTex,
      { x: sp.cx - sp.ox, y: sp.cy - sp.oy, w: sp.w, h: sp.h },
      nx,
      ny,
      { lift: LIFT[name], bend: name === "smile", fc: [sp.cx, sp.cy], uvr: [sp.ax / AW, sp.ay / AH, sp.w / AW, sp.h / AH] },
    );
  }

  // 우산 부품(소나기만)
  let umbBack: Layer | null = null;
  let umbFront: Layer | null = null;
  if (rigInfo.umbrella && uimg) {
    const utex = texture(uimg);
    const mk = (part: typeof UMBRELLA.back) =>
      layer(utex, { x: part.x, y: part.y, w: part.w, h: part.h }, Math.ceil(part.w / 12), Math.ceil(part.h / 12), {
        z: rigInfo.umbrella!.z,
        uvr: [part.ax / UMBRELLA.sheet.w, part.ay / UMBRELLA.sheet.h, part.w / UMBRELLA.sheet.w, part.h / UMBRELLA.sheet.h],
      });
    umbBack = mk(UMBRELLA.back);
    umbFront = mk(UMBRELLA.front);
  }

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  // 레이어마다 다른 값(로컬 변형·투명도·입 굽힘)
  type Draw = { tf?: [number, number, number, number]; tr?: [number, number]; rot?: number; alpha?: number; bend?: number };
  function draw(L: Layer, o: Draw = {}) {
    const g = gl;
    g.bindBuffer(g.ARRAY_BUFFER, L.vb);
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, L.ib);
    g.enableVertexAttribArray(A.uv);
    g.vertexAttribPointer(A.uv, 2, g.FLOAT, false, STRIDE, 0);
    g.enableVertexAttribArray(A.z);
    g.vertexAttribPointer(A.z, 1, g.FLOAT, false, STRIDE, 8);
    g.enableVertexAttribArray(A.n);
    g.vertexAttribPointer(A.n, 2, g.FLOAT, false, STRIDE, 12);
    g.enableVertexAttribArray(A.b);
    g.vertexAttribPointer(A.b, 1, g.FLOAT, false, STRIDE, 20);
    g.enableVertexAttribArray(A.w);
    g.vertexAttribPointer(A.w, 4, g.FLOAT, false, STRIDE, 24);
    g.enableVertexAttribArray(A.w2);
    g.vertexAttribPointer(A.w2, 2, g.FLOAT, false, STRIDE, 40);
    g.bindTexture(g.TEXTURE_2D, L.tex);
    g.uniform4f(U.u_rect, L.rect.x, L.rect.y, L.rect.w, L.rect.h);
    g.uniform4f(U.u_uvr, L.uvr[0], L.uvr[1], L.uvr[2], L.uvr[3]);
    const t = o.tf ?? [L.fx, L.fy, 1, 1];
    g.uniform4f(U.u_ltf, t[0], t[1], t[2], t[3]);
    const r = o.tr ?? [0, 0];
    g.uniform3f(U.u_ltr, r[0], r[1], o.rot ?? 0);
    g.uniform1f(U.u_bend, o.bend ?? 0);
    g.uniform1f(U.u_alpha, o.alpha ?? 1);
    g.drawElements(g.TRIANGLES, L.count, g.UNSIGNED_SHORT, 0);
  }

  const limbs = [rig.armL, rig.armR, rig.bag, rig.footL, rig.footR];
  const limbB = new Float32Array(5 * 4);
  const limbC = new Float32Array(5 * 2);
  const pivot = rig.pivot;

  function render(P: Pose) {
    const g = gl;
    g.clear(g.COLOR_BUFFER_BIT);
    g.uniform2f(U.u_size, W, H);
    g.uniform2f(U.u_pivot, pivot[0], pivot[1]);
    g.uniform2f(U.u_canvas, CW, CH);
    g.uniform2f(U.u_off, marginX + (P.travel ?? 0), marginTop);
    g.uniform3f(U.u_rot, P.yaw ?? 0, P.pitch ?? 0, P.roll ?? 0);
    g.uniform3f(U.u_pose, P.lean ?? 0, P.squash ?? 1, P.bob ?? 0);
    g.uniform1f(U.u_shadeK, P.shadeK ?? 0.5);
    g.uniform1i(U.u_tex, 0);
    // 스키닝 값
    g.uniform2f(U.u_head, rig.head.p[0], rig.head.p[1]);
    g.uniform3f(U.u_headA, P.headTilt ?? 0, P.headShiftX ?? 0, P.headShiftY ?? 0);
    const ang = [P.armL ?? 0, P.armR ?? 0, P.bag ?? 0, 0, 0];
    const lift = [0, 0, 0, P.footL ?? 0, P.footR ?? 0];
    limbs.forEach((l, i) => {
      limbB[i * 4] = l.p[0];
      limbB[i * 4 + 1] = l.p[1];
      limbB[i * 4 + 2] = ang[i];
      limbB[i * 4 + 3] = 0;
      limbC[i * 2] = 0;
      limbC[i * 2 + 1] = -lift[i];
    });
    g.uniform1f(U.u_skin, 0);
    g.uniform4fv(U.u_limbB, limbB);
    g.uniform2fv(U.u_limbC, limbC);

    const f: Face = { ...REST_FACE[weather], ...P.face };
    g.uniform1f(U.u_glint, -10);
    // 우산(뒤) → 몸 → 얼굴 … → 우산 막대(앞)
    const um = rigInfo.umbrella;
    const drawUmbrella = (L: Layer | null) => {
      if (!L || !um) return;
      g.uniform1f(U.u_skin, 1);
      g.uniform3f(U.u_umb, um.p[0], um.p[1], P.armR ?? 0);
      draw(L);
      g.uniform1f(U.u_skin, 0);
    };
    drawUmbrella(umbBack);
    draw(body);
    draw(patch);

    const lx = f.lookX;
    const ly = f.lookY;
    const eyes: [SpriteName, SpriteName, SpriteName, EyeMix, number][] = [
      ["eyeL", "arcL", "arcUpL", f.eyeL, f.blinkL],
      ["eyeR", "arcR", "arcUpR", f.eyeR, f.blinkR],
    ];
    for (const [open, calm, happy, mix, blink] of eyes) {
      // 한 번에 한 종류만, 투명도 없이 그린다(겹친 눈·회색 반투명 눈이 생기지 않는다).
      // 나타나고 사라지는 건 세로 크기로만: 뜬 눈은 감기듯 납작해지고, 감은 눈(‿·⌒)은 세로로 줄어든다.
      const v = Math.max(mix.open, mix.calm, mix.happy);
      if (v < 0.02) continue;
      if (mix.open === v) {
        const eo = sprites[open];
        // 깜빡이면 세로로 납작해지고 살짝 옆으로 벌어진다
        const bl = Math.max(blink, 1 - clamp01(v));
        if (eo) draw(eo, { tf: [eo.fx, eo.fy, 1 + 0.1 * bl, 1 - 0.92 * bl], tr: [lx, ly] });
      } else {
        const L = sprites[mix.calm === v ? calm : happy];
        if (L) draw(L, { tf: [L.fx, L.fy, 1, 0.2 + 0.8 * clamp01(v)] });
      }
    }
    for (const b of ["browL", "browR"] as const) {
      const L = sprites[b];
      if (L) draw(L, { tr: [lx * 0.5, f.browY] });
    }
    const sm = sprites.smile;
    if (sm && f.mouthO < 0.99) {
      // 무표정(0)은 짧은 일자 입, 1은 원본 미소, 그 위는 더 넓게
      const wide = 0.82 + 0.18 * Math.min(1, f.smile) + 0.22 * Math.max(0, f.smile - 1);
      draw(sm, { tf: [sm.fx, sm.fy, wide, 1], bend: 1 - f.smile, alpha: 1 - clamp01(f.mouthO) });
    }
    const mo = sprites.mouthO;
    if (mo && f.mouthO > 0.01) {
      const k = 0.8 + 0.2 * clamp01(f.mouthO);
      draw(mo, { tf: [mo.fx, mo.fy, k, k], alpha: clamp01(f.mouthO) });
    }
    drawUmbrella(umbFront);
    const gs = sprites.glasses;
    if (gs) {
      g.uniform1f(U.u_glint, P.glint ?? -10);
      // 이마 위로 올리면 살짝 기울어진다
      draw(gs, { tr: [0, -64 * f.glasses], rot: -0.14 * f.glasses });
    }
  }

  function resize(bufferW: number, bufferH: number) {
    const w = Math.max(1, Math.round(bufferW));
    const h = Math.max(1, Math.round(bufferH));
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    gl.viewport(0, 0, w, h);
  }

  function dispose() {
    for (const t of textures) gl.deleteTexture(t);
    for (const b of buffers) gl.deleteBuffer(b);
    gl.deleteProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }

  return { render, resize, dispose };
}
