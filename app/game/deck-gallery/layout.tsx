import type React from "react"
import "./styles.css"

export default function DeckGalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="deck-gallery-layout">{children}</div>
}
