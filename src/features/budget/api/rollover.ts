export async function rolloverBudget(month: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/budget/rollover/${month}`,
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
