import { PageLayout } from "../../../../../../components/layout/PageLayout";
import { GearMenu } from "../../../../../../components/ui/GearMenu";
import { TransactionsList } from "../TransactionsList"; // voorbeeldpad

export default function TransactionsPage() {
  const handleCsvUpload = () => {};
  const handlePdfUpload = () => {};
  const handleReceiptUpload = () => {};

  return (
    <PageLayout
      title="Transacties"
      rightSection={
        <GearMenu
          actions={[
            { label: "CSV importeren", onClick: handleCsvUpload },
            { label: "PDF importeren", onClick: handlePdfUpload },
            { label: "Bon uploaden", onClick: handleReceiptUpload },
          ]}
        />
      }
    >
      <TransactionsList />
    </PageLayout>
  );
}
