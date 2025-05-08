"use client"
import Link from "next/link"
import { GameCardTemplate } from "@/components/game-card-template"
import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import "@/app/game/deck-gallery/styles.css"
import { CardZoomModal } from "@/components/card-zoom-modal"
import { ORIGINAL_DECK } from "@/types/original-deck"

export default function DeckGalleryPage() {
  const [activeTab, setActiveTab] = useState("animals")
  const [selectedCard, setSelectedCard] = useState<any | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Get animal and impact cards directly from ORIGINAL_DECK
  const animalCards = ORIGINAL_DECK.filter((card) => card.type === "animal")
  const impactCards = ORIGINAL_DECK.filter((card) => card.type === "impact")

  const handleCardClick = (card: any) => {
    setSelectedCard(card)
    setShowModal(true)
  }

  // Force the body to have overflow-y: scroll
  useEffect(() => {
    // Add the class to force scrollbar
    document.body.classList.add("force-scrollbar")

    // Clean up when component unmounts
    return () => {
      document.body.classList.remove("force-scrollbar")
    }
  }, [])

  return (
    <div className="gallery-container min-h-screen bg-gradient-to-b from-green-800 to-green-600 p-4 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6 sticky top-0 z-10 bg-green-800 p-4 rounded-lg">
          <Link href="/game/play-options" className="bg-green-700 hover:bg-green-800 text-white p-2 rounded-full mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-white">Vegan Card Gallery</h1>
        </div>

        <div className="bg-green-700 rounded-lg p-2 mb-6 flex sticky top-20 z-10">
          <button
            className={`flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors ${
              activeTab === "animals" ? "bg-green-900" : "hover:bg-green-800"
            }`}
            onClick={() => setActiveTab("animals")}
          >
            Animals
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors ${
              activeTab === "impacts" ? "bg-green-900" : "hover:bg-green-800"
            }`}
            onClick={() => setActiveTab("impacts")}
          >
            Impacts
          </button>
        </div>

        <div className="cards-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-20">
          {activeTab === "animals"
            ? animalCards.map((card) => (
                <div
                  key={card.id}
                  className="transform transition-transform hover:scale-105 cursor-pointer"
                  onClick={() => handleCardClick(card)}
                >
                  <GameCardTemplate card={card} size="md" />
                </div>
              ))
            : impactCards.map((card) => (
                <div
                  key={card.id}
                  className="transform transition-transform hover:scale-105 cursor-pointer"
                  onClick={() => handleCardClick(card)}
                >
                  <GameCardTemplate card={card} size="md" />
                </div>
              ))}
        </div>
      </div>

      <CardZoomModal
        card={selectedCard}
        showCardDetail={showModal}
        setShowCardDetail={setShowModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  )
}
