import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Divider,
} from "@chakra-ui/react";

import { Receipt } from "@/features/transactions/extract/types/extractTypes";
import { ReceiptTotals } from "./ReceiptTotals";
import { ReceiptItems } from "./ReceiptItems";
import { MerchantCategorySelector } from "./MerchantCategorySelector";
import { ReceiptMetadata } from "./ReceiptMetadata";
import { MatchPage } from "@/features/transactions/match/pages/MatchPage";
import { ExtractedReceipt } from "@/features/transactions/extract/types/extractTypes";

export function ReceiptExtractModal({
  isOpen,
  onClose,
  extracted,
  receipt,
}: {
  isOpen: boolean;
  onClose: () => void;
  extracted: ExtractedReceipt;
  receipt: Receipt;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white">
        <ModalHeader>Bon analyse</ModalHeader>
        <ModalCloseButton />

        <ModalBody p={0}>
          <Box bg="gray.900" p={6}>
            <VStack align="stretch" spacing={4}>
              <ReceiptTotals r={extracted} />
              <Divider />

              <ReceiptItems items={extracted.items ?? []} />
              <Divider />

              <MerchantCategorySelector
                merchant={extracted.merchant || "Onbekend"}
                onSelect={() => {}}
              />
              <Divider />

              <ReceiptMetadata r={extracted} />
              <Divider />

              <Box bg="gray.900" p={4} borderRadius="md">
                <MatchPage receipt={receipt} extracted={extracted} />
              </Box>
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
