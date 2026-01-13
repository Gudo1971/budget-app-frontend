import { SettingsEngine } from "@/features/settings-enigine/SettingsEngine";
import { dashboardSettingsConfig } from "@/features/settings-enigine/config/dashboardSettingsConfig";

export default function DashboardSettingsPage() {
  return <SettingsEngine config={dashboardSettingsConfig} />;
}
