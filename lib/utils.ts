import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
  
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  
  return { r, g, b };
}

export function getThemeGradient(
  color: string = "#00294D", // default color coral-blue
  mode: "top" | "bottom" = "bottom"
) {
  const { r, g, b } = hexToRgb(color);
  
  if (mode === "top") {
    return `linear-gradient(rgba(${r}, ${g}, ${b}, 0) 0%, rgba(${r}, ${g}, ${b}, 0.5) 40%, rgb(${r}, ${g}, ${b}, 0.8) 90%)`;
  } else {
    return `linear-gradient(to bottom, rgb(${r}, ${g}, ${b}) 0%, rgba(${r}, ${g}, ${b}, 0.85) 36.06%, rgba(${r}, ${g}, ${b}, 0.8) 89.34%, rgba(${r}, ${g}, ${b}, 0) 100%)`;
  }
}
