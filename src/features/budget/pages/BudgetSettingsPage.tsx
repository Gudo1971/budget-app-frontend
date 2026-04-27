import { PageLayout } from "@/components/layout/PageLayout";
import { SettingsEngine } from "@/features/settings-enigine/SettingsEngine";
import { budgetSettingsConfig } from "@/features/settings-enigine/config/budgetSettingsConfig";
import { useDateFilter } from "@/context/DateFilterContext";
import { CollapsibleMonthSelector } from "../components/MonthSelector/CollapsibleMonthSelector";
import { VStack } from "@chakra-ui/react";

export default function BudgetSettingsPage() {
  const { range, setRange } = useDateFilter();

  const month = range?.from
    ? `${range.from.getFullYear()}-${String(range.from.getMonth() + 1).padStart(
        2,
        "0",
      )}`
    : "";

  return (
    <PageLayout title="Budget-instellingen">
      <VStack align="stretch" spacing={4}>
        <CollapsibleMonthSelector
          selectedMonth={month}
          onChange={(newMonth) => {
            const [year, monthNum] = newMonth.split("-");
            const yearInt = parseInt(year);
            const monthInt = parseInt(monthNum);

            const firstDay = new Date(yearInt, monthInt - 1, 1);
            const lastDay = new Date(yearInt, monthInt, 0);

            setRange({ from: firstDay, to: lastDay });
          }}
        />
        <SettingsEngine config={budgetSettingsConfig} month={month} />
      </VStack>
    </PageLayout>
  );
}
