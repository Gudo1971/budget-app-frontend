import { Box, Switch, VStack, HStack, Text } from "@chakra-ui/react";

type CarouselSettingsProps = {
  settings: {
    showTransactionAnalysis: boolean;
    showBudgetProgress: boolean;
    showCategoryStats: boolean;
    showVasteLasten: boolean;
  };
  onChange: (newSettings: CarouselSettingsProps["settings"]) => void;
};

export function CarouselSettings({
  settings,
  onChange,
}: CarouselSettingsProps) {
  return (
    <Box bg="gray.800" p={5} borderRadius="lg" w="100%">
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Dashboard Instellingen
      </Text>

      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <Text>Transactie Analyse</Text>
          <Switch
            isChecked={settings.showTransactionAnalysis}
            onChange={(e) =>
              onChange({
                ...settings,
                showTransactionAnalysis: e.target.checked,
              })
            }
          />
        </HStack>

        <HStack justify="space-between">
          <Text>Budget Voortgang</Text>
          <Switch
            isChecked={settings.showBudgetProgress}
            onChange={(e) =>
              onChange({
                ...settings,
                showBudgetProgress: e.target.checked,
              })
            }
          />
        </HStack>

        <HStack justify="space-between">
          <Text>Categorie Statistieken</Text>
          <Switch
            isChecked={settings.showCategoryStats}
            onChange={(e) =>
              onChange({
                ...settings,
                showCategoryStats: e.target.checked,
              })
            }
          />
        </HStack>

        <HStack justify="space-between">
          <Text>Vaste Lasten</Text>
          <Switch
            isChecked={settings.showVasteLasten}
            onChange={(e) =>
              onChange({
                ...settings,
                showVasteLasten: e.target.checked,
              })
            }
          />
        </HStack>
      </VStack>
    </Box>
  );
}
