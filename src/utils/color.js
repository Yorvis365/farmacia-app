/** Convierte #rgb o #rrggbb a {r,g,b} */
export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

/** Convierte un canal sRGB a luminancia lineal (WCAG) */
function srgbToLinear(c) {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** Devuelve el color de texto con mejor contraste sobre un fondo dado */
export function getContrastColor(hex) {
  try {
    const { r, g, b } = hexToRgb(hex);
    const L = 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
    return L > 0.45 ? '#0f172a' : '#ffffff';
  } catch {
    return '#ffffff';
  }
}

/** Versión RGBA del color para overlays sutiles */
export function withAlpha(hex, alpha = 0.15) {
  try {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch {
    return hex;
  }
}

/** Paleta sugerida para el selector de color */
export const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#64748b',
];