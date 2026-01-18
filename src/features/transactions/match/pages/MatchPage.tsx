import { Box } from "@chakra-ui/react";
import {
  Receipt,
  ExtractedReceipt,
} from "../../../receipts/extract/types/extractTypes";
import { ReceiptLinkFlow } from "../flows/ReceiptLinkFlow";

export function MatchPage({
  receipt,
  extracted,
  onClose,
}: {
  receipt: Receipt;
  extracted: ExtractedReceipt;
  onClose: () => void;
}) {
  if (!receipt || !receipt.id) {
    return <Box>Geen geldige bon gevonden.</Box>;
  }

  return (
    <ReceiptLinkFlow
      receipt={receipt}
      extracted={extracted}
      onClose={onClose}
    />
  );
}
