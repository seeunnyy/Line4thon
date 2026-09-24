import { WEATHER_LABEL, type ForecastStory } from "@/mocks/sample";

interface Cell {
  key: string;
  day: number;
  span: number;
  dow: string;
  date: string;
  word: string;
  isEvent: boolean;
  today: boolean;
  scene: number; // 장면 인덱스, 장면이 없는 날은 -1
}

// 이벤트 날짜 기준 7칸 날짜 스트립. 여러 날 이벤트는 칸을 합친 블록 하나다(일별로 쪼개지 않는다).
// 장면이 있는 날은 눌러서 그 장면으로 가고(44px 이상), 지금 장면은 cobalt 배경 + 흰 글자다.
function toCells({ days, event, scenes }: ForecastStory): Cell[] {
  const cells: Cell[] = [];
  for (let i = 0; i < days.length; ) {
    const isEvent = i === event.day;
    const span = isEvent ? event.span : 1;
    const first = days[i];
    const last = days[i + span - 1];
    cells.push({
      key: first.date,
      day: i,
      span,
      dow: span > 1 ? `${first.dow}~${last.dow}` : first.dow,
      date: span > 1 ? `${first.date}~${last.date}` : first.date,
      word: isEvent ? event.label : WEATHER_LABEL[first.weather],
      isEvent,
      today: !!first.today,
      scene: scenes.findIndex((s) => s.day === i),
    });
    i += span;
  }
  return cells;
}

export default function DayScrubber({
  story,
  current,
  onSelect,
}: {
  story: ForecastStory;
  current: number;
  onSelect: (scene: number) => void;
}) {
  const cells = toCells(story);

  return (
    <div role="group" aria-label="날짜별 장면" className="grid grid-cols-7 gap-1">
      {cells.map((c) => {
        const selected = c.scene === current;
        const style = { gridColumn: `span ${c.span} / span ${c.span}` };
        const body = (
          <>
            <span className={selected ? "text-white" : "text-subtext"}>{c.today ? "오늘" : c.dow}</span>
            <span className="text-label font-bold">{c.date}</span>
            <span
              className={`${c.isEvent ? "font-bold" : ""} ${
                selected ? "text-white" : c.isEvent ? "text-cobalt" : "text-subtext"
              }`}
            >
              {c.word}
            </span>
          </>
        );
        const base = "flex min-h-[70px] flex-col items-center justify-center gap-[2px] px-0 py-2 text-body";

        if (c.scene < 0) {
          // 장면이 없는 날(72시간 이후): 보여주기만 한다.
          return (
            <div key={c.key} style={style} className={`${base} text-ink`}>
              {body}
            </div>
          );
        }

        return (
          <button
            key={c.key}
            type="button"
            style={style}
            aria-current={selected ? "step" : undefined}
            aria-label={`${c.today ? "오늘, " : ""}${c.dow} ${c.date}일 ${c.word} 장면 보기`}
            onClick={() => onSelect(c.scene)}
            className={`${base} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt ${
              selected ? "bg-cobalt text-white" : c.isEvent ? "bg-surface-low text-ink" : "bg-card text-ink shadow-panel"
            }`}
          >
            {body}
          </button>
        );
      })}
    </div>
  );
}
