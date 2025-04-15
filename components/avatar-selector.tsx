"use client"
import Image from "next/image"

interface AvatarSelectorProps {
  selectedId: number
  onSelect: (id: number) => void
}

const avatars = [
  { id: 1, name: "Lion", src: "/placeholder.svg?height=60&width=60" },
  { id: 2, name: "Dolphin", src: "/placeholder.svg?height=60&width=60" },
  { id: 3, name: "Eagle", src: "/placeholder.svg?height=60&width=60" },
  { id: 4, name: "Frog", src: "/placeholder.svg?height=60&width=60" },
  { id: 5, name: "Bear", src: "/placeholder.svg?height=60&width=60" },
  { id: 6, name: "Shark", src: "/placeholder.svg?height=60&width=60" },
]

export function AvatarSelector({ selectedId, onSelect }: AvatarSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {avatars.map((avatar) => (
        <div
          key={avatar.id}
          className={`cursor-pointer rounded-lg p-2 transition-all ${
            selectedId === avatar.id ? "bg-green-600 ring-2 ring-green-400" : "bg-green-950/70 hover:bg-green-800/50"
          }`}
          onClick={() => onSelect(avatar.id)}
        >
          <div className="flex flex-col items-center">
            <div className="relative h-16 w-16 overflow-hidden rounded-full">
              <Image src={avatar.src || "/placeholder.svg"} alt={avatar.name} fill className="object-cover" />
            </div>
            <span className="mt-1 text-sm text-white">{avatar.name}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
