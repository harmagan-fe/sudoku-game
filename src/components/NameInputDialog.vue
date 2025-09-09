<template>
  <div class="name-dialog-overlay">
    <div class="name-dialog">
      <h3>Congratulations!</h3>
      <p>You made it to the high scores!</p>
      <p>Enter your name:</p>

      <input
        v-model="playerName"
        type="text"
        placeholder="Your name"
        maxlength="20"
        class="name-input"
        @keyup.enter="submit"
        ref="nameInputRef"
      />

      <div class="dialog-buttons">
        <button @click="submit" class="submit-btn">Save Score</button>
        <button @click="cancel" class="cancel-btn">Skip</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Emits {
  (e: 'submit', name: string): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const playerName = ref('')
const nameInputRef = ref<HTMLInputElement>()

const submit = (): void => {
  emit('submit', playerName.value.trim() || 'Anonymous')
}

const cancel = (): void => {
  emit('cancel')
}

onMounted(() => {
  setTimeout(() => {
    nameInputRef.value?.focus()
  }, 100)
})
</script>

<style scoped>
.name-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.name-dialog {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.name-dialog h3 {
  color: #2e7d32;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.name-dialog p {
  margin-bottom: 15px;
  color: #666;
}

.name-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 20px;
  text-align: center;
}

.name-input:focus {
  outline: none;
  border-color: #4caf50;
}

.dialog-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.submit-btn,
.cancel-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.submit-btn {
  background: #4caf50;
  color: white;
}

.submit-btn:hover {
  background: #45a049;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.cancel-btn:hover {
  background: #e0e0e0;
}
</style>
