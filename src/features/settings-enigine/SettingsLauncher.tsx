import { IconButton } from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

export function SettingsLauncher({ route }: { route: string }) {
  const navigate = useNavigate();

  return (
    <IconButton
      aria-label="Instellingen"
      icon={<SettingsIcon />}
      variant="ghost"
      onClick={() => navigate(route)}
    />
  );
}
