// 아바타 원(빈 자리, disc). badge는 UI-SPEC.md 5장 .badge 기준(64px 아바타에서 left 47.5 / top 47 / 21x21)을
// size 비율로 계산해 다른 크기에서도 같은 비율을 유지한다.
// ring: 지름 + 12px 그라데이션 링(#DCE8FB → #FDCEC4). 홈 히어로·아바타 꾸미기에서 쓴다.
export default function Avatar({
  size = 32,
  badge = false,
  shadow = false,
  ring = false,
  dataSpec,
  className = "",
}: {
  size?: number;
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
