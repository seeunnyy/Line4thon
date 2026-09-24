import type { Weather } from "@/lib/model";

// 아바타 원 = 몽실이 얼굴. 원 크기와 배지 위치는 UI-SPEC.md 5장 .badge 기준(64px 아바타에서 left 47.5 / top 47 / 21x21)을
// size 비율로 계산해 다른 크기에서도 같은 비율을 유지한다(얼굴 이미지는 원 안쪽에서만 잘려서 규격 좌표는 그대로다).
// weather: 얼굴 모습(맑음=선글라스 / 흐림=눈 감고 미소 / 소나기=놀란 표정). 기본은 흐림(차분한 미소).
// ring: 지름 + 12px 그라데이션 링(#DCE8FB → #FDCEC4). 지금 화면에서는 쓰지 않는다(홈·꾸미기는 전신 Mongsil).
export default function Avatar({
  size = 32,
  weather = "cloudy",
  badge = false,
  shadow = false,
  ring = false,
  dataSpec,
  className = "",
}: {
  size?: number;
  weather?: Weather;
  badge?: boolean;
  shadow?: boolean;
  ring?: boolean;
  dataSpec?: string;
  className?: string;
}) {
  const badgeSize = (size * 21) / 64;
  const badgeLeft = (size * 47.5) / 64;
  const badgeTop = (size * 47) / 64;

  const disc = (
    <span
      data-spec={ring ? undefined : dataSpec}
      aria-hidden="true"
      className={`relative inline-block flex-none rounded-full bg-disc ${shadow ? "shadow-avatar" : ""} ${ring ? "" : className}`}
      style={{ width: size, height: size }}
    >
      {/* 얼굴: 하늘색 바탕(원본 렌더 배경과 같은 톤) 위에 투명 PNG. 원 안에서만 잘린다. */}
      <span
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{ background: "linear-gradient(160deg, #D7E6FA, #EDF3FD)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/avatar/face-${weather}.png`}
          alt=""
          width={size}
          height={size}
          draggable={false}
          className="block h-full w-full select-none"
        />
      </span>
      {badge && (
        <span
          className="absolute rounded-full bg-white shadow-badge"
          style={{ width: badgeSize, height: badgeSize, left: badgeLeft, top: badgeTop }}
        />
      )}
    </span>
  );

  if (!ring) return disc;

  return (
    <span
      data-spec={dataSpec}
      aria-hidden="true"
      className={`inline-flex flex-none items-center justify-center rounded-full p-[6px] ${className}`}
      style={{ background: "linear-gradient(135deg, #DCE8FB, #FDCEC4)" }}
    >
      {disc}
    </span>
  );
}
