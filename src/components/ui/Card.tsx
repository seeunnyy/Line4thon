import type { ReactNode } from "react";

// round: 흰색, 반경 32, shadow coach. panel: 흰색, 반경 0, shadow panel. tile: 흰색, 반경 12, shadow panel, p-2(작은 요약 카드).
// 패딩은 화면마다 달라질 수 있어 여기서 강제하지 않고(className으로 지정), round는 기본 p-4, tile은 p-2를 둔다.
export default function Card({
  variant = "round",
  children,
  className = "",
  dataSpec,
}: {
  variant?: "round" | "panel" | "tile";
  children: ReactNode;
  className?: string;
  dataSpec?: string;
}) {
  const base =
    variant === "round"
      ? "rounded-card bg-card p-4 shadow-coach"
      : variant === "tile"
        ? "rounded-tile bg-card p-2 shadow-panel"
        : "bg-card shadow-panel";
  return (
    <section data-spec={dataSpec} className={`${base} ${className}`}>
      {children}
    </section>
  );
}
