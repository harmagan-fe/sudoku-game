<template>
  <div class="game-stats">
    <div class="stat-item">Score: {{ score }}</div>
    <div class="stat-item timer-section">
      Time: {{ formatTime(elapsedTime) }}
      <button
        class="pause-btn"
        :class="{ playing: !isPaused, paused: isPaused }"
        @click="$emit('togglePause')"
      >
        {{ isPaused ? '▶️' : '⏸️' }}
      </button>
    </div>
    <div class="stat-item">Hints: {{ hintsUsed }}/10</div>
    <div class="stat-item">Errors: {{ errorCount }}</div>
  </div>
</template>

<script setup lang="ts">
import { useTimer } from '../composables/useTimer'

interface Props {
  score: number
  elapsedTime: number
  hintsUsed: number
  errorCount: number
  isPaused: boolean
}

interface Emits {
  (e: 'togglePause'): void
}

defineProps<Props>()
defineEmits<Emits>()

const { formatTime } = useTimer()
</script>

<style scoped>
.game-stats {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
}

.stat-item {
  background: #f8f9fa;
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: bold;
}

.timer-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pause-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
}

.pause-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.pause-btn.paused {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
