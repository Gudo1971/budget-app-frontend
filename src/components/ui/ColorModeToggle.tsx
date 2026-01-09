import { HStack, IconButton, Tooltip, useColorMode } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { FaCog } from "react-icons/fa";

export function ColorModeToggle() {
  const { colorMode, setColorMode } = useColorMode();

  const currentMode = localStorage.getItem("chakra-ui-color-mode") || "system";

  const handleModeChange = (mode: "light" | "dark" | "system") => {
    if (mode === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setColorMode(prefersDark ? "dark" : "light");
    } else {
      setColorMode(mode);
    }
    localStorage.setItem("chakra-ui-color-mode", mode);
  };

  return (
    <HStack spacing={1}>
      <Tooltip label="Lichtmodus" hasArrow>
        <IconButton
          aria-label="Lichtmodus"
          icon={<SunIcon />}
          size="sm"
          variant={currentMode === "light" ? "solid" : "ghost"}
          onClick={() => handleModeChange("light")}
        />
      </Tooltip>

      <Tooltip label="Donkere modus" hasArrow>
        <IconButton
          aria-label="Donkere modus"
          icon={<MoonIcon />}
          size="sm"
          variant={currentMode === "dark" ? "solid" : "ghost"}
          onClick={() => handleModeChange("dark")}
        />
      </Tooltip>

      <Tooltip label="Systeemmodus" hasArrow>
        <IconButton
          aria-label="Systeemmodus"
          icon={<FaCog />}
          size="sm"
          variant={currentMode === "system" ? "solid" : "ghost"}
          onClick={() => handleModeChange("system")}
        />
      </Tooltip>
    </HStack>
  );
}
