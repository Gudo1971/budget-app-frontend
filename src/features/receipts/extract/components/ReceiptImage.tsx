import { Box } from "@chakra-ui/react";
import { apiBaseUrl } from "@/lib/api/api"; // ⭐ centrale base URL uit je API-client

export function ReceiptImage({ receiptId }: { receiptId: number }) {
  return (
    <Box mb={4}>
      <img
        src={`${apiBaseUrl}/receipts/${receiptId}/file`}
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
