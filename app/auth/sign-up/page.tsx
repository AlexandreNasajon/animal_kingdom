"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { useAuth } from "@/contexts/auth-context"
import { MenuBackgroundAnimation } from "@/components/menu-background-animation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isEmailVerified } = useAuth()

  // Get redirect parameters
  const redirect = searchParams.get("redirect")

  useEffect(() => {
    // If user is logged in and email is verified, handle redirect
    if (user && isEmailVerified && redirect) {
      router.push(redirect)
    }
  }, [user, isEmailVerified, redirect, router])

  const handleSuccess = () => {
    // After sign up, we'll redirect to verification page
    // The redirect params will be handled after verification
    router.push("/auth/verify")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bioquest-bg">
      <MenuBackgroundAnimation />
      <div className="z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 embossed-title">Bioquest</h1>
          <p className="text-green-300">Create an account to play online</p>
        </div>
        <div className="bg-black/50 p-6 rounded-lg border border-green-600">
          <SignUpForm showLinks={true} onSuccess={handleSuccess} />
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
