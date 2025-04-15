"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, BookOpen, User, Settings, ArrowLeft } from "lucide-react"

export default function GameMenu() {
  const router = useRouter()
  const [showSettings, setShowSettings] = useState(false)

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-800 to-green-950 p-4 text-white">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-5xl font-bold tracking-tight">Animal Kingdom</h1>
        <p className="text-xl text-green-200">Main Menu</p>
      </div>

      {!showSettings ? (
        <Card className="w-full max-w-md border-2 border-green-700 bg-green-900/60 shadow-xl">
          <CardContent className="p-6">
            <div className="grid gap-4">
              <Link href="/game/online">
                <Button
                  className="flex w-full items-center justify-start gap-3 bg-green-700 hover:bg-green-600"
                  size="lg"
                >
                  <Gamepad2 className="h-5 w-5" />
                  <span>Play Online</span>
                </Button>
              </Link>

              <Link href="/game/story">
                <Button
                  className="flex w-full items-center justify-start gap-3 bg-green-700 hover:bg-green-600"
                  size="lg"
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Story Mode</span>
                </Button>
              </Link>

              <Link href="/profile">
                <Button className="flex w-full items-center justify-start gap-3" variant="outline" size="lg">
                  <User className="h-5 w-5" />
                  <span>My Account</span>
                </Button>
              </Link>

              <Button
                className="flex w-full items-center justify-start gap-3"
                variant="outline"
                size="lg"
                onClick={handleSettingsToggle}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md border-2 border-green-700 bg-green-900/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <span>Brightness</span>
                <input type="range" min="0" max="100" defaultValue="70" className="w-1/2" />
              </div>

              <div className="flex items-center justify-between">
                <span>Volume</span>
                <input type="range" min="0" max="100" defaultValue="80" className="w-1/2" />
              </div>

              <div className="flex items-center justify-between">
                <span>Music</span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" defaultChecked className="peer sr-only" />
                  <div className="peer h-6 w-11 rounded-full bg-gray-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full"></div>
                </label>
              </div>

              <Button
                className="mt-4 flex w-full items-center justify-center gap-2"
                variant="outline"
                onClick={handleSettingsToggle}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
