// 온보딩 진행 표시: 점 n개(지름 8, 간격 8). 현재 단계 cobalt, 나머지 line.
export default function ProgressDots({
  total,
  current,
}: {
  total: number;
  current: number; // 1부터 시작
}) {
  return (
    <div
      role="img"
      aria-label={`${total}단계 중 ${current}단계`}
      className="flex items-center gap-2"
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`h-2 w-2 rounded-full ${i + 1 === current ? "bg-cobalt" : "bg-line"}`}
        />
      ))}
    </div>
  );
}
