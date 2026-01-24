import type { RangeResult, WeekInfo } from "@shared/types/period";

// Helper: pad numbers to 2 digits
const pad = (n: number) => String(n).padStart(2, "0");

// Convert to ISO date string
const iso = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;

// Get number of days in a month
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

// Get ISO week number
export function getISOWeek(date: Date): number {
  const temp = new Date(date.getTime());
  temp.setHours(0, 0, 0, 0);

  // Thursday in current week decides the year
  temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));

  const week1 = new Date(temp.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((temp.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7,
    )
  );
}

// Get all weeks in a month
export function getWeeksInMonth(year: number, month: number): WeekInfo[] {
  const daysInMonth = getDaysInMonth(year, month);
  const weeks: WeekInfo[] = [];

  let currentWeek = 0;
  let weekStart: string | null = null;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const weekNumber = getISOWeek(date);

    if (weekNumber !== currentWeek) {
      if (weekStart !== null) {
        // Close previous week
        const prevDate = new Date(year, month - 1, day - 1);
        weeks.push({
          weekNumber: currentWeek,
          from: weekStart,
          to: iso(
            prevDate.getFullYear(),
            prevDate.getMonth() + 1,
            prevDate.getDate(),
          ),
        });
      }

      // Start new week
      currentWeek = weekNumber;
      weekStart = iso(year, month, day);
    }
  }

  // Close last week
  if (weekStart !== null) {
    const lastDate = new Date(year, month - 1, daysInMonth);
    weeks.push({
      weekNumber: currentWeek,
      from: weekStart,
      to: iso(
        lastDate.getFullYear(),
        lastDate.getMonth() + 1,
        lastDate.getDate(),
      ),
    });
  }

  return weeks;
}

// Get all days in a week (ISO week)
export function getDaysInWeek(year: number, week: number): string[] {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;

  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());

  const days: string[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(ISOweekStart);
    d.setDate(ISOweekStart.getDate() + i);
    days.push(iso(d.getFullYear(), d.getMonth() + 1, d.getDate()));
  }

  return days;
}

// Range for a month
export function getRangeForMonth(year: number, month: number): RangeResult {
  const days = getDaysInMonth(year, month);
  return {
    from: iso(year, month, 1),
    to: iso(year, month, days),
  };
}

// Range for a week
export function getRangeForWeek(year: number, week: number): RangeResult {
  const days = getDaysInWeek(year, week);
  return {
    from: days[0],
    to: days[6],
  };
}
