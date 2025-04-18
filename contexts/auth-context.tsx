"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { ensureUserRegistered } from "@/lib/utils"
import type { Session, User } from "@supabase/supabase-js"

type AuthContextType = {
  user: {
    id: string | undefined
    email: string | undefined
    username: string
    avatar_url: string | null
  } | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, username: string) => Promise<{ error: any; user: User | null }>
  signOut: () => Promise<void>
  isEmailVerified: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{
    id: string | undefined
    email: string | undefined
    username: string
    avatar_url: string | null
  } | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (data.session) {
        const supabaseUser = data.session.user

        // Ensure user is registered in the database
        await ensureUserRegistered(supabaseUser.id, {
          username: supabaseUser.email || "Anonymous Player",
          avatar_url: supabaseUser.user_metadata?.avatar_url,
        })

        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email,
          username: supabaseUser.user_metadata?.username || supabaseUser.email?.split("@")[0] || "Anonymous",
          avatar_url: supabaseUser.user_metadata?.avatar_url || null,
        })
      }

      setIsLoading(false)
    }

    getSession()

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const supabaseUser = session.user

        // Ensure user is registered in the database
        await ensureUserRegistered(supabaseUser.id, {
          username: supabaseUser.email || "Anonymous Player",
          avatar_url: supabaseUser.user_metadata?.avatar_url,
        })

        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email,
          username: supabaseUser.user_metadata?.username || supabaseUser.email?.split("@")[0] || "Anonymous",
          avatar_url: supabaseUser.user_metadata?.avatar_url || null,
        })
      } else {
        setUser(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

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
      await ensureUserRegistered(data.user.id, { username })
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
