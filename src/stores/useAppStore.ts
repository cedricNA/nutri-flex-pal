
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dataService } from '../services/dataService';
import { UserProfileSchema, WeightEntrySchema, CalorieEntrySchema, type UserProfile, type WeightEntry, type CalorieEntry } from '../schemas';

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

// Helper to initialize state from validated localStorage
function loadInitialState(): Pick<AppState, "user" | "weightEntries" | "calorieEntries" | "currentPeriod"> {
  // Use dataService for schema-mapped keys, direct localStorage for currentPeriod
  return {
    user: dataService.get<UserProfile | null>("user", null),
    weightEntries: dataService.get<WeightEntry[]>("weightEntries", []),
    calorieEntries: dataService.get<CalorieEntry[]>("calorieEntries", []),
    currentPeriod: (localStorage.getItem('currentPeriod') as AppState["currentPeriod"]) || "7d",
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      ...loadInitialState(),

      // Actions
      setUser: (user) => {
        const validated = UserProfileSchema.parse(user);
        dataService.set('user', validated);
        set({ user: validated });
      },

      updateUserGoals: (goals) => set((state) => {
        if (!state.user) return state;
        const newGoals = { ...state.user.goals, ...goals };
        const newUser = { ...state.user, goals: newGoals };
        const validated = UserProfileSchema.parse(newUser);
        dataService.set('user', validated);
        return { user: validated };
      }),

      addWeightEntry: (weight, date = new Date()) => set((state) => {
        const entry: WeightEntry = WeightEntrySchema.parse({
          id: `weight_${Date.now()}`,
          date,
          weight
        });
        const newEntries = [...state.weightEntries, entry];
        dataService.set('weightEntries', newEntries);
        return { weightEntries: newEntries };
      }),

      addCalorieEntry: (consumed, target, date = new Date()) => set((state) => {
        const entry: CalorieEntry = CalorieEntrySchema.parse({
          id: `calorie_${Date.now()}`,
          date,
          consumed,
          target
        });
        const newEntries = [...state.calorieEntries, entry];
        dataService.set('calorieEntries', newEntries);
        return { calorieEntries: newEntries };
      }),

      setPeriod: (period) => {
        localStorage.setItem('currentPeriod', period);
        set({ currentPeriod: period });
      },

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
