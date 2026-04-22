import { PageLayout } from "@/components/layout/PageLayout";
import { SettingsEngine } from "@/features/settings-enigine/SettingsEngine";
import { budgetSettingsConfig } from "@/features/settings-enigine/config/budgetSettingsConfig";

export default function BudgetSettingsPage() {
  return (
    <PageLayout title="Budget-instellingen">
      <SettingsEngine config={budgetSettingsConfig} />
    </PageLayout>
  );
}
