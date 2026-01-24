import { Box, useColorModeValue } from "@chakra-ui/react";
import { FilterPanel } from "./FilterPanel";

type Props = {
  multiMode: "year" | "month" | "week" | "day";
  currentYear: number;
  selectedMultiValues: (string | number)[];
  setSelectedMultiValues: (v: (string | number)[]) => void;
  onApply: (values: (string | number)[]) => void;
  onClose: () => void;
  selectedWeekForDayFilter?: number | null;
};

export function MultiSelectOverlay({
  multiMode,
  currentYear,
  selectedMultiValues,
  setSelectedMultiValues,
  onApply,
  onClose,
  selectedWeekForDayFilter,
}: Props) {
  const items =
    multiMode === "year"
      ? Array.from({ length: 10 }, (_, i) => ({
          label: `${currentYear - i}`,
          value: currentYear - i,
        }))
      : multiMode === "month"
        ? Array.from({ length: 12 }, (_, i) => ({
            label: `Maand ${i + 1}`,
            value: i + 1,
          }))
        : multiMode === "week"
          ? Array.from({ length: 52 }, (_, i) => ({
              label: `Week ${i + 1}`,
              value: i + 1,
            }))
          : Array.from({ length: 7 }, (_, i) => ({
              label: [
                "Zondag",
                "Maandag",
                "Dinsdag",
                "Woensdag",
                "Donderdag",
                "Vrijdag",
                "Zaterdag",
              ][i],
              value: i,
            }));

  // Dark‑mode aware kleuren
  const bg = useColorModeValue("gray.50", "gray.800");
  const border = useColorModeValue("gray.300", "gray.600");
  const shadow = useColorModeValue("md", "dark-lg");

  return (
    <Box
      position="absolute"
      top="60px"
      left="0"
      right="0"
      zIndex={10}
      bg={bg}
      borderWidth="1px"
      borderColor={border}
      borderRadius="md"
      shadow={shadow}
      p={3}
    >
      <FilterPanel
        title={
          multiMode === "year"
            ? "Selecteer jaren"
            : multiMode === "month"
              ? "Selecteer maanden"
              : multiMode === "week"
                ? "Selecteer weken"
                : `Selecteer dagen ${selectedWeekForDayFilter ? `(Week ${selectedWeekForDayFilter})` : ""}`
        }
        items={items}
        selected={selectedMultiValues}
        onChange={setSelectedMultiValues}
        onClose={() => {
          onApply(selectedMultiValues);
          onClose();
        }}
      />
    </Box>
  );
}
