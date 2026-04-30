import { Box } from "@chakra-ui/react";

export function ReceiptImage({ receiptId }: { receiptId: number }) {
  const API = import.meta.env.VITE_API_URL;

  return (
    <Box mb={4}>
      <img
        src={`${API}/receipts/${receiptId}/file`}
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
