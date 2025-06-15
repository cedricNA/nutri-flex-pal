
import { storageService } from './storageService';
import {
  type UserProfile,
  type WeightEntry,
  type CalorieEntry,
  type MealEntry,
  type Food
} from "../schemas";

// Legacy compatibility layer - delegates to the new storageService
export const dataService = {
  get<T extends UserProfile | null | WeightEntry[] | CalorieEntry[] | MealEntry[] | Food[]>(
    key: 'user' | 'weightEntries' | 'calorieEntries' | 'todayMeals' | 'foods',
    defaultValue: T
  ): T {
    const result = storageService.get(key);
    return result !== undefined ? result as T : defaultValue;
  },

  set<T extends UserProfile | null | WeightEntry[] | CalorieEntry[] | MealEntry[] | Food[]>(
    key: 'user' | 'weightEntries' | 'calorieEntries' | 'todayMeals' | 'foods',
    value: T
  ): void {
    storageService.set(key, value);
  },
};
