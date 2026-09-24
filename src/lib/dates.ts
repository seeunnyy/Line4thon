// 날짜는 전부 로컬 기준 "YYYY-MM-DD" 문자열로 다룬다(시간대 변환으로 하루가 밀리지 않게).

const DOW = ["일", "월", "화", "수", "목", "금", "토"] as const;

const pad = (n: number) => String(n).padStart(2, "0");

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDays(iso: string, n: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

// b - a (일)
export function diffDays(a: string, b: string): number {
  return Math.round((parseISODate(b).getTime() - parseISODate(a).getTime()) / 86_400_000);
}

export function dowOf(iso: string): string {
  return DOW[parseISODate(iso).getDay()];
}

export function dayOf(iso: string): string {
  return String(parseISODate(iso).getDate());
}

// "9월 25일 금요일"
export function longDateLabel(iso: string): string {
  const d = parseISODate(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${DOW[d.getDay()]}요일`;
}

// "9월 25일"
export function shortDateLabel(iso: string): string {
  const d = parseISODate(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

// 기록 탭 묶음 이름 "2026년 9월"
export function monthLabel(iso: string): string {
  const d = parseISODate(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
}
