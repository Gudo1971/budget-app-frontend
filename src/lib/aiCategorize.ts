export async function categorizeWithAI(transactions:any[]) {
  const response = await fetch("http://localhost:3001/api/ai/categorize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transactions })
  })

  if (!response.ok) {
    throw new Error("AI categorization failed")
  }

  return await response.json()
}
