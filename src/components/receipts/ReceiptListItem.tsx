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
      borderColor="gray.200"
      cursor="pointer"
      bg={isSelected ? "gray.100" : "white"}
      _hover={{ bg: "gray.50" }}
      onClick={onClick}
    >
      <Box>
        <Text fontWeight="medium">{receipt.filename}</Text>
        <Text fontSize="sm" color="gray.600">
          {receipt.created_at}
        </Text>
      </Box>
    </Flex>
  );
}
