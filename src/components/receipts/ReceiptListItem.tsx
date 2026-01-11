import { Box, Flex, Text } from "@chakra-ui/react";

type ReceiptListItemProps = {
  receipt: any;
  onClick: () => void;
  isSelected?: boolean;
};

export function ReceiptListItem({
  receipt,
  onClick,
  isSelected,
}: ReceiptListItemProps) {
  return (
    <Flex
      p={3}
      borderBottom="1px solid"
      borderColor="gray.700"
      cursor="pointer"
      bg={isSelected ? "gray.800" : "gray.900"}
      _hover={{ bg: "gray.800" }}
      onClick={onClick}
      color="white"
    >
      <Box>
        <Text fontWeight="medium" color="white">
          {receipt.filename}
        </Text>
        <Text fontSize="sm" color="gray.400">
          {receipt.created_at}
        </Text>
      </Box>
    </Flex>
  );
}
