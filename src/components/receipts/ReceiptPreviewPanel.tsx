import { useState } from "react";
import {
  Box,
  Spinner,
  Text,
  Heading,
  VStack,
  HStack,
  Divider,
  Button,
  Select, // ⭐ BELANGRIJK: toegevoegd
} from "@chakra-ui/react";

export type Receipt = {
  id: number;
  filename: string;
  original_name: string;
  uploaded_at: string;
};

export type ExtractedItem = {
  name: string;
  quantity: number;
  price: number;
  total?: number | null;
  category?: string | null;
  co2_grams?: number | null;
  [key: string]: any;
};

export type ExtractedReceipt = {
  merchant: string | null;
  merchant_category?: string | null; // ⭐ BELANGRIJK
  date: string | null;
  total: number | null;
  subtotal?: number | null;
  tax?: number | null;
  currency: string | null;
  items: ExtractedItem[];
  [key: string]: any;
};

export function ReceiptPreviewPanel({ receipt }: { receipt: Receipt }) {
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedReceipt | null>(null);

  async function analyze() {
    setLoading(true);

    const res = await fetch(`/api/receipts/${receipt.id}/extract`, {
      method: "POST",
    });

    const data = await res.json();

    setExtracted(data.extracted.parsedJson);
    setLoading(false);
  }

  // ⭐ NIEUW: categorie opslaan
  async function saveCategory(category: string) {
    if (!extracted?.merchant) return;

    await fetch("/merchant-category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant: extracted.merchant,
        category,
      }),
    });

    // UI updaten
    setExtracted({
      ...extracted,
      merchant_category: category,
    });
  }

  function renderDynamicTotals(r: ExtractedReceipt) {
    const fields = [
      ["subtotal", "Subtotaal"],
      ["tax", "BTW"],
      ["total", "Totaal"],
    ];

    return (
      <VStack align="stretch" spacing={1}>
        {fields.map(([key, label]) =>
          r[key] != null ? (
            <HStack key={key} justify="space-between">
              <Text>{label}</Text>
              <Text>
                {r[key]} {r.currency}
              </Text>
            </HStack>
          ) : null
        )}
      </VStack>
    );
  }

  function renderDynamicItem(item: ExtractedItem) {
    return (
      <Box p={2} bg="gray.700" borderRadius="md">
        <HStack justify="space-between">
          <Text fontWeight="bold">{item.name}</Text>
          <Text>
            {item.price} × {item.quantity}
          </Text>
        </HStack>

        {item.category && (
          <Text fontSize="sm" color="gray.400">
            Categorie: {item.category}
          </Text>
        )}

        {item.co2_grams != null && (
          <Text fontSize="sm" color="green.300">
            CO₂: {item.co2_grams} g
          </Text>
        )}

        {Object.entries(item).map(([key, value]) => {
          if (
            ["name", "price", "quantity", "category", "co2_grams"].includes(key)
          ) {
            return null;
          }

          return (
            <Text key={key} fontSize="sm" color="gray.500">
              {key}: {String(value)}
            </Text>
          );
        })}
      </Box>
    );
  }

  function renderDynamicMetadata(r: ExtractedReceipt) {
    const ignore = [
      "merchant",
      "merchant_category",
      "date",
      "total",
      "subtotal",
      "tax",
      "currency",
      "items",
    ];

    return (
      <VStack align="stretch" spacing={1}>
        {Object.entries(r).map(([key, value]) => {
          if (ignore.includes(key)) return null;
          if (value == null) return null;

          return (
            <Text key={key} fontSize="sm" color="gray.400">
              {key}: {String(value)}
            </Text>
          );
        })}
      </VStack>
    );
  }

  return (
    <Box p={4} borderRadius="md" bg="gray.800" color="white" boxShadow="md">
      <Box mb={4}>
        <img
          src={`/api/receipts/${receipt.id}/file`}
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "contain",
            borderRadius: 8,
          }}
        />
      </Box>

      {!extracted && !loading && (
        <Button colorScheme="blue" onClick={analyze}>
          Analyseer bon
        </Button>
      )}

      {loading && (
        <HStack mt={2}>
          <Spinner size="sm" />
          <Text>Bon analyseren…</Text>
        </HStack>
      )}

      {!loading && extracted && (
        <VStack align="stretch" spacing={4} mt={4}>
          <Divider />

          <Box>
            <Heading size="sm" mb={1}>
              Winkel
            </Heading>
            <Text>{extracted.merchant ?? "Onbekend"}</Text>
          </Box>

          <Box>
            <Heading size="sm" mb={1}>
              Datum
            </Heading>
            <Text>{extracted.date ?? "Onbekend"}</Text>
          </Box>

          <Divider />
          {renderDynamicTotals(extracted)}

          <Divider />
          <Box>
            <Heading size="sm" mb={2}>
              Artikelen
            </Heading>

            {extracted.items?.length > 0 ? (
              <VStack align="stretch" spacing={2}>
                {extracted.items.map((item, i) => (
                  <Box key={i}>{renderDynamicItem(item)}</Box>
                ))}
              </VStack>
            ) : (
              <Text>Geen items gevonden.</Text>
            )}
          </Box>

          {/* ⭐ Merchant Category */}
          <Box>
            <Heading size="sm" mb={1}>
              Categorie
            </Heading>
            <Text>{extracted.merchant_category ?? "Onbekend"}</Text>
          </Box>

          {/* ⭐ Fallback dropdown */}
          {!extracted.merchant_category && (
            <Box mt={2}>
              <Heading size="sm" mb={1}>
                Kies categorie
              </Heading>
              <Select
                placeholder="Selecteer categorie"
                onChange={(e) => saveCategory(e.target.value)}
              >
                <option value="restaurant">Restaurant</option>
                <option value="cafe">Café</option>
                <option value="fastfood">Fastfood</option>
                <option value="supermarket">Supermarkt</option>
                <option value="pharmacy">Drogist</option>
                <option value="retail">Winkel</option>
                <option value="services">Dienst</option>
              </Select>
            </Box>
          )}

          <Divider />
          {renderDynamicMetadata(extracted)}
        </VStack>
      )}
    </Box>
  );
}
