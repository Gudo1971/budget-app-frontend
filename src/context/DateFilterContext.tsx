import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Mode = "year" | "month" | "week" | "day";

export type DateRange = {
  from: Date;
  to: Date;
};

type DateFilterState = {
  range: DateRange;
  mode: Mode;
};

type DateFilterContextType = {
  range: DateRange;
  mode: Mode;
  setRange: (range: DateRange) => void;
  setMode: (mode: Mode) => void;
};

const DateFilterContext = createContext<DateFilterContextType | null>(null);

export function DateFilterProvider({ children }: { children: ReactNode }) {
  // ⭐ Initial state → huidige maand
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0 = januari

  const initialFrom = new Date(year, month, 1);
  const initialTo = new Date(year, month + 1, 0);

  const [state, setState] = useState<DateFilterState>({
    range: { from: initialFrom, to: initialTo },
    mode: "month",
  });

  // ⭐ Mode detectie
  function detectMode(from: Date, to: Date): Mode {
    const diffDays = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);

    if (
      from.getFullYear() === to.getFullYear() &&
      from.getMonth() === to.getMonth() &&
      from.getDate() === to.getDate()
    )
      return "day";

    if (diffDays <= 7) return "week";

    const firstOfMonth = new Date(from.getFullYear(), from.getMonth(), 1);
    const lastOfMonth = new Date(from.getFullYear(), from.getMonth() + 1, 0);

    if (
      from.getTime() === firstOfMonth.getTime() &&
      to.getTime() === lastOfMonth.getTime()
    )
      return "month";

    const firstOfYear = new Date(from.getFullYear(), 0, 1);
    const lastOfYear = new Date(from.getFullYear(), 11, 31);

    if (
      from.getTime() === firstOfYear.getTime() &&
      to.getTime() === lastOfYear.getTime()
    )
      return "year";

    return "month";
  }

  // ⭐ Range setter
  function updateRange(newRange: DateRange) {
    setState({
      range: newRange,
      mode: detectMode(newRange.from, newRange.to),
    });
  }

  // ⭐ Mode setter
  function updateMode(mode: Mode) {
    setState((prev) => ({
      ...prev,
      mode,
    }));
  }

  // ⭐ Trigger initial fetch (maar alleen 1x)
  useEffect(() => {
    updateRange(state.range);
  }, []);

  return (
    <DateFilterContext.Provider
      value={{
        range: state.range,
        mode: state.mode,
        setRange: updateRange,
        setMode: updateMode,
      }}
    >
      {children}
    </DateFilterContext.Provider>
  );
}

export function useDateFilter() {
  return useContext(DateFilterContext)!;
}
