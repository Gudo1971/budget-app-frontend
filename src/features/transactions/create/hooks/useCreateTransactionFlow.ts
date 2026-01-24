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
  ): Promise<{ isDuplicate: boolean; transactionId?: number }> {
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

    const result = await res.json();

    console.log("📦 CREATE RESPONSE:", result);
    console.log("📦 Full result structure:", {
      success: result.success,
      data: result.data,
      error: result.error,
      duplicate: result.data?.duplicate,
    });
    alert(
      `DEBUG CREATE:\nStatus: ${res.status}\nSuccess: ${result.success}\nData.duplicate: ${result.data?.duplicate}\nData: ${JSON.stringify(result.data)}\nError: ${result.error}`,
    );

    // Check if backend detected duplicate
    if (result.data?.duplicate === true) {
      console.log("🎯 Duplicate detected in response:", result.data);
      return {
        isDuplicate: true,
        transactionId: result.data.transactionId,
      };
    }

    return { isDuplicate: false };
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

      // ⭐ ALWAYS check for duplicates - regardless of category
      console.log("🔍 [FLOW] Step 1: Finding duplicate matches...");
      const match = await findMatch(receiptId);
      console.log("✅ [FLOW] Match result:", match);

      if (match.action === "duplicate" && match.duplicate) {
        console.log("🎯 [FLOW] Duplicate found, showing modal...");
        setMatchResult(match);
        onDuplicateFound?.(match);
        setIsLoading(false);
        return;
      }

      console.log(
        "📌 [FLOW] No duplicate, creating new transaction with user-provided data...",
      );
      const createResult = await createTransaction(form, userId, receiptId);

      if (createResult.isDuplicate) {
        console.log("🎯 [FLOW] Backend detected duplicate during create");
        // Treat as duplicate
        onDuplicateFound?.({
          action: "duplicate",
          duplicate: {
            id: createResult.transactionId,
            amount: form.amount,
            date: form.date,
            merchant: form.merchant,
          },
        } as any);
        setIsLoading(false);
        return;
      }

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
