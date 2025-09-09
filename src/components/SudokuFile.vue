<template>
  <div
    class="sudoku-cell"
    :class="{
      prefilled: cell.prefilled,
      selected: isSelected,
      error: cell.hasError,
      'completed-row': hasRowAnimation,
      'completed-col': hasColAnimation,
      'completed-box': hasBoxAnimation,
      'thick-right': isThickRightBorder,
      'thick-bottom': isThickBottomBorder,
    }"
    @click="$emit('click')"
  >
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

.sudoku-cell.error {
  background: #ffebee;
  color: #d32f2f;
  animation: shake 0.5s ease-in-out;
}

.sudoku-cell.completed-row,
.sudoku-cell.completed-col,
.sudoku-cell.completed-box {
  animation: glow 1s ease-in-out;
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

@media (max-width: 768px) {
  .sudoku-cell {
    font-size: 16px;
  }
}
</style>
