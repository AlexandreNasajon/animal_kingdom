"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gamepad2 } from "lucide-react"

export default function Home() {
  useEffect(() => {
    const audio = new Audio("/music.mp3")
    audio.loop = true
    audio.play().catch(() => {}) // Prevent error if autoplay is blocked
    return () => audio.pause()
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-800 to-green-950 p-2 text-white">
      <div className="mb-4 text-center">
        <h1 className="mb-1 text-3xl font-bold tracking-tight">Bioquest</h1>
        <p className="text-sm text-green-200">Strategic card game of wildlife dominance</p>
      </div>

      <Card className="w-full max-w-xs border-2 border-green-700 bg-green-900 shadow-xl">
        <CardContent className="p-3">
          <Link href="/game/match?mode=ai">
            <Button
              className="flex w-full items-center justify-center gap-2 bg-green-700 hover:bg-green-600"
              size="default"
            >
              <Gamepad2 className="h-4 w-4" />
              <span>Play Against AI</span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="mt-3 text-center text-xs text-green-300">
        <p>Win by starting your turn with 7 or more points!</p>
      </div>
    </div>
  )
}
