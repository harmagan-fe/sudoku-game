import { GAME_CONSTANTS } from './constants'
import type { SudokuCell } from '../types'

export class SudokuValidator {
  static isGameComplete(grid: SudokuCell[]): boolean {
    return (
      grid.every((cell) => cell.value !== null) && this.isValidGrid(grid.map((cell) => cell.value!))
    )
  }

  static isValidGrid(grid: number[]): boolean {
    for (let i = 0; i < GAME_CONSTANTS.GRID_SIZE; i++) {
      if (
        !this.validateRow(grid, i) ||
        !this.validateColumn(grid, i) ||
        !this.validateBox(grid, i)
      ) {
        return false
      }
    }
    return true
  }

  private static validateRow(grid: number[], row: number): boolean {
    const numbers = new Set<number>()
    for (let col = 0; col < GAME_CONSTANTS.GRID_SIZE; col++) {
      const num = grid[row * GAME_CONSTANTS.GRID_SIZE + col]
      if (numbers.has(num)) return false
      numbers.add(num)
    }
    return numbers.size === GAME_CONSTANTS.GRID_SIZE
  }

  private static validateColumn(grid: number[], col: number): boolean {
    const numbers = new Set<number>()
    for (let row = 0; row < GAME_CONSTANTS.GRID_SIZE; row++) {
      const num = grid[row * GAME_CONSTANTS.GRID_SIZE + col]
      if (numbers.has(num)) return false
      numbers.add(num)
    }
    return numbers.size === GAME_CONSTANTS.GRID_SIZE
  }

  private static validateBox(grid: number[], boxIndex: number): boolean {
    const numbers = new Set<number>()
    const boxRow = Math.floor(boxIndex / GAME_CONSTANTS.BOX_SIZE) * GAME_CONSTANTS.BOX_SIZE
    const boxCol = (boxIndex % GAME_CONSTANTS.BOX_SIZE) * GAME_CONSTANTS.BOX_SIZE

    for (let r = boxRow; r < boxRow + GAME_CONSTANTS.BOX_SIZE; r++) {
      for (let c = boxCol; c < boxCol + GAME_CONSTANTS.BOX_SIZE; c++) {
        const num = grid[r * GAME_CONSTANTS.GRID_SIZE + c]
        if (numbers.has(num)) return false
        numbers.add(num)
      }
    }
    return numbers.size === GAME_CONSTANTS.GRID_SIZE
  }

  static getBoxIndex(cellIndex: number): number {
    const row = Math.floor(cellIndex / GAME_CONSTANTS.GRID_SIZE)
    const col = cellIndex % GAME_CONSTANTS.GRID_SIZE
    return (
      Math.floor(row / GAME_CONSTANTS.BOX_SIZE) * GAME_CONSTANTS.BOX_SIZE +
      Math.floor(col / GAME_CONSTANTS.BOX_SIZE)
    )
  }

  static isRowComplete(grid: SudokuCell[], rowIndex: number): boolean {
    const rowCells = this.getRowCells(grid, rowIndex)
    return (
      rowCells.every((cell) => cell.value !== null) &&
      new Set(rowCells.map((cell) => cell.value)).size === GAME_CONSTANTS.GRID_SIZE
    )
  }

  static isColumnComplete(grid: SudokuCell[], colIndex: number): boolean {
    const colCells = this.getColumnCells(grid, colIndex)
    return (
      colCells.every((cell) => cell.value !== null) &&
      new Set(colCells.map((cell) => cell.value)).size === GAME_CONSTANTS.GRID_SIZE
    )
  }

  static isBoxComplete(grid: SudokuCell[], boxIndex: number): boolean {
    const boxCells = this.getBoxCells(grid, boxIndex)
    return (
      boxCells.every((cell) => cell.value !== null) &&
      new Set(boxCells.map((cell) => cell.value)).size === GAME_CONSTANTS.GRID_SIZE
    )
  }

  private static getRowCells(grid: SudokuCell[], rowIndex: number): SudokuCell[] {
    const cells: SudokuCell[] = []
    for (let col = 0; col < GAME_CONSTANTS.GRID_SIZE; col++) {
      cells.push(grid[rowIndex * GAME_CONSTANTS.GRID_SIZE + col])
    }
    return cells
  }

  private static getColumnCells(grid: SudokuCell[], colIndex: number): SudokuCell[] {
    const cells: SudokuCell[] = []
    for (let row = 0; row < GAME_CONSTANTS.GRID_SIZE; row++) {
      cells.push(grid[row * GAME_CONSTANTS.GRID_SIZE + colIndex])
    }
    return cells
  }

  private static getBoxCells(grid: SudokuCell[], boxIndex: number): SudokuCell[] {
    const cells: SudokuCell[] = []
    const boxRow = Math.floor(boxIndex / GAME_CONSTANTS.BOX_SIZE) * GAME_CONSTANTS.BOX_SIZE
    const boxCol = (boxIndex % GAME_CONSTANTS.BOX_SIZE) * GAME_CONSTANTS.BOX_SIZE

    for (let r = boxRow; r < boxRow + GAME_CONSTANTS.BOX_SIZE; r++) {
      for (let c = boxCol; c < boxCol + GAME_CONSTANTS.BOX_SIZE; c++) {
        cells.push(grid[r * GAME_CONSTANTS.GRID_SIZE + c])
      }
    }
    return cells
  }

  static getNumberCount(grid: SudokuCell[], number: number): number {
    return grid.filter((cell) => cell.value === number).length
  }

  static isNumberComplete(grid: SudokuCell[], number: number): boolean {
    return this.getNumberCount(grid, number) >= GAME_CONSTANTS.GRID_SIZE
  }
}
