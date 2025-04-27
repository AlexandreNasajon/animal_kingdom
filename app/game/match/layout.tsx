import type React from "react"
import "./match-styles.css"

export default function MatchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="match-layout">{children}</div>
}
