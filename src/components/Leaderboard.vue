<template>
  <div class="leaderboard-section">
    <h3>🏆 High Scores</h3>
    <div v-for="difficulty in difficulties" :key="difficulty">
      <h4 class="difficulty-title">{{ formatDifficulty(difficulty) }}</h4>
      <ul class="records-list">
        <li v-for="(record, index) in getTopRecords(difficulty)" :key="index" class="record-item">
          <span class="rank">#{{ index + 1 }}</span>
          <span class="name">{{ record.playerName }}</span>
          <span class="score">{{ record.score }}</span>
        </li>
        <li v-if="getTopRecords(difficulty).length === 0" class="record-item empty">
          <span>No records yet</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRecords } from '../composables/useRecords'
import type { Difficulty } from '../types'

const { getTopRecords } = useRecords()

const difficulties: Difficulty[] = ['beginner', 'intermediate', 'hard', 'expert']

const formatDifficulty = (difficulty: Difficulty): string => {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
}
</script>

<style scoped>
.leaderboard-section {
  background: #f3e5f5;
  border-radius: 8px;
  padding: 20px;
}

.leaderboard-section h3 {
  margin-bottom: 15px;
  color: #333;
  text-align: center;
}

.difficulty-title {
  margin: 15px 0 8px 0;
  font-size: 14px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.records-list {
  list-style: none;
  margin: 0 0 10px 0;
  padding: 0;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;
}

.record-item:last-child {
  border-bottom: none;
}

.record-item.empty {
  justify-content: center;
  color: #999;
  font-style: italic;
}

.rank {
  font-weight: bold;
  color: #8e24aa;
  width: 25px;
}

.name {
  flex: 1;
  margin: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.score {
  font-weight: bold;
  color: #2e7d32;
}
</style>
