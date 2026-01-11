import { Select, useTheme, useColorMode } from "@chakra-ui/react";
import { useI18n } from "../../i18n/useI18n";

export function LanguageToggle() {
  const { lang, setLang } = useI18n();
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const bg =
    colorMode === "light"
      ? theme.colors.light.surface
      : theme.colors.dark.surface;

  const border =
    colorMode === "light"
      ? theme.colors.light.border
      : theme.colors.dark.border;

  const text =
    colorMode === "light" ? theme.colors.light.text : theme.colors.dark.text;

  const hoverBg =
    colorMode === "light"
      ? theme.colors.light.surfaceAlt
      : theme.colors.dark.surfaceAlt;

  return (
    <Select
      value={lang}
      onChange={(e) =>
        setLang((e.target as HTMLSelectElement).value as "nl" | "en")
      }
      size="sm"
      w="90px"
      bg={bg}
      color={text}
      borderColor={border}
      _hover={{ bg: hoverBg }}
      _focus={{
        borderColor: theme.colors.brand[400],
        boxShadow: `0 0 0 1px ${theme.colors.brand[400]}`,
      }}
      borderRadius="md"
      cursor="pointer"
      transition="all 0.2s ease"
    >
      <option value="nl">🇳🇱 NL</option>
      <option value="en">🇬🇧 EN</option>
    </Select>
  );
}
