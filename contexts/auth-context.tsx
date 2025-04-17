"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, username: string) => Promise<{ error: any; user: User | null }>
  signOut: () => Promise<void>
  isEmailVerified: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const setupAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)

      // Check if email is verified
      if (session?.user) {
        setIsEmailVerified(session.user.email_confirmed_at != null)
      }

      setIsLoading(false)

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        // Update email verification status
        if (session?.user) {
          setIsEmailVerified(session.user.email_confirmed_at != null)
        } else {
          setIsEmailVerified(false)
        }

        setIsLoading(false)
      })

      return () => subscription.unsubscribe()
    }

    setupAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${window.location.origin}/auth/verify`,
      },
    })

    if (!error && data.user) {
      // Create user profile
      await supabase.from("users").insert({
        id: data.user.id,
        username,
        avatar_url: null,
      })
    }

    return { error, user: data.user }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signOut, isEmailVerified }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
