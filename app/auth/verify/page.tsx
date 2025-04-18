"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function VerifyPage() {
  const { user, isEmailVerified } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(5)

  // Get redirect parameters from the URL or localStorage
  const getRedirectParams = () => {
    // Check URL first
    const urlRedirect = searchParams.get("redirect")
    if (urlRedirect) return urlRedirect

    // Check localStorage as fallback
    try {
      return localStorage.getItem("authRedirect")
    } catch (e) {
      return null
    }
  }

  const redirect = getRedirectParams()

  useEffect(() => {
    // Store redirect in localStorage if it exists
    if (redirect) {
      try {
        localStorage.setItem("authRedirect", redirect)
      } catch (e) {
        console.error("Could not save redirect to localStorage", e)
      }
    }
  }, [redirect])

  useEffect(() => {
    // If user is verified, start countdown to redirect
    if (user && isEmailVerified) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            // Get redirect from localStorage in case URL params were lost
            const savedRedirect = getRedirectParams()
            if (savedRedirect) {
              router.push(savedRedirect)
              // Clear the saved redirect
              try {
                localStorage.removeItem("authRedirect")
              } catch (e) {
                console.error("Could not clear localStorage", e)
              }
            } else {
              router.push("/")
            }
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [user, isEmailVerified])

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-black/50 p-6 rounded-lg border border-green-600 shadow-lg text-center">
          <h1 className="text-2xl font-bold text-green-400 mb-4">Verification Required</h1>
          <p className="text-green-200 mb-6">Please sign in to verify your email.</p>
          <Link href="/auth/sign-in" className="text-green-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-black/50 p-6 rounded-lg border border-green-600 shadow-lg text-center">
        <h1 className="text-2xl font-bold text-green-400 mb-4">
          {isEmailVerified ? "Email Verified!" : "Verify Your Email"}
        </h1>

        {isEmailVerified ? (
          <>
            <p className="text-green-200 mb-6">
              Your email has been verified. You will be redirected in {countdown} seconds.
            </p>
            <Link href={redirect || "/"} className="text-green-400 hover:underline">
              Click here if you are not redirected
            </Link>
          </>
        ) : (
          <>
            <p className="text-green-200 mb-6">
              We've sent a verification link to your email address. Please check your inbox and click the link to verify
              your account.
            </p>
            <p className="text-green-300 mb-4">
              Once verified, you can refresh this page or sign in again to continue.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
