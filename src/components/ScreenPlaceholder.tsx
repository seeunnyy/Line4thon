// 아직 실제 화면 내용이 없는 빈 라우트용 공통 틀. 제목 + 한 줄 설명만 보여준다.
// 비즈니스 로직은 없다.
export default function ScreenPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="flex min-h-dvh flex-col justify-center gap-2 px-6 text-center">
      <h1 className="text-xl font-semibold text-ink">{title}</h1>
      <p className="text-subtext">{description}</p>
    </main>
  );
}
