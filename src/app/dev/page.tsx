import Link from "next/link";
import { notFound } from "next/navigation";

// 화면 시안 확인용 색인. 로직 구현이 끝나면 이 폴더(src/app/dev)를 지운다 — 배포 전에 삭제할 것.
// production 빌드에서는 404를 돌려준다.
const GROUPS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "온보딩",
    links: [
      { href: "/", label: "스플래시" },
      { href: "/onboarding/profile", label: "정보 입력" },
      { href: "/onboarding/avatar", label: "아바타 설정 (몽실이 소개)" },
    ],
  },
  {
    title: "홈",
    links: [
      { href: "/app", label: "기본(맑음)" },
      { href: "/app?weather=cloudy", label: "흐림" },
      { href: "/app?weather=rain", label: "소나기" },
      { href: "/app?motion=calm", label: "몽실이 움직임: 차분(작게·원본 표정)" },
      { href: "/app?weather=rain&motion=calm", label: "소나기 · 차분" },
      { href: "/app?state=ended", label: "이벤트 종료(체크인 유도)" },
      { href: "/app?state=empty", label: "이벤트 없음" },
    ],
  },
  {
    title: "예보",
    links: [
      { href: "/app/forecast", label: "예보 목록" },
      { href: "/app/forecast?state=empty", label: "예보 목록(빈 상태)" },
      { href: "/app/event/new", label: "이벤트 등록" },
      { href: "/app/event/sample-1/simulation", label: "예보 결과" },
    ],
  },
  {
    title: "체크인·기록",
    links: [
      { href: "/app/checkin", label: "복귀 체크인" },
      { href: "/app/log", label: "기록" },
      { href: "/app/log?state=empty", label: "기록(빈 상태)" },
    ],
  },
  {
    title: "마이페이지",
    links: [
      { href: "/app/me", label: "마이페이지" },
      { href: "/app/me/avatar", label: "아바타 꾸미기" },
    ],
  },
];

export default function DevIndexPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="px-5 pb-10 pt-6">
      <h1 className="text-display font-bold">화면 목록</h1>
      <p className="mt-2 text-body text-subtext">
        개발용 색인이에요. 배포 전에 src/app/dev 폴더를 지워요.
      </p>

      {GROUPS.map((group) => (
        <section key={group.title}>
          <h2 className="mt-6 text-section font-bold">{group.title}</h2>
          <ul className="mt-2 bg-card shadow-panel">
            {group.links.map((link) => (
              <li key={link.href} className="border-t border-line first:border-t-0">
                <Link
                  href={link.href}
                  className="flex min-h-11 flex-col justify-center px-4 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cobalt"
                >
                  <span className="text-label">{link.label}</span>
                  <span className="text-body text-subtext">{link.href}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
