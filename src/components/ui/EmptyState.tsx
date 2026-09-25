import type { ReactNode } from "react";
import Avatar from "./Avatar";

// 빈 상태: 빈 아바타 원 112 + 제목 lead bold + 설명 body + 선택 액션(Button lg fullWidth=false 등)
// (아바타 크기 2026-09-25 시안 실측).
export default function EmptyState({
  title,
  description,
  action,
  className = "",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center px-2 py-4 text-center ${className}`}>
      <Avatar size={112} />
      <p className="mt-4 text-lead font-bold">{title}</p>
      {description && <p className="mt-1 text-body text-subtext">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
