"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Volume2, VolumeX } from "lucide-react"
import "@/app/menu-styles.css"

export default function SettingsPage() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)

  // Load settings from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSoundEnabled = localStorage.getItem("vegan_sound_enabled")
      const savedMusicEnabled = localStorage.getItem("vegan_music_enabled")

      if (savedSoundEnabled !== null) {
        setSoundEnabled(savedSoundEnabled === "true")
      }
      if (savedMusicEnabled !== null) {
        setMusicEnabled(savedMusicEnabled === "true")
      }
    }
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("vegan_sound_enabled", soundEnabled.toString())
      localStorage.setItem("vegan_music_enabled", musicEnabled.toString())
    }
  }, [soundEnabled, musicEnabled])

  return (
    <div className="bioquest-bg">
      <div className="mb-6 text-center">
        <h1 className="title-text">Vegan</h1>
        <h2 className="subtitle-text">settings</h2>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <div className="w-full bg-white/10 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white text-lg">Sound Effects</span>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-full ${soundEnabled ? "bg-green-500" : "bg-red-500"}`}
            >
              {soundEnabled ? <Volume2 className="text-white" /> : <VolumeX className="text-white" />}
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white text-lg">Music</span>
            <button
              onClick={() => setMusicEnabled(!musicEnabled)}
              className={`p-2 rounded-full ${musicEnabled ? "bg-green-500" : "bg-red-500"}`}
            >
              {musicEnabled ? <Volume2 className="text-white" /> : <VolumeX className="text-white" />}
            </button>
          </div>
        </div>

        <Link href="/" className="w-full">
          <button className="menu-button menu-button-small">
            <ArrowLeft className="menu-icon menu-icon-small" strokeWidth={2.5} />
            Back
          </button>
        </Link>
      </div>
    </div>
  )
}
