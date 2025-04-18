"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SignInForm } from "@/components/auth/sign-in-form"
import { useAuth } from "@/contexts/auth-context"
import { GameService } from "@/services/game-service"

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
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-black/50 p-6 rounded-lg border border-green-600 shadow-lg">
        <h1 className="text-2xl font-bold text-green-400 mb-6 text-center">Sign In</h1>
        <SignInForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
