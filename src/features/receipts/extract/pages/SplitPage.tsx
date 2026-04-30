async function fetchSplitItems(transactionId: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/split-transactions/${transactionId}`,
  );

  if (!res.ok) throw new Error("Failed to fetch split items");
  return res.json();
}
