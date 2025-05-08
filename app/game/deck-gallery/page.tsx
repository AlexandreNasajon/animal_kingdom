"use client"
import Link from "next/link"
import { GameCardTemplate } from "@/components/game-card-template"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import "@/app/game/deck-gallery/styles.css"
import { CardZoomModal } from "@/components/card-zoom-modal"
import { getAnimalCards, getImpactCards } from "@/utils/game-utils"

export default function DeckGalleryPage() {
  const [activeTab, setActiveTab] = useState("animals")
  const [selectedCard, setSelectedCard] = useState<any | null>(null)
  const [showModal, setShowModal] = useState(false)

  const animalCards = getAnimalCards()
  const impactCards = getImpactCards()

  const handleCardClick = (card: any) => {
    setSelectedCard(card)
    setShowModal(true)
  }

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <Link href="/game/play-options" className="back-button">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="gallery-title">Vegan Card Gallery</h1>
      </div>

      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === "animals" ? "active" : ""}`}
          onClick={() => setActiveTab("animals")}
        >
          Animals
        </button>
        <button
          className={`tab-button ${activeTab === "impacts" ? "active" : ""}`}
          onClick={() => setActiveTab("impacts")}
        >
          Impacts
        </button>
      </div>

      <div className="cards-container">
        {activeTab === "animals"
          ? animalCards.map((card) => (
              <div key={card.id} className="card-wrapper" onClick={() => handleCardClick(card)}>
                <GameCardTemplate card={card} size="md" />
              </div>
            ))
          : impactCards.map((card) => (
              <div key={card.id} className="card-wrapper" onClick={() => handleCardClick(card)}>
                <GameCardTemplate card={card} size="md" />
              </div>
            ))}
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
