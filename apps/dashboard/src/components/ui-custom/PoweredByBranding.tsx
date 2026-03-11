// components/ui-custom/PoweredByBranding.tsx
import React from "react"

export const PoweredByBranding = ({ color }: { color?: string }) => {
  return (
    <div
      className="mt-8 mb-4 text-center text-xs flex items-center justify-center gap-1.5 opacity-70"
      style={{ color }}
    >
      <span>Powered by</span>
      <a
        href="https://refearnapp.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 font-semibold hover:opacity-80 transition-opacity"
        style={{ color: "inherit" }} // Important: forces the link to take the parent's color
      >
        <img src="/refearnapp.svg" alt="RefEarnApp Logo" className="w-4 h-4" />
        RefearnApp
      </a>
    </div>
  )
}
