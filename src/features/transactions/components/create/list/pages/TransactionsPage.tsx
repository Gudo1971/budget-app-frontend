import { PageLayout } from "@/components/layout/PageLayout";
import { SettingsEngine } from "@/features/settings-enigine/SettingsEngine";
import { transactionSettingsConfig } from "@/features/settings-enigine/config/transactionSettingsConfig";
import { TransactionsList } from "../TransactionsList";
import { FiSettings } from "react-icons/fi";
import { IconButton } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function TransactionsPage() {
  const navigate = useNavigate();
  return (
    <PageLayout
      title="Transacties"
      rightSection={
        <IconButton
          aria-label="Instellingen"
          icon={<FiSettings />}
          variant="ghost"
          size="md"
          onClick={() => navigate("/transactions/settings")}
        />
      }
    >
      <TransactionsList />
    </PageLayout>
  );
}
