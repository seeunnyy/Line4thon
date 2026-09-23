"use client";

import { useState } from "react";
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
// 탭 지점: 이벤트 직후 · 24시간 · 48시간 · 72시간
const POINTS = [
  { x: 0, y: 30 },
  { x: 106, y: 81 },
  { x: 212, y: 133 },
  { x: 318, y: 150 },
] as const;

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

export default function DualGraph() {
  const [active, setActive] = useState(1); // 기본: 24시간(다음 날)
  const point = POINTS[active];
  const info = GRAPH_POINTS[active];

  return (
    <div className="p-4">
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

      <div className="relative mt-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="표시체중과 실제 지방의 변화를 보여주는 예시 그래프예요. 표시체중은 이벤트 직후 가장 높고, 48~72시간에 걸쳐 실제 지방 선에 가까워져요."
          className="block h-auto w-full"
        >
          <line x1="0" y1={BASE_Y} x2={W} y2={BASE_Y} stroke="#E4E1EC" strokeWidth="1" />
          <polygon points={AREA} fill="#225FA5" fillOpacity="0.08" />
          <line
            x1={point.x}
            y1={point.y}
            x2={point.x}
            y2={BASE_Y}
            stroke="#225FA5"
            strokeOpacity="0.35"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <line
            x1="0"
            y1={FAT_Y}
            x2={W}
            y2={FAT_Y}
            stroke="#006B56"
            strokeWidth="2"
            strokeDasharray="5 4"
          />
          <polyline
            points={CURVE}
            fill="none"
            stroke="#225FA5"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>

        {/* 44×44 탭 영역. SVG 위에 겹친 HTML 버튼이라 키보드로도 고를 수 있다. */}
        {POINTS.map((p, i) => {
          const selected = i === active;
          return (
            <button
              key={GRAPH_POINTS[i].axis}
              type="button"
              aria-label={`${GRAPH_POINTS[i].axis} 시점 보기`}
              aria-pressed={selected}
              onClick={() => setActive(i)}
              style={{ left: pct(p.x, W), top: pct(p.y, H) }}
              className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-cobalt"
            >
              <span
                aria-hidden="true"
                className={`rounded-full border-2 border-cobalt ${
                  selected
                    ? "h-4 w-4 bg-cobalt ring-2 ring-white"
                    : "h-3 w-3 bg-white"
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

      <p aria-live="polite" className="mt-3 bg-surface-low px-3 py-3 text-body">
        <span className="font-bold">{info.label}</span> · {info.text}
      </p>
    </div>
  );
}
