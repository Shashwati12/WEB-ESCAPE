// zustand.js
import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  // Current level
  currentLevel: 0,

  // Completion status of each level
  levelStatus: Array(10).fill(false), // true = completed

  // Overall score
  score: 0,

  // Total time in seconds
  timer: 0,

  // Answer storage for logic levels
  answers: {
    level5: {},  // Pattern Breaker
    level7: '',  // Guess the Liar
    level8: '',  // Woordle
    level9: '',  // Output Predictor
    level10: {
      morse: '',
      binary: '',
      emoji: '',
      logic: '',
    }
  },

  // ---- GAME CONTROLS ---- //

  // Set current level
  setCurrentLevel: (level) => set({ currentLevel: level }),

  // Mark a level as completed
  completeLevel: (level) => {
    const updated = [...get().levelStatus];
    updated[level] = true;
    set({ levelStatus: updated });
  },

  // Save answers
  setAnswer: (key, value) => {
    const current = get().answers;

    if (key.startsWith('level10')) {
      set({
        answers: {
          ...current,
          level10: {
            ...current.level10,
            [key.split('.')[1]]: value,
          },
        },
      });
    } else {
      set({
        answers: {
          ...current,
          [key]: value,
        },
      });
    }
  },

  // Update score (e.g., +10 or -5)
  updateScore: (points) => {
    set((state) => ({ score: state.score + points }));
  },

  // Update timer (called every second ideally)
  updateTimer: () => {
    set((state) => ({ timer: state.timer + 1 }));
  },

  // Reset everything
  resetGame: () => {
    set({
      currentLevel: 0,
      levelStatus: Array(10).fill(false),
      score: 0,
      timer: 0,
      answers: {
        level5: {},
        level7: '',
        level8: '',
        level9: '',
        level10: {
          morse: '',
          binary: '',
          emoji: '',
          logic: '',
        },
      },
    });
  }
}));

export default useGameStore;


/* Example usage of zustand in games

import useGameStore from './zustand';

// In a timer component
useEffect(() => {
  const interval = setInterval(() => {
    useGameStore.getState().updateTimer();
  }, 1000);

  return () => clearInterval(interval);
}, []);

*/