// Generate a random 6-character room code
export function generateRoomCode(): string {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // Removed similar looking characters
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

// Check if it's the player's turn
export function isPlayerTurn(gameSession: any, userId: string): boolean {
  return gameSession.current_turn === userId
}

// Get opponent ID
export function getOpponentId(gameSession: any, userId: string): string | null {
  if (gameSession.host_id === userId) {
    return gameSession.guest_id
  } else if (gameSession.guest_id === userId) {
    return gameSession.host_id
  }
  return null
}

// Check if user is host
export function isHost(gameSession: any, userId: string): boolean {
  return gameSession.host_id === userId
}

// Format elapsed time
export function formatElapsedTime(startTime: number): string {
  const elapsed = Math.floor((Date.now() - startTime) / 1000)
  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}
