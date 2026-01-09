import { Badge } from "@chakra-ui/react"

const categoryLabels: Record<string, string> = {
  "Groceries": "Boodschappen",
  "Transport": "Vervoer",
  "Subscriptions": "Abonnementen",
  "Eating Out": "Uit eten",
}

export function CategoryBadge({ category }: { category: string }) {
  const label = categoryLabels[category] ?? category

  return (
    <Badge
      px={2}
      py={1}
      borderRadius="md"
      fontSize="xs"
      fontWeight="medium"
      colorScheme="purple"
    >
      {label}
    </Badge>
  )
}
