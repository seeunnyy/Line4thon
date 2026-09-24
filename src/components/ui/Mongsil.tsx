import type { Weather } from "@/mocks/sample";
import MongsilBody from "./MongsilBody";
import { CLOUD, DROP, DROPS, MONGSIL_ASPECT, SUN, place } from "./mongsil/layout";

// 몽실이(내 아바타) 전신. 세 가지 날씨 모습(맑음·흐림·소나기)은 public/avatar/의 투명 배경 PNG(컷아웃)이다.
// 몸통은 MongsilBody가 그린다: 정지 그림 위에, 브라우저가 WebGL을 쓸 수 있으면 깊이맵으로 입체감을 준
// 2.5D 캔버스가 얹혀서 날씨에 맞게 몽실이 자체가 움직인다(src/components/ui/mongsil/).
// 소품(해·구름·빗방울)은 따로 얹어서 CSS로 움직인다. 좌표는 세 모습이 함께 쓰는 590×672 캔버스 기준(mongsil/layout.ts)이고,
// 세 모습의 몸 위치·크기가 캔버스에서 같아서 날씨가 바뀌어도 몸이 흔들리지 않는다.
// CSS 모션은 tailwind.config.ts의 mongsil-* 애니메이션이고, prefers-reduced-motion에서는 몸·소품 모두 멈춘다.

export { MONGSIL_ASPECT };

export default function Mongsil({
  weather,
  height = 260,
  animate = true,
  shadow = true,
  className = "",
}: {
  weather: Weather;
  // 화면에 보이는 높이(px). 폭은 캔버스 비율(590:672)로 정해진다.
  height?: number;
  animate?: boolean;
  // 발 밑 부드러운 그림자(CSS). 원본 이미지의 바닥 그림자는 컷아웃에서 뺐다.
  shadow?: boolean;
  className?: string;
}) {
  const a = animate;

  return (
    <div
      aria-hidden="true"
      className={`relative flex-none ${className}`}
      style={{ height, width: height * MONGSIL_ASPECT }}
    >
      <MongsilBody weather={weather} animate={animate} shadow={shadow} />

      {weather === "sunny" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/avatar/prop-sun.png"
          alt=""
          width={SUN.w}
          height={SUN.h}
          draggable={false}
          style={place(SUN)}
          className={`pointer-events-none absolute select-none ${a ? "motion-safe:animate-mongsil-bob" : ""}`}
        />
      )}

      {weather === "cloudy" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/avatar/prop-cloud.png"
          alt=""
          width={CLOUD.w}
          height={CLOUD.h}
          draggable={false}
          style={place(CLOUD)}
          className={`pointer-events-none absolute select-none ${a ? "motion-safe:animate-mongsil-drift" : ""}`}
        />
      )}

      {weather === "rain" &&
        DROPS.map((d) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${d.x}-${d.y}`}
            src="/avatar/prop-drop.png"
            alt=""
            width={DROP.w}
            height={DROP.h}
            draggable={false}
            style={{ ...place({ x: d.x, y: d.y, ...DROP }), animationDelay: d.delay }}
            className={`pointer-events-none absolute select-none ${a ? "motion-safe:animate-mongsil-fall" : ""}`}
          />
        ))}
    </div>
  );
}
