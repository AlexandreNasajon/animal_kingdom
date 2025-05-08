"use client"

import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import "@/app/menu-styles.css"

export default function VerifyPage() {
  return (
    <div className="bioquest-bg">
      <div className="mb-6 text-center">
        <h1 className="title-text">Vegan</h1>
        <h2 className="subtitle-text">verify email</h2>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <div className="w-full bg-white/10 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-500 rounded-full p-3">
              <Check className="text-white h-8 w-8" />
            </div>
          </div>
          <h3 className="text-white text-xl mb-2">Check Your Email</h3>
          <p className="text-white mb-4">
            We've sent you a verification link. Please check your email and click the link to verify your account.
          </p>
        </div>

        <Link href="/auth/sign-in" className="w-full">
          <button className="menu-button menu-button-medium">Return to Sign In</button>
        </Link>

        <Link href="/" className="w-full">
          <button className="menu-button menu-button-small">
            <ArrowLeft className="menu-icon menu-icon-small" strokeWidth={2.5} />
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  )
}
