import { getSupabaseClient } from "@/lib/supabase"
import type { GameState } from "@/types/game"
import { initializeGame } from "@/utils/game-utils"
import { generateRoomCode } from "@/utils/online-utils"

export class GameService {
  // Create a new game session
  static async createGameSession(hostId: string) {
    const supabase = getSupabaseClient()

    // First check if the user exists
    const { data: user, error: userError } = await supabase.from("users").select("id").eq("id", hostId).single()

    if (userError || !user) {
      console.error("Error finding user:", userError)
      throw new Error("User not found. Please sign in again.")
    }

    const roomCode = generateRoomCode()

    const { data: gameSession, error } = await supabase
      .from("game_sessions")
      .insert({
        host_id: hostId,
        room_code: roomCode,
        status: "waiting",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating game session:", error)
      throw error
    }

    return gameSession
  }

  // Join an existing game session
  static async joinGameSession(roomCode: string, guestId: string) {
    const supabase = getSupabaseClient()

    // First check if the room exists and is in waiting status
    const { data: gameSession, error: findError } = await supabase
      .from("game_sessions")
      .select("*")
      .eq("room_code", roomCode)
      .eq("status", "waiting")
      .single()

    if (findError || !gameSession) {
      console.error("Error finding game session:", findError)
      throw new Error("Game session not found or not available")
    }

    // Update the game session with the guest
    const { data: updatedSession, error: updateError } = await supabase
      .from("game_sessions")
      .update({
        guest_id: guestId,
        status: "playing",
        current_turn: gameSession.host_id, // Host goes first
      })
      .eq("id", gameSession.id)
      .select()
      .single()

    if (updateError) {
      console.error("Error joining game session:", updateError)
      throw updateError
    }

    // Initialize the game state
    const initialState = initializeGame()

    // Save the initial game state
    await this.saveGameState(gameSession.id, initialState, 1)

    return updatedSession
  }

  // Get a game session by room code
  static async getGameSession(roomCode: string) {
    const supabase = getSupabaseClient()

    const { data: gameSession, error } = await supabase
      .from("game_sessions")
      .select("*, host:host_id(*), guest:guest_id(*)")
      .eq("room_code", roomCode)
      .single()

    if (error) {
      console.error("Error getting game session:", error)
      throw error
    }

    return gameSession
  }

  // Get the latest game state
  static async getLatestGameState(gameId: string) {
    const supabase = getSupabaseClient()

    const { data: gameState, error } = await supabase
      .from("game_states")
      .select("*")
      .eq("game_id", gameId)
      .order("sequence", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("Error getting game state:", error)
      throw error
    }

    return gameState.state as GameState
  }

  // Save a new game state
  static async saveGameState(gameId: string, state: GameState, sequence: number) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("game_states").insert({
      game_id: gameId,
      state,
      sequence,
    })

    if (error) {
      console.error("Error saving game state:", error)
      throw error
    }

    return data
  }

  // Update the current turn
  static async updateCurrentTurn(gameId: string, userId: string) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("game_sessions")
      .update({
        current_turn: userId,
      })
      .eq("id", gameId)
      .select()
      .single()

    if (error) {
      console.error("Error updating current turn:", error)
      throw error
    }

    return data
  }

  // End a game session
  static async endGameSession(gameId: string, winnerId: string) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("game_sessions")
      .update({
        status: "completed",
        winner_id: winnerId,
      })
      .eq("id", gameId)
      .select()
      .single()

    if (error) {
      console.error("Error ending game session:", error)
      throw error
    }

    return data
  }

  // Subscribe to game state changes
  static subscribeToGameStateChanges(gameId: string, callback: (state: GameState) => void) {
    const supabase = getSupabaseClient()

    const subscription = supabase
      .channel(`game-state-${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "game_states",
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          callback(payload.new.state as GameState)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }

  // Subscribe to game session changes
  static subscribeToGameSessionChanges(gameId: string, callback: (session: any) => void) {
    const supabase = getSupabaseClient()

    const subscription = supabase
      .channel(`game-session-${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_sessions",
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          callback(payload.new)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }
}
