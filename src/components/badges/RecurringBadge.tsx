import { Badge } from "@chakra-ui/react"

export function RecurringBadge({ recurring }: { recurring: boolean }) {
  if (!recurring) return null

  return (
    <Badge
      px={2}
      py={1}
      borderRadius="md"
      fontSize="xs"
      fontWeight="medium"
      colorScheme="green"
    >
      Terugkerend
    </Badge>
  )
}
