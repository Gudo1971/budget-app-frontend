import { Badge } from "@chakra-ui/react"

export function MerchantBadge({ merchant }: { merchant: string }) {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="md"
      fontSize="xs"
      fontWeight="medium"
      colorScheme="blue"
    >
      {merchant}
    </Badge>
  )
}
