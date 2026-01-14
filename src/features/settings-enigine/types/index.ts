export type SettingsItemType = "toggle" | "input" | "select";

export interface SettingsItem {
  id: string;
  label: string;
  type: SettingsItemType;
  defaultValue?: any;
  options?: { label: string; value: string }[];
}

export interface SettingsSection {
  id: string;
  title: string;
  items: SettingsItem[];
}

export interface SettingsConfig {
  title: string;
  sections: SettingsSection[];
}
