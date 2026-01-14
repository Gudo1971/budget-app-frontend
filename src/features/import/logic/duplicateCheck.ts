// ===============================
// duplicateCheck.ts
// ===============================

export function isDuplicate(existing: any[], tx: any) {
  return existing.some(
    (e) =>
      e.date === tx.date &&
      e.amount === tx.amount &&
      e.merchant.toLowerCase() === tx.merchant.toLowerCase()
  );
}

// ===============================
