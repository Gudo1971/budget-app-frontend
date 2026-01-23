import {
  Box,
  Heading,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { useState } from "react";
import MerchantDetailDrawer from "./MerchantDetailDrawer";
import { useDisclosure } from "@chakra-ui/react";
import { MerchantMemoryRecord } from "@shared/types/merchantMemory";
import { useMerchantMemory } from "@/features/merchantMemory/hooks/useMerchantMemory";

export default function MerchantMemoryDebug() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState<MerchantMemoryRecord | null>(null);

  const { merchants, loading, error, reload, retrain } = useMerchantMemory();

  const [filter, setFilter] = useState("");
  const [confidence, setConfidence] = useState(1);

  function openDetail(m: MerchantMemoryRecord) {
    setSelected(m);
    onOpen();
  }

  return (
    <Box p={8}>
      <Heading mb={6}>Merchant Memory Debugger</Heading>

      <HStack mb={4} spacing={4}>
        <Input
          placeholder="Search merchant..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <Box w="200px">
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={confidence}
            onChange={setConfidence}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>

        <Button onClick={reload}>Refresh</Button>
      </HStack>

      {loading && <Box>Loading...</Box>}
      {error && <Box color="red.500">{error}</Box>}

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Merchant</Th>
            <Th>Category</Th>
            <Th>Confidence</Th>
            <Th>User</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>

        <Tbody>
          {merchants
            .filter((m) => m.display.includes(filter))
            .filter((m) => m.confidence <= confidence)
            .map((m) => (
              <Tr key={m.key}>
                <Td>{m.display}</Td>
                <Td>{m.category_id}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      m.confidence >= 0.6
                        ? "green"
                        : m.confidence >= 0.3
                          ? "yellow"
                          : "red"
                    }
                  >
                    {m.confidence.toFixed(2)}
                  </Badge>
                </Td>
                <Td>{m.user_id}</Td>
                <Td>
                  <Button size="sm" onClick={() => retrain(m)}>
                    Retrain
                  </Button>
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>

      <MerchantDetailDrawer
        merchant={selected}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  );
}
