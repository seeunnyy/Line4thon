"use client";

import { useId } from "react";
import { SPAN_H, WATER_CLEAR_H, displayedKg, kgLabel, type Components } from "@/lib/simulation";

// 이중 그래프(표시체중 vs 실제 지방). 곡선은 시뮬레이션 엔진(SIMULATION.md 4장)의 계산값으로 그린다:
// 표시체중은 장내용물(48h)·수분(60h)이 선형으로 줄어들며 실제 지방선에 붙는다. 숫자 축은 없고 높이는 이벤트 직후 값 기준 비율이다.
const W = 318;
const H = 170;
const BASE_Y = 158; // x축(0kg 기준선)
const TOP_Y = 30; // 이벤트 직후 표시체중의 높이
// 탭 지점: 이벤트 직후 · 24시간 · 48시간 · 72시간(표시체중 전체 수렴 48~72시간, SIMULATION.md 2장)
const HOURS = [0, 24, 48, 72] as const;
const AXIS = ["이벤트 직후", "24시간", "48시간", "72시간"] as const;
// 선형 구간이 꺾이는 시점: 장내용물이 다 빠지는 48h, 수분이 다 빠지는 60h
const KNOTS = [0, 24, 48, WATER_CLEAR_H, SPAN_H];

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

// 예보 결과의 한 주 미리 보기에 붙는 그래프: 곡선이 재생 위치(hours)까지만 그려지고, 점을 누르면 그 시점(시간)을 onPick으로 알린다.
// hours가 null이면 이벤트 전이라 곡선을 그리지 않는다.
// compact는 무대 아래에 붙이는 낮은 판: 그림 높이만 줄이고(가로는 그대로) 선 굵기는 유지한다.
export default function DualGraph({
  sim,
  hours,
  onPick,
  compact = false,
}: {
  sim: Components;
  hours: number | null;
  onPick: (hours: number) => void;
  compact?: boolean;
}) {
  const peak = displayedKg(sim, 0);
  const x = (t: number) => (t / SPAN_H) * W;
  const y = (kg: number) => BASE_Y - (kg / peak) * (BASE_Y - TOP_Y);
  const FAT_Y = y(sim.fatKg);
  const CURVE = KNOTS.map((t) => `${x(t)},${y(displayedKg(sim, t))}`).join(" ");
  const AREA = `${CURVE} ${W},${FAT_Y} 0,${FAT_Y}`;
  const POINTS = HOURS.map((t) => ({ x: x(t), y: y(displayedKg(sim, t)) }));

  const reached = (i: number) => hours !== null && HOURS[i] <= hours;
  const active = HOURS.reduce((acc, _h, i) => (reached(i) ? i : acc), -1);
  const reveal = hours === null ? 0 : Math.min(1, Math.max(0, hours / SPAN_H));
  const point = active >= 0 ? POINTS[active] : null;
  const clipId = `dual-graph-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  // compact에서 세로로 눌러도 선 굵기·점선 간격이 변하지 않게 한다.
  const stroke = compact ? ({ vectorEffect: "non-scaling-stroke" } as const) : {};
  const label = `표시체중과 실제 지방의 변화 그래프예요. 표시체중은 이벤트 직후 ${kgLabel(peak, true)}로 가장 높고, 다음 날 ${kgLabel(displayedKg(sim, 24), true)}, 48~72시간에 걸쳐 실제 지방 ${kgLabel(sim.fatKg)} 선에 가까워져요.`;

  return (
    <div className={compact ? "px-3 py-3" : "p-4"}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <ul className="flex items-center gap-4 text-body">
          <li className="flex items-center gap-2">
            <svg width="20" height="8" aria-hidden="true" className="flex-none">
              <line x1="0" y1="4" x2="20" y2="4" stroke="#225FA5" strokeWidth="3" strokeLinecap="round" />
            </svg>
            표시체중
          </li>
          <li className="flex items-center gap-2">
            <svg width="20" height="8" aria-hidden="true" className="flex-none">
              <line x1="0" y1="4" x2="20" y2="4" stroke="#006B56" strokeWidth="2" strokeDasharray="4 3" />
            </svg>
            실제 지방
          </li>
        </ul>
      </div>

      <div className={`relative ${compact ? "mt-2" : "mt-4"}`}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={label}
          preserveAspectRatio={compact ? "none" : undefined}
          className={`block w-full ${compact ? "h-[96px]" : "h-auto"}`}
        >
          <defs>
            <clipPath id={clipId}>
              {/* 재생 위치까지만 보이게 가로로 늘어나는 창. 움직임 줄이기에서는 바로 그 위치로 간다. */}
              <rect
                x="0"
                y="0"
                width={W}
                height={H}
                style={{ transform: `scaleX(${reveal})`, transformOrigin: "0 0" }}
                className="motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out"
              />
            </clipPath>
          </defs>
          <line x1="0" y1={BASE_Y} x2={W} y2={BASE_Y} stroke="#E4E1EC" strokeWidth="1" {...stroke} />
          <polygon points={AREA} fill="#225FA5" fillOpacity="0.08" clipPath={`url(#${clipId})`} />
          {point && (
            <line
              x1={point.x}
              y1={point.y}
              x2={point.x}
              y2={BASE_Y}
              stroke="#225FA5"
              strokeOpacity="0.35"
              strokeWidth="1"
              strokeDasharray="3 3"
              {...stroke}
            />
          )}
          <line
            x1="0"
            y1={FAT_Y}
            x2={W}
            y2={FAT_Y}
            stroke="#006B56"
            strokeWidth="2"
            strokeDasharray="5 4"
            {...stroke}
          />
          <polyline
            clipPath={`url(#${clipId})`}
            points={CURVE}
            fill="none"
            stroke="#225FA5"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            {...stroke}
          />
        </svg>

        {hours === null && (
          <p className="absolute inset-x-0 top-[22%] text-center text-body text-subtext">
            이벤트가 끝나면 곡선이 그려져요
          </p>
        )}

        {/* 44×44 탭 영역. SVG 위에 겹친 HTML 버튼이라 키보드로도 고를 수 있다. */}
        {POINTS.map((p, i) => {
          const selected = i === active;
          return (
            <button
              key={AXIS[i]}
              type="button"
              aria-label={`${AXIS[i]} 시점 보기`}
              aria-pressed={selected}
              onClick={() => onPick(HOURS[i])}
              style={{ left: pct(p.x, W), top: pct(p.y, H) }}
              className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-cobalt"
            >
              <span
                aria-hidden="true"
                className={`rounded-full border-2 ${
                  selected
                    ? "h-4 w-4 border-cobalt bg-cobalt ring-2 ring-white"
                    : reached(i)
                      ? "h-3 w-3 border-cobalt bg-white"
                      : "h-3 w-3 border-line bg-white"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* x축 라벨: 점의 가로 위치와 맞춘다(양 끝은 안쪽 정렬) */}
      <div aria-hidden="true" className="relative mt-1 h-[18px] text-body text-subtext">
        {AXIS.map((axis, i) => {
          const px = POINTS[i].x;
          const shift = i === 0 ? "0" : i === POINTS.length - 1 ? "-100%" : "-50%";
          return (
            <span
              key={axis}
              style={{ left: pct(px, W), transform: `translateX(${shift})` }}
              className={`absolute top-0 whitespace-nowrap ${i === active ? "font-bold text-ink" : ""}`}
            >
              {axis}
            </span>
          );
        })}
      </div>

    </div>
  );
}
