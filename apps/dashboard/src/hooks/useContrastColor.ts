// hooks/useContrastColor.ts
import { useMemo } from "react"
import { getContrastColor } from "@/util/Color-util"

export const useContrastColor = (backgroundColor: string | undefined) => {
  return useMemo(() => {
    // Return your preferred default for undefined/empty strings
    const DEFAULT_DARK = "#1f2937"
    return backgroundColor ? getContrastColor(backgroundColor) : DEFAULT_DARK
  }, [backgroundColor])
}
