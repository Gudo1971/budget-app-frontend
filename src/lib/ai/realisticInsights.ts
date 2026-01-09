export function calculateRealisticStress({
  budget,
  spent,
  daysPassed,
  daysInPeriod,
  fixedCosts = 0,
}: {
  budget: number;
  spent: number;
  daysPassed: number;
  daysInPeriod: number;
  fixedCosts?: number;
}) {
  const variableSpent = Math.max(0, spent - fixedCosts);
  const variableBudget = Math.max(1, budget - fixedCosts);

  const progress = variableSpent / variableBudget;
  const timeProgress = daysPassed / daysInPeriod;

  let stress = progress - timeProgress;

  const remainingDays = daysInPeriod - daysPassed;
  if (remainingDays < 7 && variableSpent > variableBudget * 0.8) {
    stress += 0.15;
  }

  return Math.min(1, Math.max(0, stress));
}

// ⭐ VEILIGE categorie-analyse
export function analyzeCategories(
  sortedCategories: [string, number][] | undefined
) {
  if (!Array.isArray(sortedCategories) || sortedCategories.length === 0) {
    return "Je uitgaven zijn nog niet duidelijk verdeeld over categorieën.";
  }

  const filtered = sortedCategories.filter(
    ([name]) => name && name.toLowerCase() !== "onbekend"
  );

  const [topCategory, topAmount] = filtered[0] ?? ["onbekend", 0];

  if (topCategory === "onbekend") {
    return "Je uitgaven zijn nog niet duidelijk verdeeld over categorieën.";
  }

  if (topCategory.toLowerCase() === "huur") {
    return `Je grootste uitgave is huur (€${topAmount.toFixed(
      0
    )}). Dat is normaal, omdat vaste lasten meestal het grootste deel van het budget vormen.`;
  }

  if (topCategory.toLowerCase() === "boodschappen") {
    return `Boodschappen zijn je grootste variabele uitgave (€${topAmount.toFixed(
      0
    )}). Dat ligt meestal in lijn met een normaal maandbudget.`;
  }

  return `Je grootste uitgavecategorie is ${topCategory.toLowerCase()} (€${topAmount.toFixed(
    0
  )}).`;
}

// ⭐ Spending-curve analyse
export function analyzeSpendingCurve({
  budget,
  spent,
  daysPassed,
  daysInPeriod,
}: {
  budget: number;
  spent: number;
  daysPassed: number;
  daysInPeriod: number;
}) {
  const dailyBudget = budget / daysInPeriod;
  const expectedSpent = dailyBudget * daysPassed;

  if (spent < expectedSpent * 0.9) {
    return "Je ligt voor op schema. Je hebt minder uitgegeven dan gemiddeld voor dit moment in de maand.";
  }

  if (spent > expectedSpent * 1.1) {
    return "Je ligt iets achter op schema. Je hebt meer uitgegeven dan gemiddeld voor dit moment in de maand.";
  }

  return "Je uitgaven lopen ongeveer gelijk met het verwachte tempo.";
}

// ⭐ Hoofd-insight (premium)
export function generateRealisticInsight({
  sortedCategories,
  budget,
  spent,
  daysPassed,
  daysInPeriod,
}: {
  sortedCategories: [string, number][] | undefined;
  budget: number;
  spent: number;
  daysPassed: number;
  daysInPeriod: number;
}) {
  const safeCategories = Array.isArray(sortedCategories)
    ? sortedCategories
    : [];

  const categoryInsight = analyzeCategories(safeCategories);
  const curveInsight = analyzeSpendingCurve({
    budget,
    spent,
    daysPassed,
    daysInPeriod,
  });

  return `${categoryInsight} ${curveInsight}`;
}
