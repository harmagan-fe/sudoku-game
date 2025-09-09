<template>
  <div class="game-controls">
    <div class="difficulty-selector">
      <select :value="difficulty" @change="handleDifficultyChange">
        <option value="beginner">Beginner (36-40 cells)</option>
        <option value="intermediate">Intermediate (32-36 cells)</option>
        <option value="hard">Hard (28-32 cells)</option>
        <option value="expert">Expert (24-28 cells)</option>
      </select>
    </div>

    <button class="new-game-btn" @click="$emit('newGame')">New Game</button>
  </div>
</template>

<script setup lang="ts">
import type { Difficulty } from '../types'

interface Props {
  difficulty: Difficulty
}

interface Emits {
  (e: 'difficultyChanged', difficulty: Difficulty): void
  (e: 'newGame'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleDifficultyChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement
  emit('difficultyChanged', target.value as Difficulty)
}
</script>

<style scoped>
.game-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.difficulty-selector select {
  padding: 10px 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  cursor: pointer;
}

.new-game-btn {
  background: #4caf50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.new-game-btn:hover {
  background: #45a049;
}

@media (max-width: 768px) {
  .game-controls {
    justify-content: center;
  }
}
</style>
