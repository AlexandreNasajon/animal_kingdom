"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { SignInForm } from "./sign-in-form"
import { SignUpForm } from "./sign-up-form"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: "signin" | "signup"
  onSuccess?: () => void
}

export function AuthModal({ isOpen, onClose, initialTab = "signin", onSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(initialTab)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-md bg-black/90 border border-green-600 rounded-lg shadow-lg p-6 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-green-400 hover:text-green-300 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <div className="flex border-b border-green-700">
            <button
              className={`flex-1 py-2 text-center font-medium ${
                activeTab === "signin" ? "text-green-400 border-b-2 border-green-400" : "text-green-200"
              }`}
              onClick={() => setActiveTab("signin")}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2 text-center font-medium ${
                activeTab === "signup" ? "text-green-400 border-b-2 border-green-400" : "text-green-200"
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="p-4">
          {activeTab === "signin" ? (
            <SignInForm onSuccess={onSuccess} showLinks={false} />
          ) : (
            <SignUpForm onSuccess={onSuccess} showLinks={false} />
          )}
        </div>

        <div className="mt-4 text-center text-green-300 text-sm">
          {activeTab === "signin" ? (
            <p>
              Don't have an account?{" "}
              <button onClick={() => setActiveTab("signup")} className="text-green-400 hover:underline">
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button onClick={() => setActiveTab("signin")} className="text-green-400 hover:underline">
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
