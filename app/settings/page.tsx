"use client"

import Link from "next/link"
import { ArrowLeft, Volume2, Moon, Sun, Globe } from "lucide-react"
import "@/app/menu-styles.css"
import { useState } from "react"

export default function SettingsPage() {
  const [volume, setVolume] = useState(50)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [language, setLanguage] = useState("English")

  return (
    <div className="bioquest-bg">
      <div className="mb-8 text-center">
        <h1 className="title-text">BioQuest</h1>
        <h2 className="subtitle-text">Settings</h2>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-md bg-[#b0f4c2] p-6 rounded-2xl shadow-lg">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="menu-icon" strokeWidth={2.5} />
            <span className="text-[#005803] font-bold text-xl">Volume</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number.parseInt(e.target.value))}
            className="w-32"
          />
        </div>

        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isDarkMode ? (
              <Moon className="menu-icon" strokeWidth={2.5} />
            ) : (
              <Sun className="menu-icon" strokeWidth={2.5} />
            )}
            <span className="text-[#005803] font-bold text-xl">Dark Mode</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#005803]"></div>
          </label>
        </div>

        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="menu-icon" strokeWidth={2.5} />
            <span className="text-[#005803] font-bold text-xl">Language</span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white text-[#005803] font-bold rounded-md px-2 py-1"
          >
            <option>English</option>
            <option>Português</option>
            <option>Español</option>
          </select>
        </div>

        <Link href="/" className="w-full mt-4">
          <button className="menu-button menu-button-small">
            <ArrowLeft className="menu-icon menu-icon-small" strokeWidth={2.5} />
            Back to Menu
          </button>
        </Link>
      </div>
    </div>
  )
}
