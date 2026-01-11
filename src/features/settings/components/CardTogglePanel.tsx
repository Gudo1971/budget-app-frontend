import { VStack, HStack, Switch, Text } from "@chakra-ui/react";

type Props = {
  settings: Record<string, boolean>;
  onChange: (newSettings: Record<string, boolean>) => void;
};

export function CardTogglePanel({ settings, onChange }: Props) {
  const toggle = (key: string) => {
    onChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <VStack align="stretch" spacing={4}>
      {Object.keys(settings).map((key) => (
        <HStack key={key} justify="space-between">
          <Text textTransform="capitalize">{key}</Text>
          <Switch isChecked={settings[key]} onChange={() => toggle(key)} />
        </HStack>
      ))}
    </VStack>
  );
}
