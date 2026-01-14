// logic/parsers/parseRabobank.ts
import { NormalizedTransaction } from "../../components/types/NormalizedTransaction";
import { detectIncome } from "../detectIncome";
export function parseRabobankRow(row: any): NormalizedTransaction {
  const description = [
    row["Omschrijving-1"],
    row["Omschrijving-2"],
    row["Omschrijving-3"],
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const isIncome = detectIncome(description);

  const rawAmount = row["Bedrag"].replace(",", ".");
  const amount = Number(rawAmount);
  const finalAmount = isIncome ? Math.abs(amount) : -Math.abs(amount);

  return {
    date: row["Datum"],
    amount: finalAmount,
    merchant: row["Naam tegenpartij"] || "onbekend",
    description,
  };
}
