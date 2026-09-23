import type { ReactNode } from "react";
import Icon, { type IconName } from "./Icon";

// 홈 히어로 말풍선: 흰색, 반경 32, 패딩 16/20, shadow coach, 아래쪽 가운데 12px 꼬리.
// 위 줄은 아이콘 16(빈 자리) + 12px 코발트 글자, 본문은 lead(15/23).
export default function SpeechBubble({
  icon = "sun",
  label,
  children,
  className = "",
}: {
  icon?: IconName;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-card bg-white px-5 py-4 text-left shadow-coach after:absolute after:left-1/2 after:top-full after:-mt-[6px] after:h-3 after:w-3 after:-translate-x-1/2 after:rotate-45 after:bg-white after:content-[''] ${className}`}
    >
      <div className="flex items-center gap-1 text-body text-cobalt">
        <Icon name={icon} size={16} />
        <span>{label}</span>
      </div>
      <p className="mt-1 text-lead">{children}</p>
    </div>
  );
}
