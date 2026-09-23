import Link from "next/link";
import type { ReactNode } from "react";

// 프로토타입 "홈 예보로 바로 건너뛰기" 규격. 배경 없음, 버튼이 아니라 코발트 글자 링크다.
// href가 없으면 같은 모양의 텍스트 동작(예: 시트의 "취소")으로 렌더한다.
export default function TextLink({
  href,
  onClick,
  children,
  dataSpec,
  className = "",
}: {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  dataSpec?: string;
  className?: string;
}) {
  const classes = `flex h-11 items-center justify-center text-[13px] leading-[19.5px] text-cobalt ${className}`;

  if (href) {
    return (
      <Link href={href} data-spec={dataSpec} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} data-spec={dataSpec} className={`${classes} w-full`}>
      {children}
    </button>
  );
}
