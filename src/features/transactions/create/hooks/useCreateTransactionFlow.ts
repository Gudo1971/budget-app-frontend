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
      `http://localhost:3001/api/receipts/${receiptId}/extract`,
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

  // ⭐ STEP 3 — Create new transaction (ONLY if no duplicate)
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
  ) {
    const res = await fetch("http://localhost:3001/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        receiptId,
        userId,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Create transaction failed (${res.status}): ${error}`);
    }
  }

  // ⭐ STEP 4 — Link to existing transaction (duplicate)
  async function linkToExisting(receiptId: number, transactionId: number) {
    const res = await fetch(
      `http://localhost:3001/api/receipts/${receiptId}/confirm-link`,
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

  // ⭐ MAIN FLOW — This is what your UI calls
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

      // 1. Extract
      console.log("📝 [FLOW] Step 1: Extracting receipt...", receiptId);
      await ensureExtracted(receiptId);

      // 2. Match
      console.log("🔍 [FLOW] Step 2: Finding matches...");
      const match = await findMatch(receiptId);
      console.log("✅ [FLOW] Match result:", match);

      if (match.action === "duplicate" && match.duplicate) {
        console.log("🎯 [FLOW] Duplicate found, showing modal...");
        setMatchResult(match);
        onDuplicateFound?.(match);
        setIsLoading(false);
        return;
      }

      console.log("📌 [FLOW] No duplicate, creating new transaction...");
      await createTransaction(form, userId, receiptId);

      console.log("✅ [FLOW] Transaction created successfully");
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
