"use client"

import { SignUpForm } from "@/components/auth/sign-up-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import "@/app/menu-styles.css"

export default function SignUpPage() {
  return (
    <div className="bioquest-bg">
      <div className="mb-8 text-center">
        <h1 className="title-text">BioQuest</h1>
        <h2 className="subtitle-text">Sign Up</h2>
      </div>

      <div className="w-full max-w-md bg-[#b0f4c2] p-6 rounded-2xl shadow-lg">
        <SignUpForm />
      </div>

      <div className="mt-6">
        <Link href="/">
          <button className="menu-button menu-button-small">
            <ArrowLeft className="menu-icon menu-icon-small" strokeWidth={2.5} />
            Back to Menu
          </button>
        </Link>
      </div>
    </div>
  )
}
