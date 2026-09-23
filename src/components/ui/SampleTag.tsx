// UI 시안 단계에서 샘플 데이터를 쓰는 카드 오른쪽 위에 붙이는 작은 태그(12px).
export default function SampleTag({
  children = "샘플",
  className = "",
}: {
  children?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full bg-surface-low px-2 text-body text-subtext ${className}`}
    >
      {children}
    </span>
  );
}
