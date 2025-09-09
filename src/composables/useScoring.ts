import { SCORING } from '../utils/constants'

export function useScoring() {
  const calculateScore = (
    currentScore: number,
    action: 'correct' | 'error' | 'hint',
    hintCost?: number
  ): number => {
    switch (action) {
      case 'correct':
        return currentScore + SCORING.CORRECT_CELL
      case 'error':
        return currentScore - SCORING.ERROR_PENALTY
      case 'hint':
        return currentScore - (hintCost || SCORING.INITIAL_HINT_COST)
      default:
        return currentScore
    }
  }

  const calculateFinalScore = (score: number, timeInSeconds: number): number => {
    const timeBonus = Math.max(0, SCORING.TIME_BONUS_BASE - timeInSeconds)
    return score + timeBonus
  }

  const getNextHintCost = (hintsUsed: number): number => {
    return SCORING.INITIAL_HINT_COST + hintsUsed
  }

  return {
    calculateScore,
    calculateFinalScore,
    getNextHintCost,
  }
}
