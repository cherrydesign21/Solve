export interface DateDiffResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  businessDays: number;
  isPast: boolean;
}

function countBusinessDays(start: Date, end: Date): number {
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count += 1;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export function calculateDateDiff(from: Date, to: Date): DateDiffResult {
  const isPast = to.getTime() < from.getTime();
  const [start, end] = isPast ? [to, from] : [from, to];

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const daysInPrevMonth = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += daysInPrevMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const businessDays = countBusinessDays(start, end);

  return { years, months, days, totalDays, totalWeeks, totalMonths, businessDays, isPast };
}

export function toDateInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
