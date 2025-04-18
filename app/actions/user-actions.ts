"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export async function registerUser(userId: string, username: string, avatarUrl: string | null = null) {
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
        username,
        avatar_url: avatarUrl,
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
