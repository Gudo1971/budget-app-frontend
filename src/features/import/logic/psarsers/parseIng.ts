// logic/parsers/parseIng.ts
import { NormalizedTransaction } from "@shared/types/NormalizedTransaction";

export function parseIngRow(row: any): NormalizedTransaction {
  const description = row["Naam/Omschrijving"];
  const isIncome = row["Af Bij"] === "Bij";

  const amount = Number(row["Bedrag"].replace(",", "."));
  const finalAmount = isIncome ? Math.abs(amount) : -Math.abs(amount);

  return {
    date: row["Datum"],
    amount: finalAmount,
    merchant: description,
    merchant_raw: description,
    description,
  };
}
