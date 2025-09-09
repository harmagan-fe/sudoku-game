<template>
  <div class="hint-section">
    <button
      class="hint-btn"
      :disabled="hintsUsed >= 10 || gameComplete || isPaused"
      @click="$emit('useHint')"
    >
      💡 Get Hint ({{ 10 - hintsUsed }} left)
    </button>
    <p class="hint-cost">Cost: -{{ nextHintCost }} points</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  hintsUsed: number
  gameComplete: boolean
  isPaused: boolean
  nextHintCost: number
}

interface Emits {
  (e: 'useHint'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.hint-section {
  background: #fff3e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.hint-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ff9800;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
}

.hint-btn:hover:not(:disabled) {
  background: #f57c00;
}

.hint-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.hint-cost {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}
</style>
