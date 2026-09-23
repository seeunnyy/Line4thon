"use client";

import { useRef, useState } from "react";
import Header from "@/components/ui/Header";
import ProgressDots from "@/components/ui/ProgressDots";
import Avatar from "@/components/ui/Avatar";
import StickyBottom from "@/components/ui/StickyBottom";
import Button from "@/components/ui/Button";
import TextLink from "@/components/ui/TextLink";

const CARD_W = 220;
const GAP = 16;

// 카드마다 옅은 파스텔 그라데이션(임의 값, 에셋 확정 전 플레이스홀더).
const CARD_BG = [
  "linear-gradient(160deg, #DCE8FB, #F6F3FE)",
  "linear-gradient(160deg, #D7F1EF, #F6F3FE)",
  "linear-gradient(160deg, #FDE5E0, #F6F3FE)",
  "linear-gradient(160deg, #E6E1FA, #F6F3FE)",
  "linear-gradient(160deg, #E3EEFB, #FCF0F1)",
];

// 아바타 선택(온보딩 2/2). 프리셋 5장 가로 스와이프 + 점 표시. 몸 모양 옵션은 없다(몸은 고정).
export default function AvatarSelectPage() {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const goTo = (i: number) => {
    setIndex(i);
    scroller.current?.scrollTo({ left: i * (CARD_W + GAP), behavior: "smooth" });
  };

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / (CARD_W + GAP));
    setIndex(Math.min(CARD_BG.length - 1, Math.max(0, i)));
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
          <h1 className="mt-2 text-display font-bold">함께할 아바타를 골라 주세요</h1>
          <p className="mt-3 text-body text-subtext">
            나중에 마이페이지에서 언제든 꾸밀 수 있어요.
          </p>
        </div>

        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="아바타 프리셋"
          className="mt-6"
        >
          <div
            ref={scroller}
            onScroll={onScroll}
            role="radiogroup"
            aria-label="아바타 선택"
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc(50%-110px)] py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {CARD_BG.map((bg, i) => (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={index === i}
                aria-label={`아바타 ${i + 1}`}
                onClick={() => goTo(i)}
                style={{ width: CARD_W, height: 260, background: bg }}
                className={`flex flex-none snap-center flex-col items-center justify-between rounded-card px-4 pb-5 pt-8 shadow-coach outline outline-2 ${
                  index === i ? "outline-cobalt" : "outline-transparent"
                }`}
              >
                <Avatar size={160} />
                <span className="text-label text-subtext">아바타 {i + 1}</span>
              </button>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-center">
            {CARD_BG.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`아바타 ${i + 1} 선택`}
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
        <Button href="/app" size="lg" icon>
          이 아바타로 시작하기
        </Button>
        <TextLink href="/app/me/avatar" className="mt-1">
          꾸며서 시작할래요
        </TextLink>
      </StickyBottom>
    </div>
  );
}
