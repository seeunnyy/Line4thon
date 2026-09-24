"use client";

import { useId, useState } from "react";
import SampleTag from "@/components/ui/SampleTag";
import { GRAPH_POINTS } from "@/mocks/sample";

// 이중 그래프(표시체중 vs 실제 지방)의 UI 시안. 숫자 축은 없고, 곡선은 SIMULATION.md 3장의 모양만 따른 예시다:
// 표시체중은 장내용물(48h)·수분(60h)이 선형으로 줄어들며 실제 지방선에 붙는다.
const W = 318;
const H = 170;
const BASE_Y = 158; // x축(기준선)
const FAT_Y = 150; // 실제 지방 수평선
const CURVE = "0,30 106,81 212,133 265,150 318,150";
const AREA = `${CURVE} 318,${FAT_Y} 0,${FAT_Y}`;
// 탭 지점: 이벤트 직후 · 24시간 · 48시간 · 72시간(표시체중 전체 수렴 48~72시간, SIMULATION.md 2장)
const HOURS = [0, 24, 48, 72] as const;
const SPAN_H = 72;
const POINTS = [
  { x: 0, y: 30 },
  { x: 106, y: 81 },
  { x: 212, y: 133 },
  { x: 318, y: 150 },
] as const;

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

// hours를 주면 스토리 모드(예보 결과의 한 주 미리 보기): 곡선이 그 시점까지만 그려지고, 점을 누르면 그 시점(시간)을 onPick으로 알린다.
// hours가 null이면 이벤트 전이라 곡선을 그리지 않는다. hours를 안 주면 점을 눌러 설명을 보는 단독 모드다.
// compact는 무대 아래에 붙이는 낮은 판: 그림 높이만 줄이고(가로는 그대로) 선 굵기는 유지한다.
export default function DualGraph({
  hours,
  onPick,
  compact = false,
}: {
  hours?: number | null;
  onPick?: (hours: number) => void;
  compact?: boolean;
} = {}) {
  const story = hours !== undefined;
  const [picked, setPicked] = useState(1); // 단독 모드 기본: 24시간(다음 날)
  const reached = (i: number) => !story || (hours !== null && HOURS[i] <= hours);
  const active = story ? HOURS.reduce((acc, h, i) => (reached(i) ? i : acc), -1) : picked;
  const reveal = story ? (hours === null ? 0 : Math.min(1, Math.max(0, hours / SPAN_H))) : 1;
  const point = active >= 0 ? POINTS[active] : null;
  const info = GRAPH_POINTS[Math.max(0, active)];
  const clipId = `dual-graph-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  // compact에서 세로로 눌러도 선 굵기·점선 간격이 변하지 않게 한다.
  const stroke = compact ? ({ vectorEffect: "non-scaling-stroke" } as const) : {};

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
        <SampleTag>예시 곡선 · 샘플</SampleTag>
      </div>

      <div className={`relative ${compact ? "mt-2" : "mt-4"}`}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="표시체중과 실제 지방의 변화를 보여주는 예시 그래프예요. 표시체중은 이벤트 직후 가장 높고, 48~72시간에 걸쳐 실제 지방 선에 가까워져요."
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

        {story && hours === null && (
          <p className="absolute inset-x-0 top-[22%] text-center text-body text-subtext">
            이벤트가 끝나면 곡선이 그려져요
          </p>
        )}

        {/* 44×44 탭 영역. SVG 위에 겹친 HTML 버튼이라 키보드로도 고를 수 있다. */}
        {POINTS.map((p, i) => {
          const selected = i === active;
          return (
            <button
              key={GRAPH_POINTS[i].axis}
              type="button"
              aria-label={`${GRAPH_POINTS[i].axis} 시점 보기`}
              aria-pressed={selected}
              onClick={() => (story ? onPick?.(HOURS[i]) : setPicked(i))}
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
        {GRAPH_POINTS.map((g, i) => {
          const x = POINTS[i].x;
          const shift = i === 0 ? "0" : i === POINTS.length - 1 ? "-100%" : "-50%";
          return (
            <span
              key={g.axis}
              style={{ left: pct(x, W), transform: `translateX(${shift})` }}
              className={`absolute top-0 whitespace-nowrap ${i === active ? "font-bold text-ink" : ""}`}
            >
              {g.axis}
            </span>
          );
        })}
      </div>

      {!story && (
        <p aria-live="polite" className="mt-3 bg-surface-low px-3 py-3 text-body">
          <span className="font-bold">{info.label}</span> · {info.text}
        </p>
      )}
    </div>
  );
}
