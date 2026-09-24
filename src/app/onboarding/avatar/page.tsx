"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import ProgressDots from "@/components/ui/ProgressDots";
import Mongsil from "@/components/ui/Mongsil";
import StickyBottom from "@/components/ui/StickyBottom";
import Button from "@/components/ui/Button";
import TextLink from "@/components/ui/TextLink";
import { WEATHER_MOOD_LABEL, type Weather } from "@/lib/model";
import { getStore, saveAvatar } from "@/lib/storage";

const CARD_W = 240;
const GAP = 16;

// 몽실이 세 가지 모습. 카드 배경은 홈 히어로의 날씨 그라데이션과 같은 결이다(임의 값, 에셋 확정 전).
const LOOKS: { weather: Weather; bg: string }[] = [
  { weather: "sunny", bg: "linear-gradient(160deg, #DCE8FB, #F6F3FE)" },
  { weather: "cloudy", bg: "linear-gradient(160deg, #DDE2EE, #F3F3F8)" },
  { weather: "rain", bg: "linear-gradient(160deg, #C9D7F0, #EEF1FA)" },
];

// 아바타 설정(온보딩 2/2). 몽실이가 날씨에 따라 표정·소품이 달라진다는 것을 보여주는 3장 스와이프 + 점 표시.
// 고르는 화면이 아니라 소개 화면이다(캐릭터는 하나, 몸은 고정). 꾸미기는 "꾸며서 시작할래요"로 이어진다.
export default function AvatarSelectPage() {
  const router = useRouter();
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // 정보 입력을 건너뛰고 들어오면 정보 입력으로 돌려보낸다.
  useEffect(() => {
    if (!getStore().profile) router.replace("/onboarding/profile");
  }, [router]);

  const start = (href: string) => {
    saveAvatar({ character: "mongsil" });
    router.push(href);
  };

  const goTo = (i: number) => {
    setIndex(i);
    scroller.current?.scrollTo({ left: i * (CARD_W + GAP), behavior: "smooth" });
  };

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / (CARD_W + GAP));
    setIndex(Math.min(LOOKS.length - 1, Math.max(0, i)));
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <Header
        variant="back"
        backHref="/onboarding/profile"
        center={<ProgressDots total={2} current={2} />}
      />

      <main className="flex-1 pb-4">
        <div className="px-5">
          <h1 className="mt-2 text-display font-bold">몽실이가 날씨를 예보해요</h1>
          <p className="mt-3 text-body text-subtext">
            일정과 컨디션에 따라 표정과 소품이 달라져요. 나중에 마이페이지에서 언제든 꾸밀 수 있어요.
          </p>
        </div>

        <div role="group" aria-roledescription="carousel" aria-label="몽실이 모습" className="mt-4">
          <div
            ref={scroller}
            onScroll={onScroll}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc(50%-120px)] py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {LOOKS.map(({ weather, bg }, i) => (
              <button
                key={weather}
                type="button"
                aria-label={`${WEATHER_MOOD_LABEL[weather]} 몽실이 보기`}
                aria-current={index === i}
                onClick={() => goTo(i)}
                style={{ width: CARD_W, height: 320, background: bg }}
                className="flex flex-none snap-center flex-col items-center justify-between rounded-card px-4 pb-4 pt-4 shadow-coach focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt"
              >
                <Mongsil weather={weather} height={250} animate={index === i} />
                <span className="text-label text-subtext">{WEATHER_MOOD_LABEL[weather]}</span>
              </button>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-center">
            {LOOKS.map(({ weather }, i) => (
              <button
                key={weather}
                type="button"
                aria-label={`${i + 1}번째 모습으로 이동`}
                aria-current={index === i}
                onClick={() => goTo(i)}
                className="flex h-11 w-11 items-center justify-center"
              >
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full ${index === i ? "bg-cobalt" : "bg-line"}`}
                />
              </button>
            ))}
          </div>
        </div>
      </main>

      <StickyBottom>
        <Button onClick={() => start("/app")} size="lg" icon>
          몽실이와 시작하기
        </Button>
        <TextLink onClick={() => start("/app/me/avatar")} className="mt-1">
          꾸며서 시작할래요
        </TextLink>
      </StickyBottom>
    </div>
  );
}
