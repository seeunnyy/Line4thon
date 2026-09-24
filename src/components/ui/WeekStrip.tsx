import Card from "./Card";
import Icon, { type IconName } from "./Icon";
import SampleTag from "./SampleTag";
import { WEATHER_LABEL, type WeekDay, type Weather } from "@/lib/model";

const ICON: Record<Weather, IconName> = { sunny: "sun", cloudy: "cloud", rain: "rain" };

// 날씨 UI 주간 스트립: panel 카드 안에 7열. 각 칸 = 요일 / 날씨 아이콘 24(빈 자리) / 날짜 / 날씨 단어 / 이벤트 이름.
// 오늘 칸은 cobalt 배경 + 흰 글자. 칸 최소 높이 88.
export default function WeekStrip({
  days,
  className = "",
}: {
  days: WeekDay[];
  className?: string;
}) {
  return (
    <Card variant="panel" className={`relative px-2 pb-2 pt-3 ${className}`}>
      <div className="mb-2 flex justify-end px-1">
        <SampleTag />
      </div>
      <ol className="grid grid-cols-7">
        {days.map((d) => (
          <li
            key={d.dow + d.date}
            aria-current={d.today ? "date" : undefined}
            className={`flex min-h-[88px] flex-col items-center gap-[2px] px-0 py-2 text-body ${
              d.today ? "bg-cobalt text-white" : "text-ink"
            }`}
          >
            <span className={d.today ? "text-white" : "text-subtext"}>{d.dow}</span>
            <Icon name={ICON[d.weather]} size={24} />
            <span className="text-label font-bold">{d.date}</span>
            <span className={d.today ? "text-white" : "text-subtext"}>{WEATHER_LABEL[d.weather]}</span>
            <span
              className={`min-h-[18px] font-bold ${d.today ? "text-white" : "text-cobalt"}`}
            >
              {d.event ?? ""}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
