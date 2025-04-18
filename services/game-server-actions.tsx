"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { generateRoomCode } from "@/utils/online-utils"

// Export individual async functions
export async function createGameSession(hostId: string, hostName?: string) {
  const supabase = createServerSupabaseClient()
  const roomCode = generateRoomCode()

  const { data, error } = await supabase
    .from("game_sessions")
    .insert([
      {
        host_id: hostId,
        status: "waiting",
        room_code: roomCode,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create game session: ${error.message}`)
  }

  return data
}

export async function getGameSession(roomCode: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("game_sessions")
    .select(`*, host:host_id(username, avatar_url), guest:guest_id(username, avatar_url)`)
    .eq("room_code", roomCode)
    .single()

  if (error) {
    throw new Error(`Failed to get game session: ${error.message}`)
  }

  return data
}

export async function joinGameSession(roomCode: string, guestId: string, guestName?: string) {
  const supabase = createServerSupabaseClient()

  const { data: existingSession, error: existingSessionError } = await supabase
    .from("game_sessions")
    .select("guest_id")
    .eq("room_code", roomCode)
    .single()

  if (existingSessionError) {
    throw new Error(`Failed to check existing game session: ${existingSessionError.message}`)
  }

  if (existingSession?.guest_id) {
    throw new Error("This game session is already full.")
  }

  const { data, error } = await supabase
    .from("game_sessions")
    .update({ guest_id: guestId, status: "playing" })
    .eq("room_code", roomCode)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to join game session: ${error.message}`)
  }

  return data
}

export async function getLatestGameState(gameId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("game_states")
    .select("state")
    .eq("game_id", gameId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    throw new Error(`Failed to get latest game state: ${error.message}`)
  }

  return data?.state
}

export async function saveGameState(gameId: string, state: any, sequence: number) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("game_states").insert([
    {
      game_id: gameId,
      state: state,
      sequence: sequence,
    },
  ])

  if (error) {
    throw new Error(`Failed to save game state: ${error.message}`)
  }
}

export async function endGameSession(gameId: string, winnerId: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from("game_sessions")
    .update({ status: "completed", winner_id: winnerId })
    .eq("id", gameId)

  if (error) {
    throw new Error(`Failed to end game session: ${error.message}`)
  }
}

export async function updateCurrentTurn(gameId: string, currentTurn: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("game_sessions").update({ current_turn: currentTurn }).eq("id", gameId)

  if (error) {
    throw new Error(`Failed to update current turn: ${error.message}`)
  }
}
