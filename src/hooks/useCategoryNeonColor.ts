// Generate infinite unique neon colors using golden angle
function generateNeonColor(key: string) {
  // Stable hash → consistent color per category
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % 360000;
  }

  // Golden angle distribution
  const hue = (hash * 137.508) % 360;

  const neonColor = `hsl(${hue}, 95%, 60%)`;
  const softGlow = `0 0 12px hsla(${hue}, 95%, 60%, 0.55)`;
  const hoverGlow = `0 0 18px hsla(${hue}, 95%, 60%, 0.85)`;
  const aura = `0 0 28px hsla(${hue}, 95%, 60%, 0.45)`;

  return { neonColor, softGlow, hoverGlow, aura };
}

export function getCategoryNeonColor(categoryName: string) {
  return generateNeonColor(categoryName);
}
