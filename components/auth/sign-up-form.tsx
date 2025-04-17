"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error, user } = await signUp(email, password, username)

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      setIsSuccess(true)
      setIsLoading(false)
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up")
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-black/50 p-6 rounded-lg border border-green-600 text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Verification Email Sent!</h2>
        <p className="text-green-300 mb-6">
          We've sent a verification link to <strong>{email}</strong>. Please check your email and click the link to
          complete your registration.
        </p>
        <p className="text-green-200 mb-6 text-sm">If you don't see the email, check your spam folder.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/sign-in">
            <Button variant="outline" className="border-green-600 hover:bg-green-700/50 text-white">
              Sign In
            </Button>
          </Link>
          <Link href="/">
            <Button className="bg-green-700 hover:bg-green-600 text-white">Return to Main Menu</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/50 p-6 rounded-lg border border-green-600">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-green-300 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 bg-black/50 border border-green-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
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
            minLength={6}
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
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-700 hover:bg-green-600 text-white flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <p className="text-green-300">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-green-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
