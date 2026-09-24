// 몽실이 2.5D 엔진. 의존성 없는 직접 작성 WebGL(3D 라이브러리 아님).
// - 렌더 한 장(mongsil-*.png)을 격자 메시로 깔고, 깊이맵(mongsil-*-depth.png)으로 볼록하게 만든 뒤
//   요/피치/롤 회전 + 스쿼시&스트레치 + 젤리 기울기로 움직인다. 원근 없는 정사영이라 기본 자세는 원본 이미지와 똑같다.
// - 소나기는 눈·눈썹을 따로 떼어(rain-*.png) 깜빡임/눈동자 이동/눈썹 올림을 준다.
// - 그림 위에 보이는 소품(해·구름·빗방울)은 여기 없고 Mongsil.tsx의 CSS 애니메이션이다.
import type { Box, MongsilWeather } from "./layout";

export type EyePose = { blink?: number; lookX?: number; lookY?: number; browY?: number };
export type Pose = {
  yaw?: number; // 좌우 고개 돌림(rad)
  pitch?: number; // 끄덕임(rad)
  roll?: number; // 갸웃(rad)
  lean?: number; // 젤리 기울기(몸 높이 대비 비율)
  squash?: number; // 발 기준 세로 배율(1 = 그대로)
  bob?: number; // 위아래(이미지 px, 음수 = 위)
  shadeK?: number; // 회전에 따른 음영 변화 세기
  glint?: number; // 선글라스 반짝임 위치(-5 이하 = 꺼짐)
  eye?: EyePose;
};

export type MongsilEngine = {
  render: (pose: Pose) => void;
  resize: (bufferW: number, bufferH: number) => void;
  dispose: () => void;
};

// 캔버스는 몸 그림보다 사방으로 조금 크다(고개를 돌리거나 뛸 때 삐져나가는 곳).
export const CANVAS_MARGIN = { x: 0.07, top: 0.1, bottom: 0.03 } as const;
export function canvasBox(body: Box): Box {
  return {
    x: body.x - body.w * CANVAS_MARGIN.x,
    y: body.y - body.h * CANVAS_MARGIN.top,
    w: body.w * (1 + 2 * CANVAS_MARGIN.x),
    h: body.h * (1 + CANVAS_MARGIN.top + CANVAS_MARGIN.bottom),
  };
}

// 몸 그림 좌표계에서 발 가운데(움직임의 기준점)
const PIVOT: Record<MongsilWeather, [number, number]> = { sunny: [212, 520], cloudy: [211, 520], rain: [205, 631] };
// 소나기 얼굴 부품(몸 그림 좌표계)
const RAIN_PARTS = {
  patch: { x: 123, y: 207, w: 163, h: 94 },
  browL: { x: 134, y: 218, w: 33, h: 20 },
  browR: { x: 243, y: 217, w: 34, h: 20 },
  eyeL: { x: 133, y: 251, w: 34, h: 40 },
  eyeR: { x: 241, y: 251, w: 35, h: 40 },
} as const satisfies Record<string, Box>;
type PartName = keyof typeof RAIN_PARTS;
const PART_NAMES = Object.keys(RAIN_PARTS) as PartName[];

const CELL = 6; // 메시 한 칸(px). 작을수록 얇은 부분(우산 손잡이)이 덜 일그러진다.
const DEPTH_SCALE = 2; // 깊이 PNG: 8비트 값 = z(px) × 2, 가로세로 절반 해상도

const VS = `
attribute vec2 a_uv; attribute float a_z; attribute vec2 a_n;
uniform vec4 u_rect; uniform vec4 u_ltf; uniform vec2 u_ltr;
uniform vec2 u_size; uniform vec2 u_pivot; uniform vec2 u_canvas; uniform vec2 u_off;
uniform vec3 u_rot; uniform vec3 u_pose;
varying vec2 v_uv; varying float v_shade; varying float v_shade0;
void main(){
  vec2 pi = u_rect.xy + a_uv * u_rect.zw;
  pi = u_ltf.xy + (pi - u_ltf.xy) * u_ltf.zw + u_ltr;
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
  vec3 q = p - vec3(0.0, ty, 0.0);
  p = vec3(q.x, q.y * cp + q.z * sp, -q.y * sp + q.z * cp) + vec3(0.0, ty, 0.0);
  n = vec3(n.x, n.y * cp + n.z * sp, -n.y * sp + n.z * cp);
  float cr = cos(u_rot.z), sr = sin(u_rot.z);
  p.xy = vec2(p.x * cr - p.y * sr, p.x * sr + p.y * cr);
  n.xy = vec2(n.x * cr - n.y * sr, n.x * sr + n.y * cr);
  p.y += u_pose.z;
  vec2 c = p.xy + u_pivot + u_off;
  gl_Position = vec4(c.x / u_canvas.x * 2.0 - 1.0, 1.0 - c.y / u_canvas.y * 2.0, 0.0, 1.0);
  v_uv = a_uv;
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
varying vec2 v_uv; varying float v_shade; varying float v_shade0;
void main(){
  vec4 c = texture2D(u_tex, v_uv);
  float k = 1.0 + u_shadeK * (v_shade - v_shade0);
  c.rgb = min(c.rgb * k, vec3(c.a));
  if (u_glint > -5.0) {
    vec3 un = c.rgb / max(c.a, 0.001);
    float lum = dot(un, vec3(0.299, 0.587, 0.114));
    float lens = (1.0 - smoothstep(0.10, 0.24, lum)) * step(0.9, c.a);
    float d = abs(v_uv.x + 0.35 * v_uv.y - u_glint);
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

type Depth = { w: number; h: number; g: Float32Array };
function readDepth(img: HTMLImageElement): Depth {
  const c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const x = c.getContext("2d", { willReadFrequently: true });
  if (!x) throw new Error("no 2d context");
  x.drawImage(img, 0, 0);
  const d = x.getImageData(0, 0, c.width, c.height).data;
  const g = new Float32Array(c.width * c.height);
  for (let i = 0; i < g.length; i++) g[i] = d[i * 4] / DEPTH_SCALE; // px
  return { w: c.width, h: c.height, g };
}

// 이미지 px 좌표의 z(px). 깊이 PNG는 절반 해상도라 쌍선형 보간.
function sampleZ(D: Depth, x: number, y: number): number {
  const fx = Math.min(D.w - 1.001, Math.max(0, x / 2 - 0.5));
  const fy = Math.min(D.h - 1.001, Math.max(0, y / 2 - 0.5));
  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const tx = fx - x0;
  const ty = fy - y0;
  const a = D.g[y0 * D.w + x0];
  const b = D.g[y0 * D.w + x0 + 1];
  const c = D.g[(y0 + 1) * D.w + x0];
  const d = D.g[(y0 + 1) * D.w + x0 + 1];
  return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty;
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
  cx: number;
  cy: number;
};

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

  const partFiles = PART_NAMES.map((n) => `rain-${n}.png`);
  const [img, dimg, ...partImgs] = await Promise.all([
    loadImage(resolve(`mongsil-${weather}.png`)),
    loadImage(resolve(`mongsil-${weather}-depth.png`)),
    ...(weather === "rain" ? partFiles.map((f) => loadImage(resolve(f))) : []),
  ]);
  const D = readDepth(dimg);
  const W = img.naturalWidth;
  const H = img.naturalHeight;
  const marginX = CANVAS_MARGIN.x * W;
  const marginTop = CANVAS_MARGIN.top * H;
  const CW = W * (1 + 2 * CANVAS_MARGIN.x);
  const CH = H * (1 + CANVAS_MARGIN.top + CANVAS_MARGIN.bottom);

  const prog = gl.createProgram();
  if (!prog) throw new Error("no program");
  const vs = compile(gl, gl.VERTEX_SHADER, VS);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FS);
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link failed");
  gl.useProgram(prog);

  const uniformNames = ["u_rect", "u_ltf", "u_ltr", "u_size", "u_pivot", "u_canvas", "u_off", "u_rot", "u_pose", "u_tex", "u_alpha", "u_shadeK", "u_glint"] as const;
  const U = {} as Record<(typeof uniformNames)[number], WebGLUniformLocation | null>;
  for (const n of uniformNames) U[n] = gl.getUniformLocation(prog, n);
  const A = { uv: gl.getAttribLocation(prog, "a_uv"), z: gl.getAttribLocation(prog, "a_z"), n: gl.getAttribLocation(prog, "a_n") };

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

  function layer(image: HTMLImageElement, rect: Box, nx: number, ny: number, lift = 0): Layer {
    const verts: number[] = [];
    const idx: number[] = [];
    const zf = (x: number, y: number) => sampleZ(D, Math.min(W - 1, Math.max(0, x)), Math.min(H - 1, Math.max(0, y)));
    for (let j = 0; j <= ny; j++) {
      for (let i = 0; i <= nx; i++) {
        const u = i / nx;
        const v = j / ny;
        const x = rect.x + u * rect.w;
        const y = rect.y + v * rect.h;
        const z = zf(x, y) + lift;
        const e = 4;
        const dzx = (zf(x + e, y) - zf(x - e, y)) / (2 * e);
        const dzy = (zf(x, y + e) - zf(x, y - e)) / (2 * e);
        const l = Math.hypot(dzx, dzy, 1);
        verts.push(u, v, z, -dzx / l, -dzy / l);
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
    return { tex: texture(image), vb, ib, count: idx.length, rect, cx: rect.x + rect.w / 2, cy: rect.y + rect.h / 2 };
  }

  const body = layer(img, { x: 0, y: 0, w: W, h: H }, Math.ceil(W / CELL), Math.ceil(H / CELL));
  let parts: Record<PartName, Layer> | null = null;
  if (weather === "rain") {
    const p = {} as Record<PartName, Layer>;
    PART_NAMES.forEach((n, i) => {
      const isSkin = n === "patch";
      // 눈·눈썹은 얼굴 표면보다 살짝 앞(lift)에 둬서 고개를 돌려도 피부 속으로 파묻히지 않게 한다.
      p[n] = layer(partImgs[i], RAIN_PARTS[n], isSkin ? 12 : 4, isSkin ? 8 : 4, isSkin ? 0 : 2);
    });
    parts = p;
  }

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  function draw(L: Layer, ltf?: [number, number, number, number], ltr?: [number, number]) {
    const g = gl;
    g.bindBuffer(g.ARRAY_BUFFER, L.vb);
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, L.ib);
    g.enableVertexAttribArray(A.uv);
    g.vertexAttribPointer(A.uv, 2, g.FLOAT, false, 20, 0);
    g.enableVertexAttribArray(A.z);
    g.vertexAttribPointer(A.z, 1, g.FLOAT, false, 20, 8);
    g.enableVertexAttribArray(A.n);
    g.vertexAttribPointer(A.n, 2, g.FLOAT, false, 20, 12);
    g.bindTexture(g.TEXTURE_2D, L.tex);
    g.uniform4f(U.u_rect, L.rect.x, L.rect.y, L.rect.w, L.rect.h);
    const t = ltf ?? [L.cx, L.cy, 1, 1];
    g.uniform4f(U.u_ltf, t[0], t[1], t[2], t[3]);
    const r = ltr ?? [0, 0];
    g.uniform2f(U.u_ltr, r[0], r[1]);
    g.uniform1f(U.u_alpha, 1);
    g.drawElements(g.TRIANGLES, L.count, g.UNSIGNED_SHORT, 0);
  }

  const pivot = PIVOT[weather];

  function render(P: Pose) {
    const g = gl;
    g.clear(g.COLOR_BUFFER_BIT);
    g.uniform2f(U.u_size, W, H);
    g.uniform2f(U.u_pivot, pivot[0], pivot[1]);
    g.uniform2f(U.u_canvas, CW, CH);
    g.uniform2f(U.u_off, marginX, marginTop);
    g.uniform3f(U.u_rot, P.yaw ?? 0, P.pitch ?? 0, P.roll ?? 0);
    g.uniform3f(U.u_pose, P.lean ?? 0, P.squash ?? 1, P.bob ?? 0);
    g.uniform1f(U.u_shadeK, P.shadeK ?? 0.5);
    g.uniform1i(U.u_tex, 0);
    g.uniform1f(U.u_glint, P.glint ?? -10);
    draw(body);
    if (parts) {
      g.uniform1f(U.u_glint, -10);
      draw(parts.patch);
      const e = P.eye ?? {};
      const brow = e.browY ?? 0;
      const lx = e.lookX ?? 0;
      const ly = e.lookY ?? 0;
      const bl = e.blink ?? 0;
      draw(parts.browL, undefined, [lx * 0.5, brow]);
      draw(parts.browR, undefined, [lx * 0.5, brow]);
      const sy = 1 - 0.92 * bl;
      const sx = 1 + 0.1 * bl;
      for (const L of [parts.eyeL, parts.eyeR]) draw(L, [L.cx, L.cy, sx, sy], [lx, ly]);
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
    const g = gl;
    for (const t of textures) g.deleteTexture(t);
    for (const b of buffers) g.deleteBuffer(b);
    g.deleteProgram(prog);
    g.deleteShader(vs);
    g.deleteShader(fs);
    g.getExtension("WEBGL_lose_context")?.loseContext();
  }

  return { render, resize, dispose };
}
