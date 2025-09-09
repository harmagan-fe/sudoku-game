import { ref, computed, reactive, onMounted, onUnmounted } from 'vue';
import { SudokuGenerator } from '../utils/SudokuGenerator';
import { SudokuValidator } from '../utils/SudokuValidator';
import { useTimer } from './useTimer';
import { useScoring } from './useScoring';
import { useRecords } from './useRecords';
import { GAME_CONSTANTS } from '../utils/constants';
import type {
  GameState,
  SudokuCell,
  Difficulty,
  CompletedAnimations
} from '../types';

export function useGame() {
  const gameState = reactive<GameState>({
    grid: [],
    solution: [],
    selectedCell: null,
    score: 0,
    hintsUsed: 0,
    errorCount: 0,
    elapsedTime: 0,
    completionTime: 0,
    gameComplete: false,
    finalScore: 0,
    difficulty: 'beginner',
    isPaused: false
  });

  const completedAnimations = reactive<CompletedAnimations>({
    rows: [],
    cols: [],
    boxes: []
  });

  const permanentlyCompleted = reactive({
    rows: new Set<number>(),
    cols: new Set<number>(),
    boxes: new Set<number>()
  });

  const lastCorrectInputCell = ref<number | null>(null);

  const { startTimer, stopTimer, elapsedTime, pauseTimer, resumeTimer } = useTimer();
  const { calculateScore, calculateFinalScore, getNextHintCost } = useScoring();
  const { showNameInput, getTopRecords } = useRecords();

  const selectedCell = computed(() => gameState.selectedCell);
  const isGameComplete = computed(() => gameState.gameComplete);

  const createSudokuCell = (value: number): SudokuCell => ({
    value: value || null,
    prefilled: value !== 0,
    hasError: false,
    originalValue: value,
    isCorrect: false,
    isWrong: false
  });

  const clearPreviousCorrectFeedback = (): void => {
    if (lastCorrectInputCell.value !== null) {
      const previousCell = gameState.grid[lastCorrectInputCell.value];
      if (previousCell) {
        previousCell.isCorrect = false;
      }
      lastCorrectInputCell.value = null;
    }
  };

  const setCellFeedback = (cellIndex: number, isCorrect: boolean): void => {
    const cell = gameState.grid[cellIndex];
    clearPreviousCorrectFeedback();

    if (isCorrect) {
      cell.isCorrect = true;
      cell.isWrong = false;
      cell.hasError = false;
      lastCorrectInputCell.value = cellIndex;
    } else {
      cell.isWrong = true;
      cell.isCorrect = false;
      cell.hasError = true;
    }
  };

  const togglePause = (): void => {
    gameState.isPaused = !gameState.isPaused;

    if (gameState.isPaused) {
      pauseTimer();
    } else {
      resumeTimer();
    }
  };

  const handleVisibilityChange = (): void => {
    if (gameState.gameComplete) return;

    if (document.hidden) {
      if (!gameState.isPaused) {
        gameState.isPaused = true;
        pauseTimer();
      }
    } else {
      if (gameState.isPaused) {
        gameState.isPaused = false;
        resumeTimer();
      }
    }
  };

  const generateNewGame = (difficulty?: Difficulty): void => {
    if (difficulty) {
      gameState.difficulty = difficulty;
    }

    const { puzzle, solution } = SudokuGenerator.generatePuzzle(gameState.difficulty);

    gameState.grid = puzzle.map((value) => createSudokuCell(value));
    gameState.solution = solution;
    gameState.selectedCell = null;
    gameState.score = 0;
    gameState.hintsUsed = 0;
    gameState.errorCount = 0;
    gameState.gameComplete = false;
    gameState.finalScore = 0;
    gameState.isPaused = false;

    completedAnimations.rows = [];
    completedAnimations.cols = [];
    completedAnimations.boxes = [];
    permanentlyCompleted.rows.clear();
    permanentlyCompleted.cols.clear();
    permanentlyCompleted.boxes.clear();
    lastCorrectInputCell.value = null;

    startTimer();
  };

  const selectCell = (index: number): void => {
    if (gameState.grid[index].prefilled || gameState.gameComplete || gameState.isPaused) return;
    gameState.selectedCell = index;
  };

  const inputNumber = (num: number): void => {
    if (gameState.selectedCell === null || gameState.gameComplete || gameState.isPaused) return;

    const cellIndex = gameState.selectedCell;
    const cell = gameState.grid[cellIndex];
    if (cell.prefilled) return;

    const oldValue = cell.value;
    const correctValue = gameState.solution[cellIndex];

    cell.value = num;

    const isCorrect = num === correctValue;

    if (isCorrect) {
      setCellFeedback(cellIndex, true);

      if (oldValue === null) {
        gameState.score = calculateScore(gameState.score, 'correct');
      }

      checkCompletions();
      checkGameComplete();

    } else {
      setCellFeedback(cellIndex, false);

      gameState.errorCount++;
      gameState.score = calculateScore(gameState.score, 'error');
    }
  };

  const clearCell = (): void => {
    if (gameState.selectedCell === null || gameState.gameComplete || gameState.isPaused) return;

    const cell = gameState.grid[gameState.selectedCell];
    if (!cell.prefilled) {
      cell.value = null;
      cell.hasError = false;
      cell.isCorrect = false;
      cell.isWrong = false;

      if (lastCorrectInputCell.value === gameState.selectedCell) {
        lastCorrectInputCell.value = null;
      }
    }
  };

  const useHint = (): void => {
    if (gameState.hintsUsed >= GAME_CONSTANTS.MAX_HINTS || gameState.gameComplete || gameState.isPaused) return;

    const emptyCells = gameState.grid
      .map((cell, index) => ({ cell, index }))
      .filter(({ cell }) => !cell.prefilled && cell.value === null);

    if (emptyCells.length === 0) return;

    const randomEmptyCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const hintIndex = randomEmptyCell.index;

    const cell = gameState.grid[hintIndex];
    cell.value = gameState.solution[hintIndex];

    setCellFeedback(hintIndex, true);

    const hintCost = getNextHintCost(gameState.hintsUsed);
    gameState.score = calculateScore(gameState.score, 'hint', hintCost);
    gameState.hintsUsed++;

    checkCompletions();
    checkGameComplete();
  };

  const checkCompletions = (): void => {
    for (let row = 0; row < GAME_CONSTANTS.GRID_SIZE; row++) {
      if (!permanentlyCompleted.rows.has(row) &&
          SudokuValidator.isRowComplete(gameState.grid, row)) {
        permanentlyCompleted.rows.add(row);
        completedAnimations.rows.push(row);

        setTimeout(() => {
          const index = completedAnimations.rows.indexOf(row);
          if (index > -1) completedAnimations.rows.splice(index, 1);
        }, 1000);
      }
    }

    for (let col = 0; col < GAME_CONSTANTS.GRID_SIZE; col++) {
      if (!permanentlyCompleted.cols.has(col) &&
          SudokuValidator.isColumnComplete(gameState.grid, col)) {
        permanentlyCompleted.cols.add(col);
        completedAnimations.cols.push(col);

        setTimeout(() => {
          const index = completedAnimations.cols.indexOf(col);
          if (index > -1) completedAnimations.cols.splice(index, 1);
        }, 1000);
      }
    }

    for (let box = 0; box < GAME_CONSTANTS.GRID_SIZE; box++) {
      if (!permanentlyCompleted.boxes.has(box) &&
          SudokuValidator.isBoxComplete(gameState.grid, box)) {
        permanentlyCompleted.boxes.add(box);
        completedAnimations.boxes.push(box);

        setTimeout(() => {
          const index = completedAnimations.boxes.indexOf(box);
          if (index > -1) completedAnimations.boxes.splice(index, 1);
        }, 1000);
      }
    }
  };


const checkGameComplete = (): void => {
  if (SudokuValidator.isGameComplete(gameState.grid)) {
    gameState.gameComplete = true;
    gameState.completionTime = elapsedTime.value;

    gameState.finalScore = calculateFinalScore(
      gameState.score,
      gameState.completionTime
    );

    stopTimer();

    // Only show dialog if score is in top 3 for current difficulty
    const topRecords = getTopRecords(gameState.difficulty);
    if (
      topRecords.length < 3 ||
      gameState.finalScore > topRecords[topRecords.length - 1].score
    ) {
      showNameInput({
        score: gameState.finalScore,
        time: gameState.completionTime,
        difficulty: gameState.difficulty,
        timestamp: Date.now()
      });
    }
  }
};


  const getBoxIndex = (cellIndex: number): number => {
    return SudokuValidator.getBoxIndex(cellIndex);
  };

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  return {
    gameState,
    completedAnimations,
    elapsedTime,
    selectedCell,
    isGameComplete,
    generateNewGame,
    selectCell,
    inputNumber,
    useHint,
    clearCell,
    togglePause,
    getBoxIndex,
    getNextHintCost: () => getNextHintCost(gameState.hintsUsed)
  };
}
