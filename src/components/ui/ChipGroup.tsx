import type { ReactNode } from "react";

const COLS = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" } as const;

// 단일 선택 묶음. role="radiogroup" + 각 Chip이 role="radio" aria-checked를 갖는다.
// columns를 주면 균등 그리드(예: 3+2 줄바꿈), 안 주면 한 줄 flex다. 칩 간격은 4px.
export default function ChipGroup({
  label,
  children,
  className = "",
  columns,
}: {
  label?: string;
  children: ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}) {
  const layout = columns ? `grid ${COLS[columns]} gap-1` : "flex gap-1";
  return (
    <div role="radiogroup" aria-label={label} className={`${layout} ${className}`}>
      {children}
    </div>
  );
}
