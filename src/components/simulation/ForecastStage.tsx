import HeroBackdrop from "@/components/ui/HeroBackdrop";
import Mongsil from "@/components/ui/Mongsil";
import { WEATHER_LABEL, type ForecastScene, type Weather } from "@/mocks/sample";

const WEATHERS: Weather[] = ["sunny", "cloudy", "rain"];
const FADE = "motion-safe:transition-opacity motion-safe:duration-500";

// 예보 결과의 몽실이 무대: 큰 숫자 한 줄 + 말풍선 한 줄 + 몽실이.
// 날씨가 바뀔 때 Mongsil의 weather를 바꾸면 캔버스를 다시 만들어 끊겨 보이므로, 배경과 몽실이를 세 날씨로 겹쳐 두고
// 투명도로 전환한다. 움직이는 건 지금 보이는 몽실이 하나뿐이다(animate). 몸은 그대로이고 날씨 모습으로만 반응한다.
export default function ForecastStage({ scene }: { scene: ForecastScene }) {
  return (
    <section aria-label="몽실이 예보 장면" className="relative overflow-hidden rounded-card shadow-coach">
      {WEATHERS.map((w) => (
        <HeroBackdrop
          key={w}
          weather={w}
          className={`absolute inset-0 ${FADE} ${scene.weather === w ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      <div className="relative px-4 pb-4 pt-4">
        {/* 장면 글자. key로 장면마다 새로 그려 살짝 떠오르게 한다(움직임 줄이기에서는 바로 바뀐다). */}
        <div key={scene.id} aria-live="polite" aria-atomic="true" className="relative z-[1] motion-safe:animate-fade-in">
          <p className="text-hero-num font-bold">{scene.big ?? WEATHER_LABEL[scene.weather]}</p>
          <p className="min-h-[36px] text-body text-subtext">{scene.note}</p>

          {/* 오른쪽은 몽실이 자리(아래 absolute). 높이도 몽실이(140)만큼 확보한다. */}
          <div className="mt-3 flex min-h-[140px] items-center pr-[116px]">
            {/* 말풍선: 오른쪽 위 모서리만 8이라 오른쪽 몽실이가 말하는 모양(UI-SPEC 3장 반경 집합) */}
            <div className="min-w-0 flex-1 rounded-[32px_8px_32px_32px] bg-white px-4 pb-4 pt-3 shadow-coach">
              <p className="text-body text-cobalt">{scene.label}</p>
              <p className="mt-1 text-lead">{scene.line}</p>
            </div>
            <span className="sr-only">몽실이 모습: {WEATHER_LABEL[scene.weather]}</span>
          </div>
        </div>

        {/* 몽실이 3겹: 말풍선 오른쪽 아래. 캔버스가 몸보다 좌우로 넓어 겹쳐도 말풍선이 위에 온다. */}
        <div className="pointer-events-none absolute bottom-4 right-3 z-0 h-[140px] w-[123px]">
          {WEATHERS.map((w) => (
            <div
              key={w}
              className={`absolute inset-0 flex justify-center ${FADE} ${scene.weather === w ? "opacity-100" : "opacity-0"}`}
            >
              <Mongsil weather={w} height={140} motion="calm" animate={scene.weather === w} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
