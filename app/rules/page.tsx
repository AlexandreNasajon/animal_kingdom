import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function Rules() {
  return (
    <div className="min-h-screen h-full bg-gradient-to-b from-green-800 to-green-950 p-4 text-white overflow-auto">
      <div className="container mx-auto max-w-3xl pb-8">
        <div className="mb-6 flex items-center">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-1 text-green-300">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>

        <Card className="border-2 border-green-700 bg-green-900/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-white">Game Rules</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none p-6 text-green-100 max-h-[calc(100vh-200px)] overflow-y-auto">
            <h2>Overview</h2>
            <p>
              BioDuel is a strategic card game for two players. Players use animal cards to gain points and impact cards
              to affect the game state.
            </p>

            <h2>Objective</h2>
            <p>The goal is to start your turn with 7 or more points on your field.</p>

            <h2>Setup</h2>
            <ul>
              <li>The game uses a single shared deck of 50 cards.</li>
              <li>The first player draws 5 cards.</li>
              <li>The second player draws 6 cards.</li>
            </ul>

            <h2>Deck Composition</h2>
            <p>The deck contains 50 cards:</p>
            <ul>
              <li>
                25 Animal Cards:
                <ul>
                  <li>12 Aquatic animals (5 worth 1 point, 4 worth 2 points, 3 worth 3 points)</li>
                  <li>12 Terrestrial animals (5 worth 1 point, 4 worth 2 points, 3 worth 3 points)</li>
                  <li>1 Amphibian animal worth 4 points</li>
                </ul>
              </li>
              <li>25 Impact Cards with various effects</li>
            </ul>

            <h2>Turn Structure</h2>
            <p>On your turn, you may:</p>
            <ul>
              <li>Draw 2 cards from the shared deck, OR</li>
              <li>Play 1 card from your hand</li>
            </ul>

            <h2>Hand Management</h2>
            <ul>
              <li>
                If you have 5 cards and want to draw, you must first place 1 card from your hand to the bottom of the
                shared deck.
              </li>
              <li>
                If you have 6 cards and want to draw, you must first place 2 cards from your hand to the bottom of the
                shared deck.
              </li>
            </ul>

            <h2>Card Types</h2>
            <h3>Animal Cards</h3>
            <p>
              When played, animal cards remain on the field and add their point value to your total. There are three
              environments:
            </p>
            <ul>
              <li>
                <strong>Aquatic:</strong> Water-dwelling creatures
              </li>
              <li>
                <strong>Terrestrial:</strong> Land-dwelling creatures
              </li>
              <li>
                <strong>Amphibian:</strong> Can live in both environments
              </li>
            </ul>

            <h3>Impact Cards</h3>
            <p>When played, impact cards create an immediate effect and are then discarded. Examples include:</p>
            <ul>
              <li>
                <strong>Hunter:</strong> Destroy 1 terrestrial animal on the field
              </li>
              <li>
                <strong>Fisher:</strong> Destroy 1 aquatic animal on the field
              </li>
              <li>
                <strong>Scare:</strong> Send 1 animal from the field to the top of the deck
              </li>
              <li>
                <strong>Veterinarian:</strong> Play an animal card from the discard pile
              </li>
              {/* Removed Drought and Flood examples */}
              <li>And many more...</li>
            </ul>

            <h2>Winning the Game</h2>
            <p>If you start your turn with 7 or more points on your field, you win the game!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
