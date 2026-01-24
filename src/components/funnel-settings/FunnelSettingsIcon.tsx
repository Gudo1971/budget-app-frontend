import { chakra, useColorModeValue } from "@chakra-ui/react";

type Props = {
  active?: boolean;
  size?: number;
};

export function FunnelSettingsIcon({ active = false, size = 22 }: Props) {
  const baseColor = useColorModeValue("#2D3748", "#E2E8F0");
  const neonBlue = "#00C8FF";

  return (
    <chakra.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      color={baseColor}
      _hover={{
        color: neonBlue,
      }}
      transition="color 0.2s ease"
      cursor="pointer"
    >
      {/* Funnel */}
      <chakra.path
        d="M3 4h18l-7 8v5l-4 3v-8L3 4z"
        fill="currentColor"
        opacity="0.85"
      />

      {/* Gear */}
      <chakra.path
        d="M19.4 15.1l1.1-.6-1-1.7-1.2.3a3.3 3.3 0 0 0-.9-.5l-.2-1.2h-2l-.2 1.2c-.3.1-.6.3-.9.5l-1.2-.3-1 1.7 1.1.6c0 .3 0 .7 0 1l-1.1.6 1 1.7 1.2-.3c.3.2.6.4.9.5l.2 1.2h2l.2-1.2c.3-.1.6-.3.9-.5l1.2.3 1-1.7-1.1-.6c0-.3 0-.7 0-1zM16.5 17a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
        fill="currentColor"
      />
    </chakra.svg>
  );
}
