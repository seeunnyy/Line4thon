import Link from "next/link";
import Card from "./Card";
import SampleTag from "./SampleTag";
import StatusBadge, { type BadgeTone } from "./StatusBadge";

export interface TimelineItem {
  id: string;
  title: string;
  dateLabel: string;
  badge: string;
  tone: BadgeTone;
  href?: string;
}

export interface TimelineGroup {
  label: string;
  items: TimelineItem[];
}

// 세로 타임라인: 2px 선 + 12px 점. 코발트로 채운 점 = 체크인 완료, 속이 빈 점 = 그 밖의 상태(예정·체크인 전).
// 상태는 점 모양뿐 아니라 카드 안 배지 글자로도 전달한다. 카드 안 첫 줄 중앙(27px)에 점 중심을 맞춘다.
const DOT = 12;
const DOT_CENTER = 27;

export default function Timeline({ groups }: { groups: TimelineGroup[] }) {
  return (
    <div>
      {groups.map((group) => (
        <section key={group.label}>
          <div className="mt-6 flex h-6 items-center justify-between">
            <h2 className="text-section font-bold">{group.label}</h2>
            <SampleTag />
          </div>
          <ol className="mt-2">
            {group.items.map((item, i) => {
              const first = i === 0;
              const last = i === group.items.length - 1;
              const filled = item.tone === "done";

              const card = (
                <Card variant="round">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lead font-bold">{item.title}</p>
                    <StatusBadge tone={item.tone}>{item.badge}</StatusBadge>
                  </div>
                  <p className="mt-1 text-body text-subtext">{item.dateLabel}</p>
                </Card>
              );

              return (
                <li key={item.id} className={`relative pl-8 ${last ? "" : "pb-3"}`}>
                  {!(first && last) && (
                    <span
                      aria-hidden="true"
                      className="absolute left-[5px] w-[2px] bg-line"
                      style={{
                        top: first ? DOT_CENTER : 0,
                        ...(last ? { height: first ? 0 : DOT_CENTER } : { bottom: 0 }),
                      }}
                    />
                  )}
                  <span
                    aria-hidden="true"
                    style={{ top: DOT_CENTER - DOT / 2, width: DOT, height: DOT }}
                    className={`absolute left-0 rounded-full ${
                      filled ? "bg-cobalt" : "border-2 border-cobalt bg-surface"
                    }`}
                  />
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="block rounded-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt"
                    >
                      {card}
                    </Link>
                  ) : (
                    card
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
