// logic/detectExpenseType.ts

export type ExpenseCategory =
  | "housing"
  | "utilities"
  | "insurance"
  | "internet"
  | "phone"
  | "groceries"
  | "household"
  | "personal_care"
  | "transport"
  | "clothing"
  | "subscriptions"
  | "sports"
  | "dining"
  | "fees"
  | "other";

export function detectExpenseType(
  description: string,
  merchant: string
): ExpenseCategory {
  const text = `${merchant} ${description}`.toLowerCase();

  if (matches(text, ["huur", "verhuurder", "woning", "huurbetaling"]))
    return "housing";
  if (
    matches(text, ["eneco", "vattenfall", "essent", "energie", "stroom", "gas"])
  )
    return "utilities";
  if (
    matches(text, [
      "zorgverzekering",
      "verzekering",
      "verzekeraar",
      "vgz",
      "cz",
      "menzis",
      "fbto",
    ])
  )
    return "insurance";
  if (matches(text, ["kpn", "ziggo", "internet", "tv"])) return "internet";
  if (matches(text, ["mobiel", "telefoon", "sim only"])) return "phone";

  if (
    matches(text, [
      "albert heijn",
      "jumbo",
      "lidl",
      "aldi",
      "plus",
      "boodschappen",
      "ah to go",
    ])
  )
    return "groceries";
  if (matches(text, ["hema", "bloker", "blokker", "huishoud", "schoonmaak"]))
    return "household";
  if (matches(text, ["kruidvat", "etos", "drogist", "persoonlijke verzorging"]))
    return "personal_care";

  if (matches(text, ["ns", "gvb", "ov", "reiskosten", "trein", "bus", "tram"]))
    return "transport";
  if (matches(text, ["h&m", "zalando", "kleding", "mode"])) return "clothing";

  if (
    matches(text, [
      "netflix",
      "spotify",
      "disney+",
      "disney plus",
      "abonnement",
    ])
  )
    return "subscriptions";
  if (
    matches(text, ["basic-fit", "basic fit", "sportschool", "gym", "fitness"])
  )
    return "sports";

  if (
    matches(text, [
      "restaurant",
      "café",
      "cafe",
      "diner",
      "lunch",
      "horeca",
      "starbucks",
      "bakker bart",
    ])
  )
    return "dining";

  if (
    matches(text, [
      "kosten",
      "fee",
      "pakketkosten",
      "rabo directpakket",
      "bankkosten",
    ])
  )
    return "fees";

  return "other";
}

function matches(text: string, keywords: string[]) {
  return keywords.some((k) => text.includes(k));
}
