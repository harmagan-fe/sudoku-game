<template>
  <div class="game-container">
    <div class="header">
      <h1>Sudoku</h1>
    </div>

    <GameControls
      :difficulty="gameState.difficulty"
      @difficulty-changed="generateNewGame"
      @new-game="generateNewGame"
    />

    <!-- <p>Dialog State: {{ showNameDialog }}</p> -->

    <GameStats
      :score="gameState.score"
      :elapsed-time="elapsedTime"
      :hints-used="gameState.hintsUsed"
      :error-count="gameState.errorCount"
      :is-paused="gameState.isPaused"
      @toggle-pause="togglePause"
    />

    <GameComplete
      v-if="isGameComplete"
      :final-score="gameState.finalScore"
      :completion-time="gameState.completionTime"
    />

    <NameInputDialog
      v-if="showNameDialog"
      @submit="submitName"
      @cancel="cancelNameInput"
    />

    <div class="main-game" :class="{ 'game-paused': gameState.isPaused }">
      <div class="sudoku-container">
        <SudokuGrid
          :grid="gameState.grid"
          :selected-cell="selectedCell"
          :completed-animations="completedAnimations"
          :is-paused="gameState.isPaused"
          @cell-selected="selectCell"
        />

        <NumberPad
          :grid="gameState.grid"
          :game-complete="isGameComplete"
          :is-paused="gameState.isPaused"
          @number-input="inputNumber"
        />
      </div>

      <div class="side-panel">
        <HintSection
          :hints-used="gameState.hintsUsed"
          :game-complete="isGameComplete"
          :is-paused="gameState.isPaused"
          :next-hint-cost="getNextHintCost()"
          @use-hint="useHint"
        />

        <Leaderboard />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useGame } from './composables/useGame';
import { useRecords } from './composables/useRecords';
import GameControls from './components/GameControls.vue';
import GameStats from './components/GameStats.vue';
import GameComplete from './components/GameComplete.vue';
import SudokuGrid from './components/SudokuGrid.vue';
import NumberPad from './components/NumberPad.vue';
import HintSection from './components/HintSection.vue';
import Leaderboard from './components/Leaderboard.vue';
import NameInputDialog from './components/NameInputDialog.vue';

const {
  gameState,
  completedAnimations,
  elapsedTime,
  selectedCell,
  isGameComplete,
  generateNewGame,
  selectCell,
  inputNumber,
  useHint,
  togglePause,
  getNextHintCost
} = useGame();

const { showNameDialog, submitName, cancelNameInput } = useRecords();


const handleKeyPress = (event: KeyboardEvent): void => {
  if (gameState.isPaused) return;

  if (event.key >= '1' && event.key <= '9') {
    inputNumber(parseInt(event.key));
  } else if (event.key === 'Backspace' || event.key === 'Delete') {
    if (selectedCell.value !== null) {
      const cell = gameState.grid[selectedCell.value];
      if (!cell.prefilled) {
        cell.value = null;
        cell.hasError = false;
        cell.isCorrect = false;
        cell.isWrong = false;
      }
    }
  } else if (event.key === ' ' || event.key === 'p' || event.key === 'P') {
    event.preventDefault();
    togglePause();
  }
};

onMounted(() => {
  generateNewGame();
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<style scoped>
.game-paused {
  pointer-events: none;
  opacity: 0.6;
}

.game-paused .sudoku-container::after {
  content: 'PAUSED';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  z-index: 10;
}

.sudoku-container {
  position: relative;
}

.game-container {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  max-width: 900px;
  width: 100%;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.main-game {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 30px;
  align-items: start;
  transition: all 0.3s ease;
}

.sudoku-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.side-panel {
  min-width: 250px;
}

@media (max-width: 768px) {
  .main-game {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .header h1 {
    font-size: 2rem;
  }

  .game-container {
    padding: 20px;
  }
}
</style>
