import { detectBank } from "./bankDetector";
import { parseRabobankRow } from "./parsers/parseRabobank";
import { parseIngRow } from "./parsers/parseIng";

export function importCsv(rows: any[]) {
  const columns = Object.keys(rows[0]);
  const bank = detectBank(columns);

  let parser;

  switch (bank) {
    case "rabobank":
      parser = parseRabobankRow;
      break;
    case "ing":
      parser = parseIngRow;
      break;
    default:
      throw new Error("Onbekend CSV-formaat");
  }

  return rows.map(parser);
}
