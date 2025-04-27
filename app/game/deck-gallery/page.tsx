"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GameCardTemplate } from "@/components/game-card-template"
import { useState, useEffect } from "react"
import { ChevronLeft, Filter, Eye, ArrowUp } from "lucide-react"
import type { Card } from "@/types/game" // Use the core Card type instead

export default function DeckGallery() {
  const [deckCards, setDeckCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const [filters, setFilters] = useState({
    type: "all", // all, animal, impact
    environment: "all", // all, terrestrial, aquatic, amphibian
  })

  // Safely load the original deck
  useEffect(() => {
    const loadDeck = async () => {
      try {
        // Dynamic import to prevent parsing errors at build/load time
        const { ORIGINAL_DECK } = await import("@/types/original-deck")
        setDeckCards(ORIGINAL_DECK || [])
        setLoading(false)
      } catch (err) {
        console.error("Error loading deck:", err)
        setError("Could not load the card deck. Please try again later.")
        setLoading(false)
      }
    }

    loadDeck()

    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true)
      } else {
        setShowScrollButton(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

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
      <div className="h-screen flex items-center justify-center bg-[#4eea53] text-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4">Loading card gallery...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#4eea53] text-white">
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
    <>
      {/* Global styles for scrollbar */}
      <style jsx global>{`
        /* Force scrollbar to always be visible */
        html {
          overflow-y: scroll !important;
          scrollbar-width: auto !important;
          scrollbar-color: #005803 #4eea53 !important;
        }
        
        body {
          overflow-y: auto !important;
          min-height: 100vh;
          padding-right: 0 !important; /* Prevent layout shift */
        }
        
        /* WebKit browsers (Chrome, Safari, Edge) */
        ::-webkit-scrollbar {
          width: 16px !important;
          background-color: #4eea53 !important;
        }
        
        ::-webkit-scrollbar-track {
          background-color: #4eea53 !important;
          border-radius: 0 !important;
        }
        
        ::-webkit-scrollbar-thumb {
          background-color: #005803 !important;
          border: 3px solid #4eea53 !important;
          border-radius: 8px !important;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background-color: #004702 !important;
        }
        
        /* Firefox */
        * {
          scrollbar-width: auto !important;
          scrollbar-color: #005803 #4eea53 !important;
        }
      `}</style>

      <div className="min-h-screen bg-[#4eea53] p-4 text-[#005803]">
        <div className="container mx-auto pb-20">
          {" "}
          {/* Added padding at bottom for scroll space */}
          <div className="mb-6">
            <Link href="/game/play-options">
              <Button
                variant="outline"
                size="sm"
                className="mb-4 bg-[#b0f4c2] text-[#005803] border-[#005803] hover:bg-[#9de4af]"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Game Menu
              </Button>
            </Link>

            <h1 className="text-3xl font-bold mt-2 mb-4 text-[#005803]">Card Gallery</h1>

            <div className="bg-[#b0f4c2] p-4 rounded-lg mb-4 shadow-md">
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
                      className={
                        filters.type === "all"
                          ? "bg-[#005803] text-white"
                          : "bg-[#b0f4c2] text-[#005803] border-[#005803]"
                      }
                    >
                      All
                    </Button>
                    <Button
                      size="sm"
                      variant={filters.type === "animal" ? "default" : "outline"}
                      onClick={() => setFilters({ ...filters, type: "animal" })}
                      className={
                        filters.type === "animal"
                          ? "bg-[#005803] text-white"
                          : "bg-[#b0f4c2] text-[#005803] border-[#005803]"
                      }
                    >
                      Animals
                    </Button>
                    <Button
                      size="sm"
                      variant={filters.type === "impact" ? "default" : "outline"}
                      onClick={() => setFilters({ ...filters, type: "impact" })}
                      className={
                        filters.type === "impact"
                          ? "bg-[#005803] text-white"
                          : "bg-[#b0f4c2] text-[#005803] border-[#005803]"
                      }
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
                      className={
                        filters.environment === "all"
                          ? "bg-[#005803] text-white"
                          : "bg-[#b0f4c2] text-[#005803] border-[#005803]"
                      }
                    >
                      All
                    </Button>
                    <Button
                      size="sm"
                      variant={filters.environment === "terrestrial" ? "default" : "outline"}
                      onClick={() => setFilters({ ...filters, environment: "terrestrial" })}
                      className={
                        filters.environment === "terrestrial"
                          ? "bg-red-800 text-white"
                          : "bg-[#b0f4c2] text-red-800 border-red-800 hover:bg-red-100"
                      }
                    >
                      Terrestrial
                    </Button>
                    <Button
                      size="sm"
                      variant={filters.environment === "aquatic" ? "default" : "outline"}
                      onClick={() => setFilters({ ...filters, environment: "aquatic" })}
                      className={
                        filters.environment === "aquatic"
                          ? "bg-blue-800 text-white"
                          : "bg-[#b0f4c2] text-blue-800 border-blue-800 hover:bg-blue-100"
                      }
                    >
                      Aquatic
                    </Button>
                    <Button
                      size="sm"
                      variant={filters.environment === "amphibian" ? "default" : "outline"}
                      onClick={() => setFilters({ ...filters, environment: "amphibian" })}
                      className={
                        filters.environment === "amphibian"
                          ? "bg-green-800 text-white"
                          : "bg-[#b0f4c2] text-green-800 border-green-800 hover:bg-green-100"
                      }
                    >
                      Amphibian
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl">Deck</h2>
              <span className="text-sm bg-[#b0f4c2] px-2 py-1 rounded shadow-sm">
                Showing {filteredCards.length} of {deckCards.length} cards
              </span>
            </div>
          </div>
          <div className="bg-[#b0f4c2]/70 rounded-lg p-4 shadow-lg">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredCards.map((card) => (
                <div key={card.id} className="flex justify-center">
                  <div className="relative group">
                    <GameCardTemplate card={card} size="md" onClick={() => setSelectedCard(card)} />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" className="bg-[#005803] text-white" onClick={() => setSelectedCard(card)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCards.length === 0 && (
              <div className="text-center py-10 text-gray-700">No cards match the selected filters</div>
            )}
          </div>
        </div>

        {/* Scroll to top button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-4 bg-[#b0f4c2] text-[#005803] rounded-full shadow-lg hover:bg-[#9de4af] transition-all z-50 flex items-center justify-center"
          aria-label="Scroll to top"
          style={{ display: showScrollButton ? "flex" : "none" }}
        >
          <ArrowUp className="h-6 w-6" />
        </button>

        {/* Card Detail Modal */}
        {selectedCard && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCard(null)}
          >
            <div className="bg-[#b0f4c2] p-6 rounded-lg max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-center mb-4">
                <GameCardTemplate card={selectedCard} size="xl" />
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-[#005803]">{selectedCard.name}</h3>
                <p className="text-sm mt-2">{selectedCard.effect || "No effect description available."}</p>
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => setSelectedCard(null)} className="bg-[#005803] text-white hover:bg-[#004702]">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
