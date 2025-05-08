import type React from "react"
export default function DeckGalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="deck-gallery-layout">{children}</div>
}
