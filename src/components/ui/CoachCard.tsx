import type { ReactNode } from "react";
import Avatar from "./Avatar";
import Icon, { type IconName } from "./Icon";

// UI-SPEC.md 5장 .coach 그대로: 아바타 64 + 간격 16 + 말풍선.
// 말풍선 폭은 flex-1이라 390px 프레임에서 238px이 된다(64 아바타 + 16 간격 + 카드/말풍선 패딩을 제외한 나머지).
export default function CoachCard({
  message,
  captionIcon = "info",
  caption,
  captionSize = "caption",
  dataSpec,
}: {
  message: ReactNode;
  captionIcon?: IconName;
  caption?: ReactNode;
  // caption: 프로토타입 규격(10px, 체크인 전용). body: 새 화면용 12px(12px 미만 글자 금지 규칙).
  captionSize?: "caption" | "body";
  dataSpec?: {
    root?: string;
    avatar?: string;
    bubble?: string;
    bubbleText?: string;
    caption?: string;
  };
}) {
  return (
    <section
      data-spec={dataSpec?.root}
      className="mt-4 flex gap-4 rounded-card bg-card p-4 shadow-coach"
    >
      <Avatar size={64} badge dataSpec={dataSpec?.avatar} />
      <div
        data-spec={dataSpec?.bubble}
        className="min-w-0 flex-1 rounded-[8px_32px_32px_32px] bg-surface-low px-4 pb-4 pt-[15px]"
      >
        <p data-spec={dataSpec?.bubbleText} className="text-lead">
          {message}
        </p>
        {caption && (
          <div
            data-spec={dataSpec?.caption}
            className={`mt-[5px] flex items-center gap-[3px] text-cobalt ${
              captionSize === "body" ? "text-body" : "text-caption [word-spacing:0]"
            }`}
          >
            <Icon name={captionIcon} size={12} />
            <span>{caption}</span>
          </div>
        )}
      </div>
    </section>
  );
}
