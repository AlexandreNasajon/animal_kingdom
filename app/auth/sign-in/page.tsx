"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import "@/app/menu-styles.css"
import { SignInForm } from "@/components/auth/sign-in-form"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Redirect to account if already logged in
  useEffect(() => {
    if (user) {
      router.push("/account")
    }
  }, [user, router])

  return (
    <div className="bioquest-bg">
      <div className="mb-6 text-center">
        <h1 className="title-text">Vegan</h1>
        <h2 className="subtitle-text">sign in</h2>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <div className="w-full bg-white/10 rounded-lg p-4">
          <SignInForm />
        </div>

        <p className="text-white text-center">
          Don't have an account?{" "}
          <Link href="/auth/sign-up" className="text-green-400 hover:text-green-300 underline">
            Sign Up
          </Link>
        </p>

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
