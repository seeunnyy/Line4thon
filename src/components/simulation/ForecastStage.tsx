import type { ReactNode } from "react";
import HeroBackdrop from "@/components/ui/HeroBackdrop";
import Mongsil from "@/components/ui/Mongsil";
import SpeechBubble from "@/components/ui/SpeechBubble";
import { WEATHER_LABEL, type ForecastScene, type Weather } from "@/mocks/sample";

const WEATHERS: Weather[] = ["sunny", "cloudy", "rain"];
const FADE = "motion-safe:transition-opacity motion-safe:duration-500";
// 몽실이 높이(화면 배치 값). 390×844에서 무대 + 그래프가 하단 버튼 위에 다 들어오는 크기다.
const MONGSIL_H = 180;

// 예보 결과의 몽실이 무대: 화면 폭 전체를 채우는 한 장면. 위(top)에 제목·진행 막대, 가운데에 큰 숫자·말풍선·몽실이,
// 아래(children)에 날짜 이동·재생 조작이 얹힌다.
// 날씨가 바뀔 때 Mongsil의 weather를 바꾸면 캔버스를 다시 만들어 끊겨 보이므로, 배경과 몽실이를 세 날씨로 겹쳐 두고
// 투명도로 전환한다. 움직이는 건 지금 보이는 몽실이 하나뿐이다(animate). 몸은 그대로이고 날씨 모습으로만 반응한다.
export default function ForecastStage({
  scene,
  top,
  children,
}: {
  scene: ForecastScene;
  top?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section aria-label="몽실이 예보 장면" className="relative overflow-hidden">
      {WEATHERS.map((w) => (
        <HeroBackdrop
          key={w}
          weather={w}
          className={`absolute inset-0 ${FADE} ${scene.weather === w ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      <div className="relative px-5 pb-2 pt-4">
        {top}

        {/* 장면 글자. key로 장면마다 새로 그려 살짝 떠오르게 한다(움직임 줄이기에서는 바로 바뀐다). */}
        <div key={scene.id} aria-live="polite" aria-atomic="true" className="mt-2 text-center motion-safe:animate-fade-in">
          <p className="text-hero-num font-bold">{scene.big ?? WEATHER_LABEL[scene.weather]}</p>
          <p className="break-keep text-body text-subtext">{scene.note}</p>
          <SpeechBubble icon="sun" label={scene.label} className="mt-3">
            {scene.line}
          </SpeechBubble>
          <span className="sr-only">몽실이 모습: {WEATHER_LABEL[scene.weather]}</span>
        </div>

        {/* 몽실이 3겹: 말풍선 꼬리 바로 아래, 무대 가운데 */}
        <div
          className="pointer-events-none relative mx-auto mt-2"
          style={{ height: MONGSIL_H }}
        >
          {WEATHERS.map((w) => (
            <div
              key={w}
              className={`absolute inset-0 flex justify-center ${FADE} ${scene.weather === w ? "opacity-100" : "opacity-0"}`}
            >
              <Mongsil weather={w} height={MONGSIL_H} motion="calm" animate={scene.weather === w} />
            </div>
          ))}
        </div>

        {children}
      </div>
    </section>
  );
}
