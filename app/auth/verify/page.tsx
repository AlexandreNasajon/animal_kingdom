"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MenuBackgroundAnimation } from "@/components/menu-background-animation"
import { CheckCircle, XCircle } from "lucide-react"

export default function VerifyPage() {
  const [verificationState, setVerificationState] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const token = searchParams.get("token")
        const type = searchParams.get("type")

        if (!token || type !== "email") {
          setVerificationState("error")
          setErrorMessage("Invalid verification link")
          return
        }

        const supabase = getSupabaseClient()
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "email",
        })

        if (error) {
          console.error("Verification error:", error)
          setVerificationState("error")
          setErrorMessage(error.message)
        } else {
          setVerificationState("success")
        }
      } catch (err) {
        console.error("Verification error:", err)
        setVerificationState("error")
        setErrorMessage("An unexpected error occurred")
      }
    }

    handleEmailConfirmation()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bioquest-bg">
      <MenuBackgroundAnimation />
      <div className="z-10 w-full max-w-md bg-black/50 p-8 rounded-lg border border-green-600">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-6 embossed-title">Email Verification</h1>

          {verificationState === "loading" && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
              <p className="text-green-300">Verifying your email...</p>
            </div>
          )}

          {verificationState === "success" && (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Email Verified!</h2>
              <p className="text-green-300 mb-6">Your email has been successfully verified.</p>
              <Link href="/auth/sign-in">
                <Button className="bg-green-700 hover:bg-green-600 text-white">Sign In</Button>
              </Link>
            </div>
          )}

          {verificationState === "error" && (
            <div className="flex flex-col items-center">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Verification Failed</h2>
              <p className="text-red-300 mb-2">{errorMessage || "Failed to verify your email."}</p>
              <p className="text-green-300 mb-6">Please try again or contact support.</p>
              <div className="flex gap-4">
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
          )}
        </div>
      </div>
    </div>
  )
}
