import Icon from "./Icon";
import type { IconName } from "./Icon";
import { WEATHER_MOOD_LABEL, type Weather } from "@/mocks/sample";

const ICON: Record<Weather, IconName> = { sunny: "sun", cloudy: "cloud", rain: "rain" };

// 흰색 pill(높이 32, 좌우 12): 아이콘 16(빈 자리) + 12px 글자.
export default function WeatherPill({ weather }: { weather: Weather }) {
  return (
    <span className="inline-flex h-8 items-center gap-1 rounded-full bg-white px-3 text-body shadow-panel">
      <Icon name={ICON[weather]} size={16} />
      {WEATHER_MOOD_LABEL[weather]}
    </span>
  );
}
