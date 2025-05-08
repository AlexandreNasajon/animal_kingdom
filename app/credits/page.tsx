import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function Credits() {
  return (
    <div className="min-h-screen h-full bg-gradient-to-b from-green-800 to-green-950 p-4 text-white overflow-auto">
      <div className="container mx-auto max-w-3xl pb-8">
        <div className="mb-4 flex items-center">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-1 text-green-300">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>

        <Card className="border-2 border-green-700 bg-green-900/60 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-white">Credits</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none p-4 text-green-100 max-h-[calc(100vh-200px)] overflow-y-auto">
            <h2 className="text-xl mt-0">Game Design & Development</h2>
            <p>
              <strong>Alexandre Nasajon</strong> - Lead Game Designer & Developer
            </p>
            <p>
              Vegan was designed as an educational card game to teach players about veganism, animal welfare, and
              environmental impacts.
            </p>

            <h2 className="text-xl">Artwork</h2>
            <p>
              All card artwork and animations were created specifically for this project. The art style combines simple
              vector graphics with animations to bring the cards to life.
            </p>

            <h2 className="text-xl">Production</h2>
            <p>
              Produced by <strong>NasajonGames</strong> © 2025
            </p>
            <p>
              This game was developed using Next.js, React, Tailwind CSS, and other modern web technologies to create an
              interactive and responsive gaming experience.
            </p>

            <h2 className="text-xl">Special Thanks</h2>
            <p>Special thanks to everyone who provided feedback and suggestions during the development of this game.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
