import { HeaderIconButton } from "@/components/icons/HeaderIconButton";
import { FiList } from "react-icons/fi";
import { SubBudgetSettingsPreview } from "@/features/budget/settings/SubBudgetSettingsPreview";

export const budgetSettingsConfig = [
  {
    key: "subbudgets",
    label: "Sub‑budgetten",

    preview: (props: { month?: string }) => (
      <SubBudgetSettingsPreview {...props} />
    ),

    actions: ({
      openPreviewFor,
    }: {
      openPreviewFor: (key: string) => void;
    }) => (
      <HeaderIconButton
        label="Sub‑budgetten beheren"
        icon={<FiList />}
        onClick={() => openPreviewFor("subbudgets")}
      />
    ),
  },
];
