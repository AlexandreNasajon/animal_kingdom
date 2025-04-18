"use client"

import { createClientSupabaseClient } from "@/lib/supabase"
import {
  createGameSession,
  getGameSession,
  joinGameSession,
  getLatestGameState,
  saveGameState,
  endGameSession,
  updateCurrentTurn,
} from "./game-server-actions"

// Client-only functions
export function subscribeToGameSessionChanges(gameId: string, callback: (data: any) => void) {
  const supabase = createClientSupabaseClient()
  return supabase
    .channel("any")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "game_sessions", filter: `id=eq.${gameId}` },
      (payload) => {
        callback(payload.new)
      },
    )
    .subscribe()
}

export function subscribeToGameStateChanges(gameId: string, callback: (data: any) => void) {
  const supabase = createClientSupabaseClient()
  return supabase
    .channel("any")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "game_states", filter: `game_id=eq.${gameId}` },
      (payload) => {
        callback(payload.new?.state)
      },
    )
    .subscribe()
}

// Export GameService object for backward compatibility
export const GameService = {
  createGameSession,
  getGameSession,
  joinGameSession,
  getLatestGameState,
  saveGameState,
  endGameSession,
  updateCurrentTurn,
  subscribeToGameSessionChanges,
  subscribeToGameStateChanges,
}

// Also export as GameServiceClient for clarity
export const GameServiceClient = GameService
