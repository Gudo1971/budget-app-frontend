import { PageLayout } from "@/components/layout/PageLayout";
import { SettingsEngine } from "@/features/settings-enigine/SettingsEngine";
import { transactionSettingsConfig } from "@/features/settings-enigine/config/transactionSettingsConfig";

export default function TransactionSettingsPage() {
  return (
    <PageLayout title="Transactie-instellingen">
      <SettingsEngine config={transactionSettingsConfig} />
    </PageLayout>
  );
}
