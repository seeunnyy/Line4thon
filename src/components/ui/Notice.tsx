import type { ReactNode } from "react";
import Icon from "./Icon";

// UI-SPEC.md 5장 .notice 그대로: 아이콘 14, 첫 줄 기준 위 2px.
export default function Notice({
  children,
  dataSpec,
  textDataSpec,
}: {
  children: ReactNode;
  dataSpec?: string;
  textDataSpec?: string;
}) {
  return (
    <div
      data-spec={dataSpec}
      className="mt-6 flex gap-[3.3px] bg-surface-low pb-2 pl-2 pr-[25px] pt-2 text-body text-subtext"
    >
      <Icon name="info" size={14} className="mt-[2px]" />
      <p data-spec={textDataSpec}>{children}</p>
    </div>
  );
}
