import {
  Badge,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  useColorMode,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { ReactNode } from "react";

type SectionHeaderProps = {
  label: string;
  info?: ReactNode;
};

export function SectionHeader({ label, info }: SectionHeaderProps) {
  const { colorMode } = useColorMode();
  const badgeColor = colorMode === "light" ? "gray" : "whiteAlpha";
  const iconColor = colorMode === "light" ? "gray.600" : "gray.300";

  return (
    <Popover placement="right-start">
      <PopoverTrigger>
        <Badge
          colorScheme={badgeColor}
          variant="subtle"
          px={4}
          py={2}
          borderRadius="full"
          fontSize="sm"
          display="inline-flex"
          alignItems="center"
          gap={2}
          cursor="pointer"
        >
          {label}
          {info && <InfoOutlineIcon boxSize={3.5} color={iconColor} />}
        </Badge>
      </PopoverTrigger>
      {info && (
        <PopoverContent p={4} maxW="260px">
          <PopoverArrow />
          <PopoverBody fontSize="sm">{info}</PopoverBody>
        </PopoverContent>
      )}
    </Popover>
  );
}
