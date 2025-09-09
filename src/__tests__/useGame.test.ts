import { useGame } from '@/composables/useGame'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies
vi.mock('../../../src/composables/useTimer', () => ({
  useTimer: () => ({
    startTimer: vi.fn(),
    stopTimer: vi.fn(),
    pauseTimer: vi.fn(),
    resumeTimer: vi.fn(),
    elapsedTime: { value: 0 },
  }),
}))

vi.mock('../../../src/composables/useRecords', () => ({
  useRecords: () => ({
    saveRecord: vi.fn(),
    showNameInput: vi.fn(),
  }),
}))

describe('useGame', () => {
  let game: ReturnType<typeof useGame>

  beforeEach(() => {
    game = useGame()
  })

  describe('generateNewGame', () => {
    it('should initialize game state correctly', () => {
      game.generateNewGame('beginner')

      expect(game.gameState.grid).toHaveLength(81)
      expect(game.gameState.solution).toHaveLength(81)
      expect(game.gameState.score).toBe(0)
      expect(game.gameState.hintsUsed).toBe(0)
      expect(game.gameState.errorCount).toBe(0)
      expect(game.gameState.gameComplete).toBe(false)
      expect(game.gameState.difficulty).toBe('beginner')
      expect(game.gameState.isPaused).toBe(false)
    })

    it('should create cells with correct properties', () => {
      game.generateNewGame('beginner')

      game.gameState.grid.forEach((cell) => {
        expect(cell).toHaveProperty('value')
        expect(cell).toHaveProperty('prefilled')
        expect(cell).toHaveProperty('hasError', false)
        expect(cell).toHaveProperty('isCorrect', false)
        expect(cell).toHaveProperty('isWrong', false)
      })
    })
  })

  describe('selectCell', () => {
    beforeEach(() => {
      game.generateNewGame('beginner')
    })

    it('should select non-prefilled cells', () => {
      const emptyIndex = game.gameState.grid.findIndex((cell) => !cell.prefilled)

      game.selectCell(emptyIndex)

      expect(game.gameState.selectedCell).toBe(emptyIndex)
    })

    it('should not select prefilled cells', () => {
      const prefilledIndex = game.gameState.grid.findIndex((cell) => cell.prefilled)

      game.selectCell(prefilledIndex)

      expect(game.gameState.selectedCell).toBeNull()
    })

    it('should not select cells when game is paused', () => {
      const emptyIndex = game.gameState.grid.findIndex((cell) => !cell.prefilled)
      game.gameState.isPaused = true

      game.selectCell(emptyIndex)

      expect(game.gameState.selectedCell).toBeNull()
    })
  })

  describe('inputNumber', () => {
    beforeEach(() => {
      game.generateNewGame('beginner')
      const emptyIndex = game.gameState.grid.findIndex((cell) => !cell.prefilled)
      game.selectCell(emptyIndex)
    })

    it('should handle correct input', () => {
      const cellIndex = game.gameState.selectedCell!
      const correctValue = game.gameState.solution[cellIndex]
      const initialScore = game.gameState.score

      game.inputNumber(correctValue)

      expect(game.gameState.grid[cellIndex].value).toBe(correctValue)
      expect(game.gameState.grid[cellIndex].isCorrect).toBe(true)
      expect(game.gameState.grid[cellIndex].isWrong).toBe(false)
      expect(game.gameState.score).toBe(initialScore + 5)
    })

    it('should handle wrong input', () => {
      const cellIndex = game.gameState.selectedCell!
      const correctValue = game.gameState.solution[cellIndex]
      const wrongValue = correctValue === 9 ? 1 : correctValue + 1
      const initialScore = game.gameState.score
      const initialErrors = game.gameState.errorCount

      game.inputNumber(wrongValue)

      expect(game.gameState.grid[cellIndex].value).toBe(wrongValue)
      expect(game.gameState.grid[cellIndex].isCorrect).toBe(false)
      expect(game.gameState.grid[cellIndex].isWrong).toBe(true)
      expect(game.gameState.score).toBe(initialScore - 1)
      expect(game.gameState.errorCount).toBe(initialErrors + 1)
    })

    it('should clear previous correct feedback', () => {
      // First correct input
      const cellIndex1 = game.gameState.selectedCell!
      const correctValue1 = game.gameState.solution[cellIndex1]
      game.inputNumber(correctValue1)

      expect(game.gameState.grid[cellIndex1].isCorrect).toBe(true)

      // Second input should clear first cell's feedback
      const emptyIndex2 = game.gameState.grid.findIndex(
        (cell, index) => !cell.prefilled && index !== cellIndex1 && cell.value === null,
      )
      game.selectCell(emptyIndex2)
      const correctValue2 = game.gameState.solution[emptyIndex2]
      game.inputNumber(correctValue2)

      expect(game.gameState.grid[cellIndex1].isCorrect).toBe(false)
      expect(game.gameState.grid[emptyIndex2].isCorrect).toBe(true)
    })
  })

  describe('togglePause', () => {
    beforeEach(() => {
      game.generateNewGame('beginner')
    })

    it('should toggle pause state', () => {
      expect(game.gameState.isPaused).toBe(false)

      game.togglePause()
      expect(game.gameState.isPaused).toBe(true)

      game.togglePause()
      expect(game.gameState.isPaused).toBe(false)
    })
  })

  describe('useHint', () => {
    beforeEach(() => {
      game.generateNewGame('beginner')
    })

    it('should fill empty cell with correct value', () => {
      const initialHints = game.gameState.hintsUsed
      const initialScore = game.gameState.score

      game.useHint()

      expect(game.gameState.hintsUsed).toBe(initialHints + 1)
      expect(game.gameState.score).toBe(initialScore - 3) // First hint costs 3

      // Find the cell that was filled
      const hintCell = game.gameState.grid.find(
        (cell) => !cell.prefilled && cell.value !== null && cell.isCorrect,
      )
      expect(hintCell).toBeTruthy()
    })

    it('should not work when paused', () => {
      game.gameState.isPaused = true
      const initialHints = game.gameState.hintsUsed

      game.useHint()

      expect(game.gameState.hintsUsed).toBe(initialHints)
    })

    it('should not work when max hints reached', () => {
      game.gameState.hintsUsed = 10
      const initialScore = game.gameState.score

      game.useHint()

      expect(game.gameState.score).toBe(initialScore)
    })
  })
})
