export async function rolloverBudget(month: string) {
  const res = await fetch(
    `http://localhost:3001/api/budget/rollover/${month}`,
    {
      method: "POST",
    },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Rollover failed");
  }

  return res.json();
}
