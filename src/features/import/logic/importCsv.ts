import { detectBank } from "./bankDetector";
import { parseRabobank } from "./parsers/parseRabobank";
import { parseIngRow } from "./parsers/parseIng";

export function importCsv(rows: any[]) {
  const columns = Object.keys(rows[0]);
  const bank = detectBank(columns);

  let parser;

  switch (bank) {
    case "rabobank":
      parser = parseRabobank;
      break;
    case "ing":
      parser = parseIngRow;
      break;
    default:
      throw new Error("Onbekend CSV-formaat");
  }

  return rows.map(parser);
}
