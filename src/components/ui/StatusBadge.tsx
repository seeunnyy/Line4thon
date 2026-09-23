const TONE = {
  dday: "bg-cobalt font-bold text-white", // D-1 같은 카운트다운
  upcoming: "bg-surface-low font-bold text-cobalt", // 예보 확인
  done: "bg-surface-low font-bold text-positive", // 체크인 완료
  pending: "bg-surface-low font-bold text-subtext", // 체크인 전
} as const;

export type BadgeTone = keyof typeof TONE;

// 이벤트 상태 배지(24px pill, 12px). 색만으로 뜻을 전하지 않도록 항상 글자가 들어간다.
export default function StatusBadge({ tone, children }: { tone: BadgeTone; children: string }) {
  return (
    <span className={`inline-flex h-6 items-center rounded-full px-3 text-body ${TONE[tone]}`}>
      {children}
    </span>
  );
}
