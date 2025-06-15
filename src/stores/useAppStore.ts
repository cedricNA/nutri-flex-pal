
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goals: {
    weightTarget: number;
    dailyCalories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface WeightEntry {
  id: string;
  date: Date;
  weight: number;
}

interface CalorieEntry {
  id: string;
  date: Date;
  consumed: number;
  target: number;
}

interface AppState {
  // User data
  user: UserProfile | null;
  
  // Progress data
  weightEntries: WeightEntry[];
  calorieEntries: CalorieEntry[];
  currentPeriod: '7d' | '30d' | 'custom';
  
  // Actions
  setUser: (user: UserProfile) => void;
  updateUserGoals: (goals: Partial<UserProfile['goals']>) => void;
  addWeightEntry: (weight: number, date?: Date) => void;
  addCalorieEntry: (consumed: number, target: number, date?: Date) => void;
  setPeriod: (period: '7d' | '30d' | 'custom') => void;
  getFilteredWeightData: () => WeightEntry[];
  getFilteredCalorieData: () => CalorieEntry[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      weightEntries: [],
      calorieEntries: [],
      currentPeriod: '7d',

      // Actions
      setUser: (user) => set({ user }),
      
      updateUserGoals: (goals) => set((state) => ({
        user: state.user ? { ...state.user, goals: { ...state.user.goals, ...goals } } : null
      })),

      addWeightEntry: (weight, date = new Date()) => set((state) => ({
        weightEntries: [...state.weightEntries, {
          id: `weight_${Date.now()}`,
          date,
          weight
        }]
      })),

      addCalorieEntry: (consumed, target, date = new Date()) => set((state) => ({
        calorieEntries: [...state.calorieEntries, {
          id: `calorie_${Date.now()}`,
          date,
          consumed,
          target
        }]
      })),

      setPeriod: (period) => set({ currentPeriod: period }),

      getFilteredWeightData: () => {
        const { weightEntries, currentPeriod } = get();
        const now = new Date();
        let cutoffDate = new Date();

        switch (currentPeriod) {
          case '7d':
            cutoffDate.setDate(now.getDate() - 7);
            break;
          case '30d':
            cutoffDate.setDate(now.getDate() - 30);
            break;
          default:
            return weightEntries;
        }

        return weightEntries.filter(entry => entry.date >= cutoffDate);
      },

      getFilteredCalorieData: () => {
        const { calorieEntries, currentPeriod } = get();
        const now = new Date();
        let cutoffDate = new Date();

        switch (currentPeriod) {
          case '7d':
            cutoffDate.setDate(now.getDate() - 7);
            break;
          case '30d':
            cutoffDate.setDate(now.getDate() - 30);
            break;
          default:
            return calorieEntries;
        }

        return calorieEntries.filter(entry => entry.date >= cutoffDate);
      }
    }),
    {
      name: 'nutriflex-storage',
      partialize: (state) => ({
        user: state.user,
        weightEntries: state.weightEntries,
        calorieEntries: state.calorieEntries,
        currentPeriod: state.currentPeriod
      })
    }
  )
);
