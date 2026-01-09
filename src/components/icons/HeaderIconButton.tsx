import { IconButton } from "@chakra-ui/react";
import { ReactElement } from "react";

export function HeaderIconButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactElement;
  label: string;
  onClick?: () => void;
}) {
  return (
    <IconButton
      aria-label={label}
      icon={icon}
      onClick={onClick} // ⭐ correcte implementatie
      size="sm"
      variant="ghost"
      _hover={{
        color: "#00C8FF",
        transform: "scale(1.15)",
        transition: "all 0.15s ease",
      }}
      _active={{
        transform: "scale(0.95)",
      }}
    />
  );
}
