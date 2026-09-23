import type { ReactNode } from "react";

// round: 흰색, 반경 32, shadow coach. panel: 흰색, 반경 0, shadow panel.
// 패딩은 화면마다 달라질 수 있어 여기서 강제하지 않고(className으로 지정), round만 기본 p-4를 둔다.
export default function Card({
  variant = "round",
  children,
  className = "",
  dataSpec,
}: {
  variant?: "round" | "panel";
  children: ReactNode;
  className?: string;
  dataSpec?: string;
}) {
  const base =
    variant === "round" ? "rounded-card bg-card p-4 shadow-coach" : "bg-card shadow-panel";
  return (
    <section data-spec={dataSpec} className={`${base} ${className}`}>
      {children}
    </section>
  );
}
