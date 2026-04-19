import tinycolor from "tinycolor2";

// ⭐ Dynamische soft‑neon generator
// - zachte neon look
// - premium
// - niet te fel
// - consistent met jouw oude stijl
export function generateSoftNeonColor(index: number) {
  const hue = (index * 47) % 360; // mooie spreiding

  return tinycolor({
    h: hue,
    s: 72, // minder fel dan pure neon
    l: 62, // zachte premium look
  }).toHexString();
}

// ⭐ Kleur toewijzen aan categorieën
// - elke categorie krijgt automatisch een kleur
// - kleur blijft stabiel op basis van index
// - nieuwe categorieën krijgen nieuwe kleur
export function assignCategoryColors(categories: any[]) {
  return categories.map((cat, index) => {
    // Als categorie al een kleur heeft → respecteer die
    if (cat.color) return cat;

    return {
      ...cat,
      color: generateSoftNeonColor(index),
    };
  });
}
