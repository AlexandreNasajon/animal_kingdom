"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GameCardTemplate } from "@/components/game-card-template"
import { useState, useEffect } from "react"
import { ChevronLeft, Filter } from "lucide-react"
import type { Card } from "@/types/game" // Use the core Card type instead

export default function DeckGallery() {
  const [deckCards, setDeckCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filters, setFilters] = useState({
    type: "all", // all, animal, impact
    environment: "all", // all, terrestrial, aquatic, amphibian
  })

  // Safely load the advanced deck
  useEffect(() => {
    const loadDeck = async () => {
      try {
        // Dynamic import to prevent parsing errors at build/load time
        const { ADVANCED_DECK } = await import("@/types/advanced-deck")
        setDeckCards(ADVANCED_DECK || [])
        setLoading(false)
      } catch (err) {
        console.error("Error loading deck:", err)
        setError("Could not load the card deck. Please try again later.")
        setLoading(false)
      }
    }

    loadDeck()
  }, [])

  // Apply filters to the deck
  const filteredCards = deckCards.filter((card) => {
    // Filter by type
    if (filters.type !== "all" && card.type !== filters.type) {
      return false
    }

    // Filter by environment (only for animal cards)
    if (filters.environment !== "all" && card.type === "animal" && card.environment !== filters.environment) {
      return false
    }

    return true
  })

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-green-800 text-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4">Loading card gallery...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-green-800 text-white">
        <div className="text-center max-w-md mx-auto p-6 bg-red-900/60 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <Link href="/game/play-options">
            <Button variant="outline" className="mt-4">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Game Menu
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-y-auto bg-green-800 p-4 text-white">
      <div className="container mx-auto">
        <div className="mb-6">
          <Link href="/game/play-options">
            <Button variant="outline" size="sm" className="mb-4">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Game Menu
            </Button>
          </Link>

          <h1 className="text-3xl font-bold mt-2 mb-4">Card Gallery</h1>

          <div className="bg-green-900/80 p-4 rounded-lg mb-4">
            <div className="flex items-center mb-2">
              <Filter className="mr-2 h-5 w-5" />
              <h2 className="text-xl font-semibold">Filters</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Card Type</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={filters.type === "all" ? "default" : "outline"}
                    onClick={() => setFilters({ ...filters, type: "all" })}
                  >
                    All
                  </Button>
                  <Button
                    size="sm"
                    variant={filters.type === "animal" ? "default" : "outline"}
                    onClick={() => setFilters({ ...filters, type: "animal" })}
                  >
                    Animals
                  </Button>
                  <Button
                    size="sm"
                    variant={filters.type === "impact" ? "default" : "outline"}
                    onClick={() => setFilters({ ...filters, type: "impact" })}
                  >
                    Impacts
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Environment</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={filters.environment === "all" ? "default" : "outline"}
                    onClick={() => setFilters({ ...filters, environment: "all" })}
                  >
                    All
                  </Button>
                  <Button
                    size="sm"
                    variant={filters.environment === "terrestrial" ? "default" : "outline"}
                    onClick={() => setFilters({ ...filters, environment: "terrestrial" })}
                    className="border-red-500 text-red-500 hover:bg-red-500/20"
                  >
                    Terrestrial
                  </Button>
                  <Button
                    size="sm"
                    variant={filters.environment === "aquatic" ? "default" : "outline"}
                    onClick={() => setFilters({ ...filters, environment: "aquatic" })}
                    className="border-blue-500 text-blue-500 hover:bg-blue-500/20"
                  >
                    Aquatic
                  </Button>
                  <Button
                    size="sm"
                    variant={filters.environment === "amphibian" ? "default" : "outline"}
                    onClick={() => setFilters({ ...filters, environment: "amphibian" })}
                    className="border-green-500 text-green-500 hover:bg-green-500/20"
                  >
                    Amphibian
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl">Deck</h2>
            <span className="text-sm bg-green-700 px-2 py-1 rounded">
              Showing {filteredCards.length} of {deckCards.length} cards
            </span>
          </div>
        </div>

        <div className="bg-green-900/50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredCards.map((card) => (
              <div key={card.id} className="flex justify-center">
                <GameCardTemplate card={card} size="md" />
              </div>
            ))}
          </div>

          {filteredCards.length === 0 && (
            <div className="text-center py-10 text-gray-300">No cards match the selected filters</div>
          )}
        </div>
      </div>
    </div>
  )
}
