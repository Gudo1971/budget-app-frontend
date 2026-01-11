import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import { useMatch } from "../hooks/useMatch";
import {
  Receipt,
  ExtractedReceipt,
} from "../../../receipts/extract/types/extractTypes";
import { MatchCandidatesList } from "../components/MatchCandidatesList";
import { CreateTransactionForm } from "../../../transactions/components/create/CreateTransactionForm";

export function MatchPage({
  receipt,
  extracted,
}: {
  receipt: Receipt;
  extracted: ExtractedReceipt;
}) {
  if (!receipt || !receipt.id) {
    return <Text>Geen geldige bon gevonden.</Text>;
  }

  const { loading, candidates, link, create } = useMatch(receipt.id);

  if (loading)
    return (
      <Box>
        <Spinner /> <Text>Matchen…</Text>
      </Box>
    );

  if (candidates && candidates.length > 0)
    return (
      <Box>
        <Heading size="md" mb={3}>
          Mogelijke transacties
        </Heading>
        <MatchCandidatesList candidates={candidates} onSelect={link} />
      </Box>
    );

  return (
    <Box>
      <Heading size="md" mb={3}>
        Nieuwe transactie aanmaken
      </Heading>

      <CreateTransactionForm receipt={receipt} extracted={extracted} />
    </Box>
  );
}
