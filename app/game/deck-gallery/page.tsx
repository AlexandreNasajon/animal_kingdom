"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Grid, Mountain, Droplets, Fish, Zap, BookOpen } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCardArt } from "@/components/card-art/card-art-mapper"
import { ORIGINAL_DECK } from "@/types/original-deck"
import { EXPANDED_DECK } from "@/types/expanded-deck"
import type { GameCard } from "@/types/game"

export default function DeckGallery() {
  const [currentDeck, setCurrentDeck] = useState<"original" | "expanded">("original")
  const [filter, setFilter] = useState<string>("all")

  // Get the appropriate deck based on selection
  const allCards = currentDeck === "original" ? ORIGINAL_DECK : EXPANDED_DECK

  const filteredCards = allCards.filter((card: GameCard) => {
    if (filter === "all") return true
    if (filter === "terrestrial") return card.type === "animal" && card.environment === "terrestrial"
    if (filter === "aquatic") return card.type === "animal" && card.environment === "aquatic"
    if (filter === "amphibian") return card.type === "animal" && card.environment === "amphibian"
    if (filter === "impact") return card.type === "impact"
    return true
  })

  return (
    <div className="min-h-screen h-full bg-gradient-to-b from-green-800 to-green-950 p-4 text-white overflow-auto">
      <div className="container mx-auto max-w-6xl pb-8">
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

        <Card className="border-2 border-green-700 bg-green-900/60 shadow-xl mb-6">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle className="text-2xl text-white">Select Deck</CardTitle>
              <Tabs
                defaultValue="original"
                className="w-[400px] max-w-full"
                onValueChange={(value) => setCurrentDeck(value as "original" | "expanded")}
              >
                <TabsList className="grid w-full grid-cols-2 gap-2 bg-green-900/40 p-1">
                  <TabsTrigger
                    value="original"
                    className="bg-green-700 text-white data-[state=active]:bg-green-500 data-[state=active]:text-white"
                    title="Original Deck"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Original Deck
                  </TabsTrigger>
                  <TabsTrigger
                    value="expanded"
                    className="bg-green-700 text-white data-[state=active]:bg-green-500 data-[state=active]:text-white"
                    title="Expanded Deck"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Expanded Deck
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-2 border-green-700 bg-green-900/60 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle className="text-2xl text-white">Browse Cards</CardTitle>
              <Tabs defaultValue="all" className="w-[400px] max-w-full" onValueChange={setFilter}>
                <TabsList className="grid w-full grid-cols-5 gap-2 bg-green-900/40 p-1">
                  <TabsTrigger
                    value="all"
                    className="bg-green-700 text-white data-[state=active]:bg-green-500 data-[state=active]:text-white"
                    title="All Cards"
                  >
                    <Grid className="h-5 w-5" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="terrestrial"
                    className="bg-green-700 text-white data-[state=active]:bg-green-500 data-[state=active]:text-white"
                    title="Terrestrial Animals"
                  >
                    <Mountain className="h-5 w-5" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="aquatic"
                    className="bg-green-700 text-white data-[state=active]:bg-green-500 data-[state=active]:text-white"
                    title="Aquatic Animals"
                  >
                    <Droplets className="h-5 w-5" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="amphibian"
                    className="bg-green-700 text-white data-[state=active]:bg-green-500 data-[state=active]:text-white"
                    title="Amphibian Animals"
                  >
                    <Fish className="h-5 w-5" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="impact"
                    className="bg-green-700 text-white data-[state=active]:bg-green-500 data-[state=active]:text-white"
                    title="Impact Cards"
                  >
                    <Zap className="h-5 w-5" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="max-h-[calc(100vh-300px)] overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-green-300">
                {currentDeck === "original" ? "Original Deck" : "Expanded Deck"} - {filteredCards.length} cards
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredCards.map((card) => (
                <div key={card.id} className="relative">
                  <div className="group relative h-[240px] w-[160px] cursor-pointer overflow-hidden rounded-lg border-2 border-green-600 bg-green-800 p-2 transition-all hover:scale-105 hover:border-green-400 hover:shadow-lg">
                    {card.points > 0 && (
                      <div className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-black">
                        {card.points}
                      </div>
                    )}
                    <div className="mb-1 text-center text-sm font-bold truncate">{card.name}</div>
                    <div className="h-[120px] w-full overflow-hidden rounded bg-green-700/50">{getCardArt(card)}</div>
                    <div className="mt-2 text-xs space-y-1">
                      <div className="font-semibold text-green-300">
                        {card.type === "animal" ? card.environment || "Animal" : "Impact"}
                      </div>
                      {card.effect && <div className="line-clamp-3 text-[10px] text-green-100">{card.effect}</div>}
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
