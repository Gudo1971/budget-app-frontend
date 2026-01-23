import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Text,
  Badge,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { MerchantMemoryRecord } from "@shared/types/merchantMemory";

type Props = {
  merchant: MerchantMemoryRecord | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function MerchantDetailDrawer(props: Props) {
  if (!props.merchant) return null;

  const { merchant, isOpen, onClose } = props;

  const color =
    merchant.confidence >= 0.6
      ? "green"
      : merchant.confidence >= 0.3
        ? "yellow"
        : "red";

  async function retrain() {
    await fetch("http://localhost:3001/debug/retrain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: merchant.user_id,
        merchant: merchant.key,
      }),
    });
  }

  return (
    <Drawer isOpen={isOpen} placement="right" size="md" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Merchant Details</DrawerHeader>

        <DrawerBody>
          <VStack align="start" spacing={4}>
            <Box>
              <Text fontSize="sm" color="gray.500">
                Merchant
              </Text>
              <Text fontSize="lg" fontWeight="bold">
                {merchant.display}
              </Text>
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.500">
                Category ID
              </Text>
              <Text>{merchant.category_id}</Text>
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.500">
                Confidence
              </Text>
              <Badge colorScheme={color}>
                {merchant.confidence.toFixed(2)}
              </Badge>
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.500">
                User ID
              </Text>
              <Text>{merchant.user_id}</Text>
            </Box>

            <HStack pt={4}>
              <Button colorScheme="blue" onClick={retrain}>
                Retrain with AI
              </Button>
              <Button colorScheme="red" variant="outline">
                Delete Memory
              </Button>
            </HStack>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
