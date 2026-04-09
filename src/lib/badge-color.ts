/**
 * Deterministically maps any string to a consistent dark-theme badge color.
 * Same value always gets the same hue; different values get visually distinct hues.
 */
export function badgeColor(str: string): React.CSSProperties {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return {
    backgroundColor: `hsl(${hue} 55% 18%)`,
    color: `hsl(${hue} 80% 75%)`,
    borderColor: `hsl(${hue} 50% 30%)`,
  };
}

// Needed for the return type
import type React from "react";
