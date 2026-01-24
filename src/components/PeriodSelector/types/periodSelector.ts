import type { WeekInfo } from "@shared/types/period";

export type MonthListProps = {
  year: number;
  selectedMonth: number | null;
  multiSelected?: (string | number)[];
  onSelect: (month: number) => void;
};

export const MONTHS: { month: number; label: string }[] = [
  { month: 1, label: "Januari" },
  { month: 2, label: "Februari" },
  { month: 3, label: "Maart" },
  { month: 4, label: "April" },
  { month: 5, label: "Mei" },
  { month: 6, label: "Juni" },
  { month: 7, label: "Juli" },
  { month: 8, label: "Augustus" },
  { month: 9, label: "September" },
  { month: 10, label: "Oktober" },
  { month: 11, label: "November" },
  { month: 12, label: "December" },
];
export type YearListProps = {
  selectedYear: number;
  multiSelected?: (string | number)[];
  onSelect: (year: number) => void;
  years?: number[]; // optional override
};

export type WeekListProps = {
  year: number;
  month: number;
  selectedWeek: number | null;
  multiSelected?: (string | number)[];
  onSelect: (week: number) => void;
  onOpenFilter?: (week: WeekInfo) => void;
};
