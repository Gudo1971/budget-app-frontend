import { useState } from "react";
import { apiGet } from "../../../../lib/api/api";

type CreateFlowOptions = {
  receiptId: number;
  userId: string;
  form: {
    amount: number;
    date: string;
    merchant: string;
    description: string;
    category_id: number | null;
    subcategory_id: number | null;
  };
  onSuccess?: () => void;
  onDuplicateFound?: (match: any) => void;
  onError?: (err: any) => void;
};

export function useCreateTransactionFlow() {
  const [isLoading, setIsLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);

  // ⭐ STEP 1 — Extract receipt
  async function ensureExtracted(receiptId: number) {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/receipts/${receiptId}/extract`,
      { method: "POST" },
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Extract failed (${res.status}): ${error}`);
    }
  }

  // ⭐ STEP 2 — AI match
  async function findMatch(receiptId: number) {
    try {
      return await apiGet<any>(`/receipts/${receiptId}/match`);
    } catch (err) {
      console.error("🔴 Match API error:", err);
      throw new Error(`Match failed: ${err}`);
    }
  }

  // ⭐ STEP 3 — Create new transaction
  async function createTransaction(
    form: {
      amount: number;
      date: string;
      merchant: string;
      description: string;
      category_id: number | null;
      subcategory_id: number | null;
    },
    userId: string,
    receiptId: number,
  ): Promise<{ isDuplicate: boolean; transactionId?: number }> {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/transactions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          receiptId,
          userId,
        }),
      },
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Create transaction failed (${res.status}): ${error}`);
    }

    const result = await res.json();

    // Backend duplicate detection
    if (result.data?.duplicate === true) {
      return {
        isDuplicate: true,
        transactionId: result.data.transactionId,
      };
    }

    return { isDuplicate: false };
  }

  // ⭐ STEP 4 — Link to existing transaction
  async function linkToExisting(receiptId: number, transactionId: number) {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/receipts/${receiptId}/confirm-link`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId }),
      },
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Link failed (${res.status}): ${error}`);
    }
  }

  // ⭐ MAIN FLOW
  async function runCreateFlow({
    receiptId,
    userId,
    form,
    onSuccess,
    onDuplicateFound,
    onError,
  }: CreateFlowOptions) {
    try {
      setIsLoading(true);

      // STEP 1 — Check duplicate
      const match = await findMatch(receiptId);

      if (match.action === "duplicate" && match.duplicate) {
        setMatchResult(match);
        onDuplicateFound?.(match);
        setIsLoading(false);
        return;
      }

      // STEP 2 — Create transaction
      const createResult = await createTransaction(form, userId, receiptId);

      if (createResult.isDuplicate) {
        onDuplicateFound?.({
          action: "duplicate",
          duplicate: {
            id: createResult.transactionId,
            amount: form.amount,
            date: form.date,
            merchant: form.merchant,
          },
        });
        setIsLoading(false);
        return;
      }

      onSuccess?.();
    } catch (err) {
      console.error("❌ Create flow error:", err);
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    matchResult,
    runCreateFlow,
    linkToExisting,
  };
}
