"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, LogOut } from "lucide-react"
import "@/app/menu-styles.css"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function AccountPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Redirect to sign in if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth/sign-in")
    }
  }, [user, router])

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="bioquest-bg">
      <div className="mb-6 text-center">
        <h1 className="title-text">Vegan</h1>
        <h2 className="subtitle-text">account</h2>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <div className="w-full bg-white/10 rounded-lg p-4">
          <h3 className="text-white text-xl mb-2">Profile</h3>
          <p className="text-white mb-1">
            <span className="font-bold">Email:</span> {user.email}
          </p>
          <p className="text-white mb-1">
            <span className="font-bold">User ID:</span> {user.id.substring(0, 8)}...
          </p>
        </div>

        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="menu-button menu-button-medium bg-red-600 hover:bg-red-700"
        >
          <LogOut className="menu-icon menu-icon-medium" strokeWidth={2.5} />
          {isLoading ? "Signing Out..." : "Sign Out"}
        </button>

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
