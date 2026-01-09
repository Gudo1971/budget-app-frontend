import { SettingsEngine } from "../components/settings-engine/SettingsEngine";
import { receiptSettingsConfig } from "../components/settings-engine/receiptSettingsConfig";

export default function ReceiptSettingsPage() {
  return <SettingsEngine config={receiptSettingsConfig} />;
}
