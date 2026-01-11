import { useEffect, useState } from "react";
import {
  getMatchCandidates,
  linkReceiptToTransaction,
  createTransactionFromReceipt,
} from "../services/matchService";
import {
  MatchCandidate,
  CreateTransactionFromReceiptInput,
} from "../types/matchTypes";

export function useMatch(receiptId: number) {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<MatchCandidate[] | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getMatchCandidates(receiptId);
      setCandidates(data);
      setLoading(false);
    }
    load();
  }, [receiptId]);

  async function link(transactionId: number) {
    await linkReceiptToTransaction(receiptId, transactionId);
    setCandidates(null); // klaar
  }

  async function create(data: CreateTransactionFromReceiptInput) {
    await createTransactionFromReceipt(receiptId, data);
    setCandidates(null); // klaar
  }

  return {
    loading,
    candidates,
    link,
    create,
  };
}
