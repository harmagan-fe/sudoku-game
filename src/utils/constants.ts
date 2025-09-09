import type { Difficulty, DifficultyConfig } from '@/types'

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  beginner: { min: 36, max: 40 },
  intermediate: { min: 32, max: 36 },
  hard: { min: 28, max: 32 },
  expert: { min: 24, max: 28 },
}

export const SCORING = {
  CORRECT_CELL: 5,
  INITIAL_HINT_COST: 3,
  ERROR_PENALTY: 1,
  TIME_BONUS_BASE: 500,
} as const

export const GAME_CONSTANTS = {
  GRID_SIZE: 9,
  TOTAL_CELLS: 81,
  MAX_HINTS: 10,
  BOX_SIZE: 3,
} as const
