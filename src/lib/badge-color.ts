import type React from "react";

// ── Fixed material palette ────────────────────────────────────────────────────
const MATERIAL_HUES: Record<string, number> = {
  PLA:    142,   // emerald green
  PETG:   210,   // blue
  ABS:    25,    // orange
  TPU:    285,   // purple
  "PA-CF": 45,   // amber / gold
};

export const MATERIALS = Object.keys(MATERIAL_HUES);

function toStyle(hue: number): React.CSSProperties {
  return {
    backgroundColor: `hsl(${hue} 55% 18%)`,
    color:           `hsl(${hue} 80% 75%)`,
    borderColor:     `hsl(${hue} 50% 30%)`,
  };
}

/** Fixed colours for known materials; hashed for anything else. */
export function materialColor(material: string): React.CSSProperties {
  const hue = MATERIAL_HUES[material] ?? (Math.abs(hashStr(material)) % 360);
  return toStyle(hue);
}

/** Bright dot colour for inline indicators. */
export function materialDotColor(material: string): string {
  const hue = MATERIAL_HUES[material] ?? (Math.abs(hashStr(material)) % 360);
  return `hsl(${hue} 80% 60%)`;
}

// ── Generic string → colour (for printers, etc.) ─────────────────────────────
function hashStr(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export function badgeColor(str: string): React.CSSProperties {
  const hue = Math.abs(hashStr(str)) % 360;
  return toStyle(hue);
}
