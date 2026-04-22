import { createContext, useContext, useState } from "react";

type Mode = "year" | "month" | "week" | "day";

export type DashboardPeriod = {
  from: Date;
  to: Date;
  mode: Mode;
};

type DashboardPeriodContextType = {
  period: DashboardPeriod;
  setPeriod: (p: DashboardPeriod) => void;
};

const DashboardPeriodContext = createContext<DashboardPeriodContextType | null>(
  null,
);

export function DashboardPeriodProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [period, setPeriod] = useState<DashboardPeriod>({
    from: first,
    to: last,
    mode: "month",
  });

  return (
    <DashboardPeriodContext.Provider value={{ period, setPeriod }}>
      {children}
    </DashboardPeriodContext.Provider>
  );
}

export function useDashboardPeriod() {
  const ctx = useContext(DashboardPeriodContext);
  if (!ctx)
    throw new Error(
      "useDashboardPeriod must be used inside DashboardPeriodProvider",
    );
  return ctx;
}
