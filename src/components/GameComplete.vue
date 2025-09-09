<template>
  <div class="game-complete">
    <h2>Congratulations!</h2>
    <div class="final-score">Final Score: {{ finalScore }}</div>
    <p>Time: {{ formatTime(completionTime) }}</p>
  </div>
</template>

<script setup lang="ts">
import { useTimer } from '../composables/useTimer';

interface Props {
  finalScore: number;
  completionTime: number;
}

defineProps<Props>();

const { formatTime } = useTimer();
</script>

<style scoped>
.game-complete {
  text-align: center;
  padding: 20px;
  background: #e8f5e8;
  border-radius: 8px;
  margin: 20px 0;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.game-complete h2 {
  color: #2e7d32;
  margin-bottom: 10px;
}

.final-score {
  font-size: 24px;
  font-weight: bold;
  color: #1b5e20;
  margin: 10px 0;
}
</style>
