import { Box, Spinner, Text, Heading } from "@chakra-ui/react";
import {
  Receipt,
  ExtractedReceipt,
} from "../../../receipts/extract/types/extractTypes";
import { CreateTransactionForm } from "../../../transactions/components/create/CreateTransactionForm";

export function ReceiptLinkFlow({
  receipt,
  extracted,
  onClose,
}: {
  receipt: Receipt;
  extracted: ExtractedReceipt;
  onClose: () => void;
}) {
  if (!extracted) {
    return (
      <Box>
        <Spinner /> <Text>Bon wordt verwerkt…</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={3}>
        Nieuwe transactie aanmaken
      </Heading>

      <CreateTransactionForm
        receipt={receipt}
        extracted={extracted}
        userId="demo-user"
        onClose={onClose}
      />
    </Box>
  );
}
