import { ref, onUnmounted } from 'vue'

export function useTimer() {
  const elapsedTime = ref(0)
  let timerInterval: ReturnType<typeof setInterval> | null = null

  const startTimer = (): void => {
    elapsedTime.value = 0
    if (timerInterval) clearInterval(timerInterval)
    timerInterval = setInterval(() => {
      elapsedTime.value++
    }, 1000)
  }

  const stopTimer = (): void => {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  const pauseTimer = (): void => {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  const resumeTimer = (): void => {
    if (!timerInterval) {
      timerInterval = setInterval(() => {
        elapsedTime.value++
      }, 1000)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  onUnmounted(() => {
    stopTimer()
  })

  return {
    elapsedTime,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    formatTime,
  }
}
