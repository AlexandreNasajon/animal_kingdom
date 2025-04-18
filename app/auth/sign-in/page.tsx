"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { SignInForm } from "@/components/auth/sign-in-form"
import { useAuth } from "@/contexts/auth-context"
import { GameService } from "@/services/game-service"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { MenuBackgroundAnimation } from "@/components/menu-background-animation"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(false)

  // Get redirect parameters
  const redirect = searchParams.get("redirect")
  const action = searchParams.get("action")
  const gameId = searchParams.get("gameId")

  useEffect(() => {
    // If user is already logged in and we have redirect params, handle the redirect
    if (user && redirect && !isProcessingRedirect) {
      handleRedirect()
    }
  }, [user, redirect, action, gameId])

  const handleRedirect = async () => {
    if (!user || isProcessingRedirect) return

    setIsProcessingRedirect(true)

    try {
      // Handle specific actions after authentication
      if (redirect === "/game/online") {
        if (action === "host") {
          // Create a game session and redirect to it
          const gameSession = await GameService.createGameSession(user.id!)
          router.push(`/game/match?id=${gameSession.id}`)
          return
        } else if (action === "join" && gameId) {
          // Join the specified game session
          await GameService.joinGameSession(gameId, user.id!)
          router.push(`/game/match?id=${gameId}`)
          return
        }
      }

      // Default redirect if no specific action
      router.push(redirect)
    } catch (error) {
      console.error("Error handling redirect:", error)
      // If there's an error, just redirect to the original page
      router.push(redirect)
    } finally {
      setIsProcessingRedirect(false)
    }
  }

  const handleSuccess = () => {
    if (redirect) {
      handleRedirect()
    } else {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bioquest-bg">
      <MenuBackgroundAnimation />
      <div className="z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 embossed-title">BioDuel</h1>
          <p className="text-green-300">Sign in to play online</p>
        </div>
        <div className="bg-black/50 p-6 rounded-lg border border-green-600 shadow-lg">
          <SignInForm onSuccess={handleSuccess} />
        </div>

        <div className="mt-6 text-center">
          <Link href="/">
            <Button variant="outline" className="bg-green-800/50 border-green-600 hover:bg-green-700 text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Main Menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
