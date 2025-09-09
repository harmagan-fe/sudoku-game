<template>
  <div class="sudoku-grid">
    <SudokuCell
      v-for="(cell, index) in grid"
      :key="index"
      :cell="cell"
      :index="index"
      :is-selected="selectedCell === index && !isPaused"
      :has-row-animation="completedAnimations.rows.includes(Math.floor(index / 9))"
      :has-col-animation="completedAnimations.cols.includes(index % 9)"
      :has-box-animation="completedAnimations.boxes.includes(getBoxIndex(index))"
      @click="!isPaused && $emit('cellSelected', index)"
    />
  </div>
</template>

<script setup lang="ts">
import { SudokuValidator } from '../utils/SudokuValidator'
import SudokuCell from './SudokuCell.vue'
import type { SudokuCell as SudokuCellType, CompletedAnimations } from '../types'

interface Props {
  grid: SudokuCellType[]
  selectedCell: number | null
  completedAnimations: CompletedAnimations
  isPaused: boolean
}

interface Emits {
  (e: 'cellSelected', index: number): void
}

defineProps<Props>()
defineEmits<Emits>()

const getBoxIndex = (cellIndex: number): number => {
  return SudokuValidator.getBoxIndex(cellIndex)
}
</script>

<style scoped>
.sudoku-grid {
  display: grid;
  grid-template-columns: repeat(9, 50px);
  grid-template-rows: repeat(9, 50px);
  gap: 2px;
  background: #333;
  padding: 4px;
  border-radius: 8px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .sudoku-grid {
    grid-template-columns: repeat(9, 40px);
    grid-template-rows: repeat(9, 40px);
  }
}
</style>
