"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllCards } from "@/utils/game-utils"
import { getCardArt } from "@/components/card-art/card-art-mapper"
import type { GameCard } from "@/types/game"

export default function DeckGallery() {
  const allCards = getAllCards()
  const [filter, setFilter] = useState<string>("all")

  const filteredCards = allCards.filter((card: GameCard) => {
    if (filter === "all") return true
    if (filter === "terrestrial") return card.type === "animal" && card.environment === "terrestrial"
    if (filter === "aquatic") return card.type === "animal" && card.environment === "aquatic"
    if (filter === "amphibian") return card.type === "animal" && card.environment === "amphibian"
    if (filter === "impact") return card.type === "impact"
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-950 p-4 text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Menu
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Card Gallery</h1>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        <Card className="border-2 border-green-700 bg-green-900/60 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-white">Browse Cards</CardTitle>
              <Tabs defaultValue="all" className="w-[400px]" onValueChange={setFilter}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="terrestrial">Terrestrial</TabsTrigger>
                  <TabsTrigger value="aquatic">Aquatic</TabsTrigger>
                  <TabsTrigger value="amphibian">Amphibian</TabsTrigger>
                  <TabsTrigger value="impact">Impact</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredCards.map((card) => (
                <div key={card.id} className="relative">
                  <div className="group relative h-[240px] w-[160px] cursor-pointer overflow-hidden rounded-lg border-2 border-green-600 bg-green-800 p-2 transition-all hover:scale-105 hover:border-green-400 hover:shadow-lg">
                    <div className="mb-1 text-center text-sm font-bold truncate">{card.name}</div>
                    <div className="h-[120px] w-full overflow-hidden rounded bg-green-700/50">{getCardArt(card)}</div>
                    <div className="mt-2 text-xs space-y-1">
                      <div className="font-semibold text-green-300">
                        Type: {card.type === "animal" ? card.environment || "Animal" : "Impact"}
                      </div>
                      {card.points > 0 && <div>Points: {card.points}</div>}
                      {card.effect && (
                        <div className="line-clamp-3 text-[10px] text-green-100">Effect: {card.effect}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
