// features/import/logic/universalParser.ts

import { detectBank } from "./bankDetector";
import { parseRabobank } from "./parsers/parseRabobank";
import { parseIngRow } from "./parsers/parseIng";
import { parseBunq } from "./parsers/parseBunq";
import { parseGeneric } from "./parsers/parseGeneric";

export function universalParse(row: any, columns: string[]) {
  const format = detectBank(columns);

  switch (format) {
    case "rabobank":
      return parseRabobank(row);
    case "ing":
      return parseIngRow(row);
    case "bunq":
      return parseBunq(row);
    case "generic":
      return parseGeneric(row);
    default:
      return parseGeneric(row); // fallback
  }
}
