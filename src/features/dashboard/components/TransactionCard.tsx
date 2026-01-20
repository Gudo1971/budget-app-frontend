import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  Button,
  Collapse,
  Divider,
  Image,
  Tooltip,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Transaction } from "../../../../../shared/types/Transaction";

export function TransactionCard({ transaction }: { transaction: Transaction }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isExpense = transaction.amount < 0;
  const sign = isExpense ? "-" : "+";
  const amount = Math.abs(transaction.amount).toFixed(2);

  const ai = transaction.receipt?.aiResult ?? null;
  const hasDetailsToShow = !!ai || !!transaction.receipt?.thumbnailUrl;

  return (
    <Box
      w="100%"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl"
      bg="gray.50"
      _dark={{ bg: "gray.800" }}
      boxShadow="sm"
      px={4}
      py={3}
      transition="0.2s"
      _hover={{
        boxShadow: "md",
        borderColor: "gray.300",
        bg: "gray.50",
        _dark: { bg: "gray.800" },
        transform: "translateY(-1px)",
      }}
      onClick={() => setOpen(!open)}
      cursor="pointer"
      mb={4}
    >
      {/* HEADER */}
      <HStack justify="space-between" align="flex-start" spacing={4}>
        {/* LEFT SIDE */}
        <VStack align="start" spacing={1}>
          <HStack spacing={2}>
            <Text fontSize="sm" fontWeight="medium" color="gray.300">
              {transaction.description}
            </Text>

            {transaction.recurring && (
              <Badge
                fontSize="0.6rem"
                colorScheme="purple"
                borderRadius="full"
                px={2}
              >
                Terugkerend
              </Badge>
            )}
          </HStack>

          {transaction.merchant && (
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="gray.700"
              _dark={{ color: "gray.200" }}
            >
              {transaction.merchant}
            </Text>
          )}

          {/* ⭐ Tooltip op categorie */}
          <Tooltip
            label="Automatische suggestie, controleer altijd zelf"
            openDelay={300}
          >
            <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.300" }}>
              {transaction.category ?? "Onbekend"}{" "}
              {transaction.subcategory ? ` • ${transaction.subcategory}` : ""}
            </Text>
          </Tooltip>

          {transaction.date && (
            <Text fontSize="xs" color="gray.400">
              {transaction.date}
            </Text>
          )}
        </VStack>

        {/* RIGHT SIDE */}
        <VStack align="flex-end" spacing={2} minW="100px">
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color={isExpense ? "red.500" : "green.500"}
          >
            {sign}€{amount}
          </Text>

          <Text fontSize="xs" color="gray.400">
            {isExpense ? "Uitgave" : "Inkomst"}
          </Text>

          {isExpense && (
            <Tooltip
              label="Verdeel deze uitgave over meerdere personen"
              openDelay={300}
            >
              <Button
                size="xs"
                colorScheme="blue"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/split/${transaction.id}`);
                }}
              >
                Split
              </Button>
            </Tooltip>
          )}

          {/* ⭐ Tooltip op chevron */}
          {hasDetailsToShow && (
            <Tooltip label="Toon bon en details" openDelay={300}>
              <ChevronDownIcon
                boxSize={5}
                color="gray.400"
                transform={open ? "rotate(180deg)" : "rotate(0deg)"}
                transition="transform 0.2s ease"
                mt={1}
              />
            </Tooltip>
          )}
        </VStack>
      </HStack>

      {/* COLLAPSE */}
      <Collapse in={open && hasDetailsToShow} animateOpacity>
        <VStack align="start" spacing={4} mt={4}>
          <Divider />

          {/* Thumbnail */}
          {transaction.receipt?.thumbnailUrl && (
            <Box>
              <Text fontWeight="bold" mb={1}>
                Bon
              </Text>

              <Tooltip label="Klik om de bon te bekijken" openDelay={300}>
                <Image
                  src={transaction.receipt.thumbnailUrl}
                  alt="Bon"
                  maxW="150px"
                  borderRadius="md"
                />
              </Tooltip>
            </Box>
          )}

          {/* AI RESULT DETAILS */}
          {ai && (
            <Box>
              <Text fontWeight="bold" mb={1}>
                Gelezen van de bon
              </Text>

              {ai.merchant && (
                <Text>
                  <strong>Merchant:</strong> {ai.merchant}
                </Text>
              )}

              {ai.category && (
                <Text>
                  <strong>Categorie:</strong> {ai.category}
                </Text>
              )}

              {ai.subcategory && (
                <Text>
                  <strong>Subcategorie:</strong> {ai.subcategory}
                </Text>
              )}

              {ai.date && (
                <Text>
                  <strong>Datum:</strong> {ai.date}
                </Text>
              )}

              {ai.total && (
                <Text>
                  <strong>Totaal:</strong> €{ai.total}
                </Text>
              )}

              {(ai.items?.length ?? 0) > 0 && (
                <VStack align="start" spacing={1} mt={2}>
                  <Text fontWeight="bold">Items:</Text>
                  {(ai.items ?? []).map((item, i) => (
                    <Text key={i}>
                      • {item.name} — €{item.price} ({item.quantity}×)
                    </Text>
                  ))}
                </VStack>
              )}

              {/* ⭐ Subtiele disclaimer */}
              <Text fontSize="xs" color="gray.400" mt={2}>
                Automatische suggesties, controleer altijd zelf.
              </Text>
            </Box>
          )}
        </VStack>
      </Collapse>
    </Box>
  );
}
