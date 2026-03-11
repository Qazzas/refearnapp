// lib/color-utils.ts
export const getContrastColor = (hex: string): string => {
  // Fallback for empty strings
  if (!hex) return "#1f2937"

  // Remove '#' if present
  const color = hex.replace("#", "")

  // Convert to RGB
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)

  // Calculate luminance (W3C standard)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  // Return soft white for dark backgrounds, soft black for light backgrounds
  return yiq >= 128 ? "#1f2937" : "#f9fafb"
}
