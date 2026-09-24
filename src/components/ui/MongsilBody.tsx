"use client";

import { useEffect, useRef, useState } from "react";
import { BODY, SHADOW, place, type MongsilWeather } from "./mongsil/layout";
import { canvasBox, createEngine, type MongsilEngine, type Pose } from "./mongsil/engine";
import { poseAt, shadowFor, TAP_SECONDS } from "./mongsil/motion";

// 몽실이 몸통(+발 밑 그림자). 두 가지 모습을 겹쳐 둔다.
//  1) <img> : 서버에서 그대로 그려지는 정지 그림. 움직임을 못 쓰는 환경의 대체 화면이기도 해서,
//     이때는 예전처럼 CSS로 아주 살짝 숨 쉬는 2D 움직임만 남는다.
//  2) 캔버스 : 브라우저가 WebGL을 쓸 수 있으면 첫 프레임이 그려진 뒤에 <img> 자리를 대신한다(2.5D 움직임).
// 움직임을 끄는 경우: prefers-reduced-motion, animate=false(온보딩에서 지금 안 보이는 카드), 화면 밖·탭이 가려짐.
export default function MongsilBody({
  weather,
  animate,
  shadow,
}: {
  weather: MongsilWeather;
  animate: boolean;
  shadow: boolean;
}) {
  const body = BODY[weather];
  const [live, setLive] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const shadowRef = useRef<HTMLSpanElement>(null);
  const animateRef = useRef(animate);
  const syncRef = useRef<() => void>(() => {});

  useEffect(() => {
    animateRef.current = animate;
    syncRef.current();
  }, [animate]);

  useEffect(() => {
    const host = hostRef.current;
    const img = imgRef.current;
    if (!host || !img) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let failed = false;
    let creating = false;
    let visible = true;
    let engine: MongsilEngine | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let raf = 0;
    let last = 0;
    let t = 0; // 실제로 움직인 시간(초). 멈춰 있던 동안은 흐르지 않아서 다시 시작해도 툭 튀지 않는다.
    let tapAt: number | null = null;
    let pose: Pose = {};

    const want = () => animateRef.current && visible && !document.hidden;

    const applyShadow = (p: Pose) => {
      const el = shadowRef.current;
      if (!el) return;
      const s = shadowFor(p);
      el.style.transform = `scale(${s.scale})`;
      el.style.opacity = String(s.opacity);
    };

    const draw = () => {
      if (!engine) return;
      const tapAge = tapAt == null ? null : t - tapAt;
      if (tapAge != null && tapAge > TAP_SECONDS) tapAt = null;
      pose = poseAt(weather, t, tapAt == null ? null : tapAge);
      engine.render(pose);
      applyShadow(pose);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      t += Math.min(0.1, (now - last) / 1000);
      last = now;
      draw();
    };
    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // 캔버스 버퍼 크기: 화면 배율(최대 2배)에 맞추되, 1배 화면에서도 1.5배로 그려서 축소될 때 자글거리지 않게 한다.
    const fit = () => {
      if (!engine) return;
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      const k = Math.min(2, Math.max(1.5, window.devicePixelRatio || 1));
      engine.resize(w * k, h * k);
      draw();
    };

    const sync = () => {
      if (disposed) return;
      if (reduce.matches || failed) {
        stop();
        setLive(false);
        return;
      }
      if (!want()) {
        stop();
        return;
      }
      if (engine) {
        setLive(true);
        start();
        return;
      }
      if (creating) return;
      creating = true;
      const cv = document.createElement("canvas");
      cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
      createEngine(cv, weather)
        .then((e) => {
          creating = false;
          if (disposed) {
            e.dispose();
            return;
          }
          engine = e;
          canvas = cv;
          cv.addEventListener("webglcontextlost", (ev) => {
            ev.preventDefault();
            failed = true;
            sync();
          });
          cv.addEventListener("pointerdown", () => {
            if (raf) tapAt = t;
          });
          host.appendChild(cv);
          fit();
          sync();
        })
        .catch(() => {
          creating = false;
          failed = true; // WebGL을 못 쓰면 정지 그림(+CSS 숨쉬기)으로 남는다
          sync();
        });
    };
    syncRef.current = sync;

    const onVisibility = () => sync();
    const io = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      sync();
    });
    io?.observe(host);
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(fit);
    ro?.observe(host);
    document.addEventListener("visibilitychange", onVisibility);
    reduce.addEventListener("change", sync);
    sync();

    return () => {
      disposed = true;
      stop();
      io?.disconnect();
      ro?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduce.removeEventListener("change", sync);
      engine?.dispose();
      canvas?.remove();
      syncRef.current = () => {};
      setLive(false);
    };
  }, [weather]);

  return (
    <>
      {shadow && (
        <span
          ref={shadowRef}
          className="absolute"
          style={{
            ...place(SHADOW),
            background: "radial-gradient(closest-side, rgba(27,27,34,.20), rgba(27,27,34,0))",
          }}
        />
      )}

      {/* 몸통 정지 그림. 발 가운데를 기준으로 아주 조금 커졌다 줄어들어 숨 쉬는 느낌을 낸다(캔버스가 뜨기 전·못 쓸 때). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={`/avatar/mongsil-${weather}.png`}
        alt=""
        width={body.w}
        height={body.h}
        draggable={false}
        style={{ ...place(body), transformOrigin: "50% 100%" }}
        className={`absolute select-none ${live ? "opacity-0" : animate ? "motion-safe:animate-mongsil-breathe" : ""}`}
      />

      {/* 2.5D 캔버스가 들어오는 자리. 몸 그림보다 사방으로 조금 크다. */}
      <div ref={hostRef} className={`absolute ${live ? "" : "invisible"}`} style={place(canvasBox(body))} />
    </>
  );
}
