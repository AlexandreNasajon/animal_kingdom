"use client"

import Link from "next/link"
import { ArrowLeft, User, Mail, LogOut } from "lucide-react"
import "@/app/menu-styles.css"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"

export default function AccountPage() {
  const { user, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    setIsSigningOut(false)
  }

  return (
    <div className="bioquest-bg">
      <div className="mb-8 text-center">
        <h1 className="title-text">BioQuest</h1>
        <h2 className="subtitle-text">Account</h2>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-md bg-[#b0f4c2] p-6 rounded-2xl shadow-lg">
        {user ? (
          <>
            <div className="w-full flex items-center gap-4 bg-white/50 p-4 rounded-xl">
              <User className="menu-icon" strokeWidth={2.5} />
              <div className="flex flex-col">
                <span className="text-[#005803] font-bold text-lg">Username</span>
                <span className="text-[#005803]">{user.username}</span>
              </div>
            </div>

            <div className="w-full flex items-center gap-4 bg-white/50 p-4 rounded-xl">
              <Mail className="menu-icon" strokeWidth={2.5} />
              <div className="flex flex-col">
                <span className="text-[#005803] font-bold text-lg">Email</span>
                <span className="text-[#005803]">{user.email}</span>
              </div>
            </div>

            <button onClick={handleSignOut} disabled={isSigningOut} className="menu-button menu-button-small w-full">
              <LogOut className="menu-icon menu-icon-small" strokeWidth={2.5} />
              {isSigningOut ? "Signing Out..." : "Sign Out"}
            </button>
          </>
        ) : (
          <div className="text-center p-4">
            <p className="text-[#005803] font-bold text-xl mb-4">You are not signed in</p>
            <Link href="/auth/sign-in" className="w-full">
              <button className="menu-button">
                <User className="menu-icon" strokeWidth={2.5} />
                Sign In
              </button>
            </Link>
          </div>
        )}

        <Link href="/" className="w-full mt-2">
          <button className="menu-button menu-button-small">
            <ArrowLeft className="menu-icon menu-icon-small" strokeWidth={2.5} />
            Back to Menu
          </button>
        </Link>
      </div>
    </div>
  )
}
