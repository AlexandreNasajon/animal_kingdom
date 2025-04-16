"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gamepad2, BookOpen, ScrollText, ImageIcon } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-800 to-green-950 p-4 text-white">
      <div className="mb-6 text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Bioquest</h1>
        <p className="text-lg text-green-200">Ecosystem Card Game</p>
      </div>

      <Card className="w-full max-w-md border-2 border-green-700 bg-green-900/60 shadow-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl text-center text-white">Main Menu</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid gap-3">
            <Link href="/game/match">
              <Button
                className="flex w-full items-center justify-start gap-3 bg-green-700 hover:bg-green-600"
                size="lg"
              >
                <Gamepad2 className="h-5 w-5" />
                <span>Play Game</span>
              </Button>
            </Link>

            <Link href="/rules">
              <Button
                className="flex w-full items-center justify-start gap-3 bg-green-700 hover:bg-green-600"
                size="lg"
              >
                <BookOpen className="h-5 w-5" />
                <span>Game Rules</span>
              </Button>
            </Link>

            <Link href="/game/deck-gallery">
              <Button
                className="flex w-full items-center justify-start gap-3 bg-green-700 hover:bg-green-600"
                size="lg"
              >
                <ImageIcon className="h-5 w-5" />
                <span>Card Gallery</span>
              </Button>
            </Link>

            <Link href="/credits">
              <Button
                className="flex w-full items-center justify-start gap-3 bg-green-700 hover:bg-green-600"
                size="lg"
              >
                <ScrollText className="h-5 w-5" />
                <span>Credits</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-sm text-green-300">
        <p>© 2025 NasajonGames</p>
      </div>
    </div>
  )
}
