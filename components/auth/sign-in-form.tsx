"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { AlertCircle, Mail } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { ensureUserRegistered } from "@/lib/utils"

interface SignInFormProps {
  onSuccess?: () => void
  showLinks?: boolean
}

export function SignInForm({ onSuccess, showLinks = true }: SignInFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, isEmailVerified } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      // Check if email is verified after successful sign-in
      if (!isEmailVerified) {
        setError("Please verify your email before signing in")
        setIsLoading(false)
        return
      }

      // After successful authentication:
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        // Ensure the user is registered in the users table
        await ensureUserRegistered(data.user.id, {
          username: data.user.email || "Anonymous Player",
          avatar_url: data.user.user_metadata?.avatar_url,
        })
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in")
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-black/50 p-0 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-green-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-black/50 border border-green-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-green-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 bg-black/50 border border-green-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-md p-3 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}

        <div className="pt-2">
          <button type="submit" className="menu-button w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </form>

      {showLinks && (
        <>
          <div className="mt-4 text-center">
            <p className="text-green-300">
              Don't have an account?{" "}
              <Link href="/auth/sign-up" className="text-[#005803] font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-green-800/50 text-center">
            <p className="text-green-300 text-sm mb-2">
              <Mail className="inline-block mr-1 h-4 w-4" />
              Didn't receive verification email?
            </p>
            <button
              className="menu-button-outline text-sm"
              onClick={() => {
                // This would typically trigger a resend verification email function
                alert("Verification email resend functionality would go here")
              }}
            >
              Resend Verification Email
            </button>
          </div>
        </>
      )}
    </div>
  )
}
