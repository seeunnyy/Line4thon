import { WEATHER_LABEL, type ForecastStory } from "@/lib/model";

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

// 오늘 기준 고정 7칸 날짜 스트립(오늘 + 0~6일). 이벤트가 이 7일 범위를 벗어나면 억지로 넓히거나
// 이벤트 쪽으로 당기지 않는다 — 그 칸은 그냥 날짜·날씨만 보여주고 눌리지 않는다(scene < 0).
// 여러 날 이벤트는 칸을 합친 블록 하나다(일별로 쪼개지 않는다).
// 장면이 있는 날은 눌러서 그 장면으로 가고(44px 이상), 지금 장면은 cobalt 배경(선택 표시) + 흰 글자다.
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

// 7열·간격 4px 격자에서 칸의 위치·폭(선택 표시가 이 값으로 미끄러진다)
const COL = "((100% - 24px) / 7)";
const colLeft = (day: number) => `calc(${COL} * ${day} + ${day * 4}px)`;
const colWidth = (span: number) => `calc(${COL} * ${span} + ${(span - 1) * 4}px)`;

// 무대 위에 얹는 날짜 스트립: 칸은 반투명 흰색이고, 지금 장면 칸 뒤로 코발트 선택 표시가 미끄러져 옮겨 간다
// (움직임 줄이기에서는 바로 옮겨진다).
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
  const selectedCell = cells.find((c) => c.scene === current);

  return (
    <div role="group" aria-label="날짜별 장면" className="relative grid grid-cols-7 gap-1">
      {selectedCell && (
        <span
          aria-hidden="true"
          style={{ left: colLeft(selectedCell.day), width: colWidth(selectedCell.span) }}
          className="absolute inset-y-0 bg-cobalt motion-safe:transition-[left,width] motion-safe:duration-500 motion-safe:ease-out"
        />
      )}
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
        const base =
          "relative flex min-h-[70px] flex-col items-center justify-center gap-[2px] px-0 py-2 text-body motion-safe:transition-colors motion-safe:duration-500";

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
              selected ? "bg-transparent text-white" : c.isEvent ? "bg-white/50 text-ink" : "bg-white/80 text-ink"
            }`}
          >
            {body}
          </button>
        );
      })}
    </div>
  );
}
