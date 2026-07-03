export interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  daysToNextBirthday: number;
  bornOnWeekday: string;
}

export function calculateAge(dob: Date, asOf: Date): AgeBreakdown {
  let years = asOf.getFullYear() - dob.getFullYear();
  let months = asOf.getMonth() - dob.getMonth();
  let days = asOf.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    const daysInPrevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate();
    days += daysInPrevMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((asOf.getTime() - dob.getTime()) / 86_400_000);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;

  let nextBirthday = new Date(asOf.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBirthday.getTime() < asOf.getTime()) {
    nextBirthday = new Date(asOf.getFullYear() + 1, dob.getMonth(), dob.getDate());
  }
  const daysToNextBirthday = Math.round((nextBirthday.getTime() - asOf.getTime()) / 86_400_000);

  const bornOnWeekday = dob.toLocaleDateString("en-US", { weekday: "long" });

  return { years, months, days, totalMonths, totalWeeks, totalDays, daysToNextBirthday, bornOnWeekday };
}

export function toDateInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
