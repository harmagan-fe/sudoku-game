<template>
  <div class="number-pad">
    <button
      v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
      :key="num"
      class="number-btn"
      :class="{ disabled: isNumberComplete(num) }"
      :disabled="gameComplete || isPaused"
      @click="$emit('numberInput', num)"
    >
      {{ num }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { SudokuValidator } from '../utils/SudokuValidator'
import type { SudokuCell } from '../types'

interface Props {
  grid: SudokuCell[]
  gameComplete: boolean
  isPaused: boolean
}

interface Emits {
  (e: 'numberInput', num: number): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const isNumberComplete = (num: number): boolean => {
  return SudokuValidator.isNumberComplete(props.grid, num)
}
</script>

<style scoped>
.number-pad {
  display: flex;
  gap: 3px;
  margin: 9px 0;
}

.number-btn {
  width: 50px;
  height: 50px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.number-btn:hover:not(:disabled):not(.disabled) {
  background: #f5f5f5;
  border-color: #1976d2;
}

.number-btn.disabled,
.number-btn:disabled {
  background: #f0f0f0;
  color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .number-btn {
    width: 40px;
    height: 40px;
  }
}
</style>
