import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getSupabaseClient } from "./supabase"

// Function to ensure a user is registered in the database
export const ensureUserRegistered = async (
  userId: string,
  userData: { username: string; avatar_url?: string | null },
) => {
  const supabase = getSupabaseClient()

  // Check if user exists
  const { data: existingUser, error: checkError } = await supabase.from("users").select("id").eq("id", userId).single()

  if (checkError && checkError.code !== "PGRST116") {
    // Not found error code
    console.error("Error checking user:", checkError)
    return
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
    }
  }
}

// Add any other utility functions here
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const cn2 = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ")
}
