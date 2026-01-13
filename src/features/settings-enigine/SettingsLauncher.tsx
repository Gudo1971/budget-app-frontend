import { IconButton } from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export function SettingsLauncher({ route }: { route: string }) {
  const navigate = useNavigate();

  return (
    <IconButton
      aria-label="Instellingen"
      icon={<FiSettings />}
      variant="ghost"
      size="sm"
      onClick={() => navigate(route)}
      _hover={{
        transform: "scale(1.08)",
        color: "#00C8FF",
        filter: "drop-shadow(0 0 6px rgba(0, 200, 255, 0.6))",
      }}
      _active={{
        transform: "scale(0.92)",
        filter: "drop-shadow(0 0 10px rgba(0, 200, 255, 0.9))",
      }}
      transition="all 0.18s ease"
    />
  );
}
