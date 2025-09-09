import { DIFFICULTY_CONFIGS, GAME_CONSTANTS } from './constants'
import type { Difficulty, PuzzleGeneration } from '../types'

export class SudokuGenerator {
  private static readonly NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  static generateCompleteGrid(): number[] {
    const grid = new Array(GAME_CONSTANTS.TOTAL_CELLS).fill(0)
    this.fillGrid(grid)
    return grid
  }

  private static fillGrid(grid: number[]): boolean {
    for (let i = 0; i < GAME_CONSTANTS.TOTAL_CELLS; i++) {
      if (grid[i] === 0) {
        const shuffledNumbers = this.shuffleArray([...this.NUMBERS])

        for (const num of shuffledNumbers) {
          if (this.isValidMove(grid, i, num)) {
            grid[i] = num
            if (this.fillGrid(grid)) return true
            grid[i] = 0
          }
        }
        return false
      }
    }
    return true
  }

  static isValidMove(grid: number[], index: number, num: number): boolean {
    const row = Math.floor(index / GAME_CONSTANTS.GRID_SIZE)
    const col = index % GAME_CONSTANTS.GRID_SIZE

    return (
      this.isValidInRow(grid, row, num) &&
      this.isValidInColumn(grid, col, num) &&
      this.isValidInBox(grid, row, col, num)
    )
  }

  private static isValidInRow(grid: number[], row: number, num: number): boolean {
    for (let c = 0; c < GAME_CONSTANTS.GRID_SIZE; c++) {
      if (grid[row * GAME_CONSTANTS.GRID_SIZE + c] === num) return false
    }
    return true
  }

  private static isValidInColumn(grid: number[], col: number, num: number): boolean {
    for (let r = 0; r < GAME_CONSTANTS.GRID_SIZE; r++) {
      if (grid[r * GAME_CONSTANTS.GRID_SIZE + col] === num) return false
    }
    return true
  }

  private static isValidInBox(grid: number[], row: number, col: number, num: number): boolean {
    const boxRow = Math.floor(row / GAME_CONSTANTS.BOX_SIZE) * GAME_CONSTANTS.BOX_SIZE
    const boxCol = Math.floor(col / GAME_CONSTANTS.BOX_SIZE) * GAME_CONSTANTS.BOX_SIZE

    for (let r = boxRow; r < boxRow + GAME_CONSTANTS.BOX_SIZE; r++) {
      for (let c = boxCol; c < boxCol + GAME_CONSTANTS.BOX_SIZE; c++) {
        if (grid[r * GAME_CONSTANTS.GRID_SIZE + c] === num) return false
      }
    }
    return true
  }

  static generatePuzzle(difficulty: Difficulty): PuzzleGeneration {
    const completeGrid = this.generateCompleteGrid()
    const puzzle = [...completeGrid]

    const { min, max } = DIFFICULTY_CONFIGS[difficulty]
    const cellsToKeep = Math.floor(Math.random() * (max - min + 1)) + min
    const cellsToRemove = GAME_CONSTANTS.TOTAL_CELLS - cellsToKeep

    this.removeCellsRandomly(puzzle, cellsToRemove)
    return { puzzle, solution: completeGrid }
  }

  private static removeCellsRandomly(puzzle: number[], count: number): void {
    const indices = this.shuffleArray(
      Array.from({ length: GAME_CONSTANTS.TOTAL_CELLS }, (_, i) => i)
    )

    for (let i = 0; i < count; i++) {
      puzzle[indices[i]] = 0
    }
  }

  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
}
