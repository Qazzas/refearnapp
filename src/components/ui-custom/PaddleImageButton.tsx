"use client"

import Image from "next/image"

interface Props {
  src: string
  alt: string
  onClick: (src: string) => void
}

export default function PaddleImageButton({ src, alt, onClick }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={400}
      onClick={() => onClick(src)}
      className="rounded-xl border"
    />
  )
}
