"use client"

import { Card, CardContent } from "@/components/ui/card"

interface DeckSelectorProps {
  selectedId: number
  onSelect: (id: number) => void
}

// Update the deck descriptions to clarify these are pre-built deck configurations, not separate decks
const decks = [
  { id: 1, name: "Aquatic Focus", description: "Deck with more aquatic creatures" },
  { id: 2, name: "Terrestrial Focus", description: "Deck with more land animals" },
  { id: 3, name: "Balanced Ecosystem", description: "Equal distribution of all animal types" },
]

export function DeckSelector({ selectedId, onSelect }: DeckSelectorProps) {
  return (
    <div className="grid gap-3">
      {decks.map((deck) => (
        <Card
          key={deck.id}
          className={`cursor-pointer border transition-all ${
            selectedId === deck.id
              ? "border-green-400 bg-green-800/50"
              : "border-green-700 bg-green-950/70 hover:bg-green-900/50"
          }`}
          onClick={() => onSelect(deck.id)}
        >
          <CardContent className="p-3">
            <div className="flex flex-col">
              <span className="font-medium text-white">{deck.name}</span>
              <span className="text-sm text-green-300">{deck.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
