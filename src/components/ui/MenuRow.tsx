import Link from "next/link";
import Icon from "./Icon";
import SampleTag from "./SampleTag";

// 마이페이지의 한 줄 메뉴(높이 56, 오른쪽 chevron). href면 링크, onClick이면 버튼이다.
// tag는 "시연용" 같은 작은 표시. 패널(Card panel) 안에서 divide-y로 겹쳐 쓴다.
export default function MenuRow({
  label,
  href,
  onClick,
  tag,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
  tag?: string;
}) {
  const classes =
    "flex min-h-14 w-full items-center justify-between gap-2 px-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cobalt";
  const inner = (
    <>
      <span className="text-label">{label}</span>
      <span className="flex items-center gap-2">
        {tag && <SampleTag>{tag}</SampleTag>}
        <Icon name="chevron-right" size={16} className="text-subtext" />
      </span>
    </>
  );

  return href ? (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={classes}>
      {inner}
    </button>
  );
}
