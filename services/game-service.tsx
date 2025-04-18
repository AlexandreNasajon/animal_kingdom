// This file is for backward compatibility
// Re-export everything from the new files
export {
  createGameSession,
  getGameSession,
  joinGameSession,
  getLatestGameState,
  saveGameState,
  endGameSession,
  updateCurrentTurn,
} from "./game-server-actions"

export {
  subscribeToGameSessionChanges,
  subscribeToGameStateChanges,
  GameService,
} from "./game-service-client"
