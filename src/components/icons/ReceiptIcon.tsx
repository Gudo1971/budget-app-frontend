// components/ReceiptIcon.tsx
import { Icon } from "@chakra-ui/react";
import { FaRegFileAlt } from "react-icons/fa";

interface ReceiptIconProps {
  hasReceipt?: boolean;
  size?: string | number;
}

export const ReceiptIcon = ({
  hasReceipt = false,
  size = "20px",
}: ReceiptIconProps) => {
  return (
    <Icon
      as={FaRegFileAlt}
      boxSize={size}
      color={hasReceipt ? "#00bfff" : "gray.400"}
      filter={hasReceipt ? "drop-shadow(0 0 6px #00bfff)" : "none"}
      transition="all 0.25s ease"
      animation={hasReceipt ? "glowPulse 2s infinite ease-in-out" : "none"}
      css={{
        "@keyframes glowPulse": {
          "0%": { filter: "drop-shadow(0 0 4px #00bfff)" },
          "50%": { filter: "drop-shadow(0 0 8px #00bfff)" },
          "100%": { filter: "drop-shadow(0 0 4px #00bfff)" },
        },
      }}
    />
  );
};
