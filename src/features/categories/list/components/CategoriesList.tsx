import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { getCategoryNeonColor } from "@/hooks/useCategoryNeonColor";

import type { Category } from "@/features/categories/types/Category";

type Props = {
  categories: Category[];
  onSelect: (c: Category) => void;
};

export function CategoryList({ categories, onSelect }: Props) {
  const bg = useColorModeValue("rgba(255,255,255,0.06)", "rgba(0,0,0,0.35)");
  const hoverBg = useColorModeValue(
    "rgba(255,255,255,0.12)",
    "rgba(0,0,0,0.55)",
  );

  return (
    <VStack spacing={2} w="full">
      {categories.map((category) => {
        const neon = getCategoryNeonColor(category.name);

        return (
          <HStack
            key={category.id}
            w="full"
            p={3}
            borderRadius="lg"
            bg={bg}
            border={`1px solid ${neon.neonColor}55`}
            boxShadow={neon.softGlow}
            cursor="pointer"
            onClick={() => onSelect(category)}
            transition="0.25s ease"
            _hover={{
              bg: hoverBg,
              transform: "scale(1.015)",
              boxShadow: neon.hoverGlow,
            }}
          >
            <Box
              w="12px"
              h="12px"
              borderRadius="md"
              bg={neon.neonColor}
              boxShadow={neon.softGlow}
            />

            <Text fontWeight="600" color="white">
              {category.name}
            </Text>

            <Badge
              ml="auto"
              bg={`${neon.neonColor}22`}
              color={neon.neonColor}
              border={`1px solid ${neon.neonColor}`}
              boxShadow={neon.softGlow}
              px={2}
              py={0.5}
              borderRadius="md"
              fontSize="xs"
            >
              {category.type}
            </Badge>
          </HStack>
        );
      })}
    </VStack>
  );
}
