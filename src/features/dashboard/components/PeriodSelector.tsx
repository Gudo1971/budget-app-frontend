import { useDashboardPeriod } from "@/hooks/useDashboardPeriod";

export function PeriodSelector() {
  const { period, setPeriod } = useDashboardPeriod();

  function setMonth(offset: number) {
    const base = new Date(period.from);
    const newMonth = new Date(base.getFullYear(), base.getMonth() + offset, 1);
    const first = new Date(newMonth.getFullYear(), newMonth.getMonth(), 1);
    const last = new Date(newMonth.getFullYear(), newMonth.getMonth() + 1, 0);

    setPeriod({
      from: first,
      to: last,
      mode: "month",
    });
  }

  return (
    <div>
      <button onClick={() => setMonth(-1)}>◀</button>
      <span>
        {period.from.toLocaleString("default", { month: "long" })}{" "}
        {period.from.getFullYear()}
      </span>
      <button onClick={() => setMonth(1)}>▶</button>
    </div>
  );
}
