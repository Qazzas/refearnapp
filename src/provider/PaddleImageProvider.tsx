"use client"

import React, { createContext, useContext, useState } from "react"

interface PaddleImageContextType {
  dialogOpen: boolean
  selectedImage: string | null
  openImage: (src: string) => void
  setDialogOpen: (state: boolean) => void
}

const PaddleImageContext = createContext<PaddleImageContextType | null>(null)

export function PaddleImageProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const openImage = (src: string) => {
    setSelectedImage(src)
    setDialogOpen(true)
  }

  return (
    <PaddleImageContext.Provider
      value={{ dialogOpen, selectedImage, openImage, setDialogOpen }}
    >
      {children}
    </PaddleImageContext.Provider>
  )
}

export function usePaddleImage() {
  const ctx = useContext(PaddleImageContext)
  if (!ctx)
    throw new Error("usePaddleImage must be used inside PaddleImageProvider")
  return ctx
}
