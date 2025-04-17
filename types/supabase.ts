export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          updated_at?: string
        }
      }
      game_sessions: {
        Row: {
          id: string
          host_id: string
          guest_id: string | null
          status: "waiting" | "playing" | "completed"
          winner_id: string | null
          created_at: string
          updated_at: string
          room_code: string
          current_turn: string | null
        }
        Insert: {
          id?: string
          host_id: string
          guest_id?: string | null
          status?: "waiting" | "playing" | "completed"
          winner_id?: string | null
          created_at?: string
          updated_at?: string
          room_code: string
          current_turn?: string | null
        }
        Update: {
          id?: string
          host_id?: string
          guest_id?: string | null
          status?: "waiting" | "playing" | "completed"
          winner_id?: string | null
          updated_at?: string
          room_code?: string
          current_turn?: string | null
        }
      }
      game_states: {
        Row: {
          id: string
          game_id: string
          state: Json
          created_at: string
          sequence: number
        }
        Insert: {
          id?: string
          game_id: string
          state: Json
          created_at?: string
          sequence: number
        }
        Update: {
          id?: string
          game_id?: string
          state?: Json
          created_at?: string
          sequence?: number
        }
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string
          points: number
          requirement: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image_url: string
          points: number
          requirement: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string
          points?: number
          requirement?: string
          created_at?: string
        }
      }
      quests: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          difficulty: string
          points: number
          content: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          difficulty: string
          points: number
          content: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          difficulty?: string
          points?: number
          content?: Json
          created_at?: string
          updated_at?: string
        }
      }
      user_badges: {
        Row: {
          user_id: string
          badge_id: string
          earned_at: string
        }
        Insert: {
          user_id: string
          badge_id: string
          earned_at?: string
        }
        Update: {
          user_id?: string
          badge_id?: string
          earned_at?: string
        }
      }
    }
  }
}
