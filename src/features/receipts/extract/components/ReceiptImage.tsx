import { Box } from "@chakra-ui/react";

export function ReceiptImage({ receiptId }: { receiptId: number }) {
  return (
    <Box mb={4}>
      <img
        src={`/api/receipts/${receiptId}/file`}
        style={{
          width: "100%",
          maxHeight: "400px",
          objectFit: "contain",
          borderRadius: 8,
        }}
      />
    </Box>
  );
}
