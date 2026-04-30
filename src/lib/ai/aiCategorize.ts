export async function categorizeWithAI(transactions: any[]) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/ai/categorize`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactions }),
    },
  );

  if (!response.ok) {
    throw new Error("AI categorization failed");
  }

  return await response.json();
}
