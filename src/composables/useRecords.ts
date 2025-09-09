// composables/useRecords.ts
import { ref } from 'vue';
import type { Records, GameRecord, Difficulty } from '../types';

const STORAGE_KEY = 'sudoku-records';

// Singleton state
const records = ref<Records>(loadRecords());
const showNameDialog = ref(false);
const pendingRecord = ref<GameRecord | null>(null);

function loadRecords(): Records {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      beginner: [],
      intermediate: [],
      hard: [],
      expert: []
    };
  } catch {
    return {
      beginner: [],
      intermediate: [],
      hard: [],
      expert: []
    };
  }
}

function saveRecord(record: GameRecord) {
  const difficultyRecords = records.value[record.difficulty];
  difficultyRecords.push(record);
  difficultyRecords.sort((a, b) => b.score - a.score);
  records.value[record.difficulty] = difficultyRecords.slice(0, 3);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records.value));
}

function showNameInput(recordData: Omit<GameRecord, 'playerName'>) {
  pendingRecord.value = { ...recordData, playerName: '' };
  showNameDialog.value = true;
}

function submitName(name: string) {
  if (pendingRecord.value) {
    saveRecord({ ...pendingRecord.value, playerName: name.trim() || 'Anonymous' });
    pendingRecord.value = null;
  }
  showNameDialog.value = false;
}

function cancelNameInput() {
  if (pendingRecord.value) {
    saveRecord({ ...pendingRecord.value, playerName: 'Anonymous' });
    pendingRecord.value = null;
  }
  showNameDialog.value = false;
}

function getTopRecords(difficulty: Difficulty) {
  return records.value[difficulty] || [];
}

export function useRecords() {
  return {
    records,
    showNameDialog,
    pendingRecord,
    showNameInput,
    submitName,
    cancelNameInput,
    saveRecord,
    getTopRecords
  };
}
