import {
  HStack,
  Text,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";

type SubSectionHeaderProps = {
  label: string;
  info?: string;
};

export function SubSectionHeader({ label, info }: SubSectionHeaderProps) {
  return (
    <HStack w="full" justify="space-between">
      <Text fontSize="sm" fontWeight="semibold" color="gray.200">
        {label}
      </Text>

      {info && (
        <Popover placement="top-end">
          <PopoverTrigger>
            <IconButton
              aria-label="info"
              icon={<InfoOutlineIcon boxSize={3} />}
              size="xs"
              variant="ghost"
              color="gray.400"
              _hover={{ color: "gray.200" }}
              _active={{ bg: "transparent" }}
              _focus={{ boxShadow: "none" }}
            />
          </PopoverTrigger>
          <PopoverContent
            bg="gray.700" // ← één tint lichter dan de box
            border="1px solid"
            borderColor="whiteAlpha.300"
            backdropFilter="blur(6px)"
            color="gray.100"
            p={3}
            maxW="260px"
          >
            <PopoverArrow bg="gray.800" borderColor="whiteAlpha.300" />
            <PopoverBody fontSize="sm">{info}</PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </HStack>
  );
}
