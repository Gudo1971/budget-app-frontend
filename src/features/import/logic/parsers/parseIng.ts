// logic/parsers/parseIng.ts
import { NormalizedTransaction } from "@shared/types/NormalizedTransaction";
import { detectIncome } from "../detectIncome";

export function parseIngRow(row: any): NormalizedTransaction {
  // ING heeft meerdere kolomnamen → we normaliseren
  const description =
    row["Naam/Omschrijving"] ||
    row["Naam / Omschrijving"] ||
    row["Omschrijving"] ||
    row["NaamOmschrijving"] ||
    "onbekend";

  const date = row["Datum"] || row["Boekdatum"] || row["Date"] || "";

  const rawAmount =
    row["Bedrag"] || row["Bedrag (EUR)"] || row["Amount"] || "0";

  const cleanedAmount = String(rawAmount).replace(",", ".");
  const amountNum = Number(cleanedAmount);

  // ING gebruikt "Af" of "Bij"
  const afBij = row["Af Bij"] || row["AfBij"] || row["Mutation"] || "";
  const isIncome = afBij.toLowerCase() === "bij" || detectIncome(description);

  const finalAmount = isIncome ? Math.abs(amountNum) : -Math.abs(amountNum);

  return {
    date,
    amount: finalAmount,
    description,
    merchant: description,
    merchant_raw: description,
  };
}
