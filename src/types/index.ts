export interface SudokuCell {
  value: number | null
  prefilled: boolean
  hasError: boolean
  originalValue: number
  isCorrect: boolean
  isWrong: boolean
}

export interface GameState {
  grid: SudokuCell[]
  solution: number[]
  selectedCell: number | null
  score: number
  hintsUsed: number
  errorCount: number
  elapsedTime: number
  completionTime: number
  gameComplete: boolean
  finalScore: number
  difficulty: Difficulty
  isPaused: boolean
}

export interface CompletedAnimations {
  rows: number[]
  cols: number[]
  boxes: number[]
}

export interface GameRecord {
  playerName: string
  score: number
  time: number
  difficulty: Difficulty
  timestamp: number
}

export interface Records {
  beginner: GameRecord[]
  intermediate: GameRecord[]
  hard: GameRecord[]
  expert: GameRecord[]
}

export type Difficulty = 'beginner' | 'intermediate' | 'hard' | 'expert'

export interface DifficultyConfig {
  min: number
  max: number
}

export interface PuzzleGeneration {
  puzzle: number[]
  solution: number[]
}
