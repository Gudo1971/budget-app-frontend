export type NeonColor = {
  neonColor: string;
  softGlow: string;
  hoverGlow: string;
  aura: string;
};

export const neonColors: Record<string, NeonColor> = {
  Kinderen: {
    neonColor: "#00eaff",
    softGlow: "0 0 18px rgba(0, 234, 255, 0.55)",
    hoverGlow: "0 0 28px rgba(0, 234, 255, 0.85)",
    aura: "0 0 40px rgba(0, 234, 255, 0.35)",
  },
  Boodschappen: {
    neonColor: "#ff009d",
    softGlow: "0 0 18px rgba(255, 0, 157, 0.55)",
    hoverGlow: "0 0 28px rgba(255, 0, 157, 0.85)",
    aura: "0 0 40px rgba(255, 0, 157, 0.35)",
  },
  Vervoer: {
    neonColor: "#ffae00",
    softGlow: "0 0 18px rgba(255, 174, 0, 0.55)",
    hoverGlow: "0 0 28px rgba(255, 174, 0, 0.85)",
    aura: "0 0 40px rgba(255, 174, 0, 0.35)",
  },
  Wonen: {
    neonColor: "#7d5bff",
    softGlow: "0 0 18px rgba(125, 91, 255, 0.55)",
    hoverGlow: "0 0 28px rgba(125, 91, 255, 0.85)",
    aura: "0 0 40px rgba(125, 91, 255, 0.35)",
  },
  Gezondheid: {
    neonColor: "#00ff85",
    softGlow: "0 0 18px rgba(0, 255, 133, 0.55)",
    hoverGlow: "0 0 28px rgba(0, 255, 133, 0.85)",
    aura: "0 0 40px rgba(0, 255, 133, 0.35)",
  },
  VrijeTijd: {
    neonColor: "#ff3b3b",
    softGlow: "0 0 18px rgba(255, 59, 59, 0.55)",
    hoverGlow: "0 0 28px rgba(255, 59, 59, 0.85)",
    aura: "0 0 40px rgba(255, 59, 59, 0.35)",
  },
  Cadeaus: {
    neonColor: "#ff7ae6",
    softGlow: "0 0 18px rgba(255, 122, 230, 0.55)",
    hoverGlow: "0 0 28px rgba(255, 122, 230, 0.85)",
    aura: "0 0 40px rgba(255, 122, 230, 0.35)",
  },
  Overig: {
    neonColor: "#9eff00",
    softGlow: "0 0 18px rgba(158, 255, 0, 0.55)",
    hoverGlow: "0 0 28px rgba(158, 255, 0, 0.85)",
    aura: "0 0 40px rgba(158, 255, 0, 0.35)",
  },
  Onbekend: {
    neonColor: "#888",
    softGlow: "0 0 12px rgba(180, 180, 180, 0.4)",
    hoverGlow: "0 0 18px rgba(180, 180, 180, 0.6)",
    aura: "0 0 25px rgba(180, 180, 180, 0.25)",
  },
};
