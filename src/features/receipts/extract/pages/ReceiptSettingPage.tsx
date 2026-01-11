import { SettingsEngine } from "../../../settings-enigine/SettingsEngine";
import { receiptSettingsConfig } from "../../../settings-enigine/config/receiptSettingsConfig";

export default function ReceiptSettingsPage() {
  return <SettingsEngine config={receiptSettingsConfig} />;
}
