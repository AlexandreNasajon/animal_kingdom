import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Add any other utility functions here
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const cn2 = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ")
}

import { createServerSupabaseClient } from "@/lib/supabase"

export async function ensureUserRegistered(userId: string, userData: { username: string; avatar_url?: string | null }) {
  try {
    const supabase = createServerSupabaseClient()

    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // Not found error code
      console.error("Error checking user:", checkError)
      return { success: false, error: "Error checking if user exists" }
    }

    // If user doesn't exist, create them
    if (!existingUser) {
      const { error: insertError } = await supabase.from("users").insert({
        id: userId,
        username: userData.username,
        avatar_url: userData.avatar_url,
      })

      if (insertError) {
        console.error("Error creating user record:", insertError)
        return { success: false, error: insertError.message }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Server error registering user:", error)
    return { success: false, error: "Server error registering user" }
  }
}
