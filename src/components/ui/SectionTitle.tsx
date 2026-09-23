import type { ReactNode } from "react";
import Icon, { type IconName } from "./Icon";

// UI-SPEC.md 5장 .sec 그대로: 아이콘 15 + 간격 8, 14px, 높이 20. h2로 렌더한다.
export default function SectionTitle({
  icon = "info",
  children,
  dataSpec,
}: {
  icon?: IconName;
  children: ReactNode;
  dataSpec?: string;
}) {
  return (
    <h2 data-spec={dataSpec} className="mt-[25px] flex h-5 items-center gap-2 text-section">
      <Icon name={icon} size={15} />
      <span>{children}</span>
    </h2>
  );
}
