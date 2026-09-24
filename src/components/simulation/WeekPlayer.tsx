"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import SampleTag from "@/components/ui/SampleTag";
import DualGraph from "./DualGraph";
import DayScrubber from "./DayScrubber";
import ForecastStage from "./ForecastStage";
import type { ForecastStory } from "@/mocks/sample";

// 한 장면에 머무는 시간(화면 연출 값, 계산과 무관)
const SCENE_MS = 2600;

// 예보 결과의 "몽실이와 한 주 미리 보기". 상태는 지금 장면 번호 하나뿐이고,
// 재생·날짜 탭·이전/다음·그래프 점 누르기가 모두 이 번호만 바꾼다. 재생은 그 번호를 일정 간격으로 넘겨 줄 뿐이다.
// 움직임 줄이기(prefers-reduced-motion)에서는 재생 버튼 없이 이전/다음과 날짜 탭으로 한 장면씩 본다.
// 화면 밖으로 나가거나 탭이 가려지면 재생 타이머가 쉬고, 돌아오면 이어진다.
export default function WeekPlayer({
  story,
  initialScene = 0,
}: {
  story: ForecastStory;
  initialScene?: number;
}) {
  const last = story.scenes.length - 1;
  const [index, setIndex] = useState(Math.min(last, Math.max(0, initialScene)));
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReduced(m.matches);
      if (m.matches) setPlaying(false);
    };
    sync();
    m.addEventListener("change", sync);

    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    const io =
      typeof IntersectionObserver === "undefined" || !root.current
        ? null
        : new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.25 });
    if (io && root.current) io.observe(root.current);

    return () => {
      m.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", onVisibility);
      io?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!playing || !onScreen || !pageVisible) return;
    const t = window.setTimeout(() => {
      if (index >= last) setPlaying(false);
      else setIndex(index + 1);
    }, SCENE_MS);
    return () => window.clearTimeout(t);
  }, [playing, onScreen, pageVisible, index, last]);

  // 직접 고르면 재생은 멈춘다.
  const go = (i: number) => {
    setPlaying(false);
    setIndex(Math.min(last, Math.max(0, i)));
  };

  const started = playing || index > 0;
  const ended = !playing && index === last;
  const onPlay = () => {
    if (playing) return setPlaying(false);
    if (index === last) setIndex(0);
    setPlaying(true);
  };
  const playLabel = playing
    ? "잠깐 멈추기"
    : ended
      ? "다시 보기"
      : started
        ? "이어서 보기"
        : "내 한 주 미리 보기";

  const scene = story.scenes[index];
  const pickHours = (hours: number) => {
    const i = story.scenes.findIndex((s) => s.hours === hours);
    if (i >= 0) go(i);
  };

  const stepBtn =
    "flex h-11 min-w-11 items-center gap-1 px-2 text-label text-cobalt disabled:text-subtext disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cobalt";

  return (
    <div ref={root}>
      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-body text-subtext">
          {story.title} · {story.amount}
        </p>
        <SampleTag>직접 입력 샘플</SampleTag>
      </div>

      <div className="mt-2">
        <ForecastStage scene={scene} />
      </div>

      <div className="mt-3">
        <DayScrubber story={story} current={index} onSelect={go} />
      </div>

      <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center">
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className={`${stepBtn} justify-self-start`}>
          <Icon name="chevron-left" size={16} />
          이전
        </button>
        {reduced ? (
          <p className="text-body text-subtext" aria-hidden="true">
            {index + 1} / {last + 1}
          </p>
        ) : (
          <Button size="md" onClick={onPlay}>
            {playLabel}
          </Button>
        )}
        <button type="button" onClick={() => go(index + 1)} disabled={index === last} className={`${stepBtn} justify-self-end`}>
          다음
          <Icon name="chevron-right" size={16} />
        </button>
      </div>

      {/* 재생 중에도 곡선의 수렴 구간이 하단 버튼에 가리지 않게(390×844) 보이는 섹션 제목은 두지 않는다. 범례가 같은 뜻이다. */}
      <h2 className="sr-only">표시체중 vs 실제 지방</h2>
      <Card variant="panel" className="mt-3">
        <DualGraph hours={scene.hours} onPick={pickHours} />
      </Card>
    </div>
  );
}
