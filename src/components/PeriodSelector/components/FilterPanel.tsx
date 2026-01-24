import {
  Box,
  Checkbox,
  VStack,
  Text,
  Button,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import type { FilterPanelItem } from "@shared/types/period";

type FilterPanelProps = {
  title: string;
  items: FilterPanelItem[];
  selected: (string | number)[];
  onChange: (values: (string | number)[]) => void;
  onClose?: () => void;
};

export function FilterPanel({
  title,
  items,
  selected,
  onChange,
  onClose,
}: FilterPanelProps) {
  const toggleValue = (value: string | number) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  // Dark‑mode aware kleuren
  const bg = useColorModeValue("gray.50", "gray.800");
  const border = useColorModeValue("gray.300", "gray.600");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const shadow = useColorModeValue("md", "dark-lg");

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={3}
      bg={bg}
      borderColor={border}
      shadow={shadow}
    >
      <Text fontWeight="bold" mb={2} color={textColor}>
        {title}
      </Text>

      <VStack align="stretch" spacing={2} maxH="200px" overflowY="auto">
        {items.map((item) => (
          <Checkbox
            key={item.value}
            isChecked={selected.includes(item.value)}
            onChange={() => toggleValue(item.value)}
            colorScheme="blue"
          >
            {item.label}
          </Checkbox>
        ))}
      </VStack>

      <Flex justify="flex-end" mt={3} gap={2}>
        {onClose && (
          <Button size="sm" variant="ghost" onClick={onClose}>
            Sluiten
          </Button>
        )}
        <Button size="sm" colorScheme="blue" onClick={() => onClose?.()}>
          Toepassen
        </Button>
      </Flex>
    </Box>
  );
}
