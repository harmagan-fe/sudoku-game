import { describe, it, expect } from 'vitest'
import { SudokuGenerator } from '../../src/utils/SudokuGenerator'
import type { Difficulty } from '../../src/types'

describe('SudokuGenerator', () => {
  describe('generateCompleteGrid', () => {
    it('should generate a complete valid 9x9 grid', () => {
      const grid = SudokuGenerator.generateCompleteGrid()

      expect(grid).toHaveLength(81)
      expect(grid.every((cell) => cell >= 1 && cell <= 9)).toBe(true)
      expect(isValidSudokuGrid(grid)).toBe(true)
    })

    it('should generate different grids on multiple calls', () => {
      const grid1 = SudokuGenerator.generateCompleteGrid()
      const grid2 = SudokuGenerator.generateCompleteGrid()

      expect(grid1).not.toEqual(grid2)
    })
  })

  describe('generatePuzzle', () => {
    const difficulties: Difficulty[] = ['beginner', 'intermediate', 'hard', 'expert']

    difficulties.forEach((difficulty) => {
      it(`should generate valid ${difficulty} puzzle`, () => {
        const { puzzle, solution } = SudokuGenerator.generatePuzzle(difficulty)

        expect(puzzle).toHaveLength(81)
        expect(solution).toHaveLength(81)
        expect(isValidSudokuGrid(solution)).toBe(true)

        for (let i = 0; i < 81; i++) {
          if (puzzle[i] !== 0) {
            expect(puzzle[i]).toBe(solution[i])
          }
        }
      })
    })
  })
})

function isValidSudokuGrid(grid: number[]): boolean {
  for (let row = 0; row < 9; row++) {
    const numbers = new Set<number>()
    for (let col = 0; col < 9; col++) {
      const num = grid[row * 9 + col]
      if (numbers.has(num)) return false
      numbers.add(num)
    }
    if (numbers.size !== 9) return false
  }
  return true
}
