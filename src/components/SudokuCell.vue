<template>
  <div class="sudoku-cell" :class="cellClasses" @click="$emit('click')">
    {{ cell.value || '' }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SudokuCell } from '../types'

interface Props {
  cell: SudokuCell
  index: number
  isSelected: boolean
  hasRowAnimation: boolean
  hasColAnimation: boolean
  hasBoxAnimation: boolean
}

interface Emits {
  (e: 'click'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const cellClasses = computed(() => ({
  prefilled: props.cell.prefilled,
  selected: props.isSelected,
  error: props.cell.hasError,
  'wrong-input': props.cell.isWrong && !props.cell.prefilled,
  'correct-input': props.cell.isCorrect && !props.cell.prefilled,
  'completed-row': props.hasRowAnimation,
  'completed-col': props.hasColAnimation,
  'completed-box': props.hasBoxAnimation,
  'thick-right': isThickRightBorder.value,
  'thick-bottom': isThickBottomBorder.value,
}))

const isThickRightBorder = computed(() => {
  const col = props.index % 9
  return (col + 1) % 3 === 0 && col !== 8
})

const isThickBottomBorder = computed(() => {
  const row = Math.floor(props.index / 9)
  return (row + 1) % 3 === 0 && row !== 8
})
</script>

<style scoped>
.sudoku-cell {
  background: white;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.sudoku-cell.thick-right {
  border-right: 3px solid #333;
}

.sudoku-cell.thick-bottom {
  border-bottom: 3px solid #333;
}

.sudoku-cell.prefilled {
  background: #e8f4fd;
  color: #1976d2;
  cursor: default;
}

.sudoku-cell.selected {
  background: #bbdefb;
  border: 2px solid #1976d2;
}

.sudoku-cell.wrong-input {
  background: #ffebee !important;
  color: #d32f2f !important;
  border-color: #f44336 !important;
}

.sudoku-cell.correct-input {
  background: #fff9c4 !important;
  color: #f57f17 !important;
  border-color: #ffc107 !important;
  animation: correctPulse 0.5s ease-in-out;
}

@keyframes correctPulse {
  0% {
    transform: scale(1);
    background: #ffeb3b;
  }
  50% {
    transform: scale(1.1);
    background: #fdd835;
  }
  100% {
    transform: scale(1);
    background: #fff9c4;
  }
}

.sudoku-cell.error {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.sudoku-cell.completed-row,
.sudoku-cell.completed-col,
.sudoku-cell.completed-box {
  animation: glow 1s ease-in-out;
}

@keyframes glow {
  0% {
    background: #c8e6c9;
  }
  50% {
    background: #4caf50;
  }
  100% {
    background: white;
  }
}

.sudoku-cell:hover:not(.prefilled):not(.wrong-input):not(.correct-input) {
  background: #f5f5f5;
  border-color: #999;
}

@media (max-width: 768px) {
  .sudoku-cell {
    font-size: 16px;
  }
}
</style>
