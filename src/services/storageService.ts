
import { z } from "zod";
import {
  UserProfileSchema,
  WeightEntrySchema,
  CalorieEntrySchema,
  MealEntrySchema,
  FoodSchema,
  NotificationDataSchema,
  AppSettingsSchema,
  type UserProfile,
  type WeightEntry,
  type CalorieEntry,
  type MealEntry,
  type Food,
  type NotificationData,
  type AppSettings
} from "../schemas";

type StorageKeys = {
  // User data
  user: UserProfile | null;
  weightEntries: WeightEntry[];
  calorieEntries: CalorieEntry[];
  
  // Food data
  todayMeals: MealEntry[];
  foods: Food[];
  
  // Notifications
  notifications: NotificationData[];
  
  // Settings
  'app-settings': AppSettings;
  
  // Simple values
  currentPeriod: '7d' | '30d' | 'custom';
  searchTerm: string;
  selectedCategory: string;
  showFavoritesOnly: boolean;
};

const schemaMap = {
  user: UserProfileSchema.nullable(),
  weightEntries: z.array(WeightEntrySchema),
  calorieEntries: z.array(CalorieEntrySchema),
  todayMeals: z.array(MealEntrySchema),
  foods: z.array(FoodSchema),
  notifications: z.array(NotificationDataSchema),
  'app-settings': AppSettingsSchema,
  currentPeriod: z.enum(['7d', '30d', 'custom']),
  searchTerm: z.string(),
  selectedCategory: z.string(),
  showFavoritesOnly: z.boolean(),
} as const;

const defaults: StorageKeys = {
  user: null,
  weightEntries: [],
  calorieEntries: [],
  todayMeals: [],
  foods: [],
  notifications: [],
  'app-settings': {
    mealReminders: true,
    hydrationReminders: true,
    weeklyReports: true,
    emailNotifications: false,
    pushNotifications: true,
    darkMode: false,
    compactView: false,
    animations: true,
    profilePublic: false,
    shareProgress: true,
    analyticsOptIn: true,
    language: 'fr',
    timezone: 'Europe/Paris',
    units: 'metric',
  },
  currentPeriod: '7d',
  searchTerm: '',
  selectedCategory: 'all',
  showFavoritesOnly: false,
};

function safeParse<K extends keyof StorageKeys>(
  key: K,
  data: unknown
): StorageKeys[K] {
  const schema = schemaMap[key];
  const defaultValue = defaults[key];
  
  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return result.data as StorageKeys[K];
    }
    console.warn(`Invalid data for key ${key}, using default:`, result.error);
    return defaultValue;
  } catch (error) {
    console.warn(`Error parsing data for key ${key}, using default:`, error);
    return defaultValue;
  }
}

export const storageService = {
  get<K extends keyof StorageKeys>(key: K): StorageKeys[K] {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return defaults[key];
      const parsed = JSON.parse(raw);
      return safeParse(key, parsed);
    } catch (error) {
      console.error(`Error reading from localStorage for key ${key}:`, error);
      return defaults[key];
    }
  },

  set<K extends keyof StorageKeys>(key: K, value: StorageKeys[K]): void {
    try {
      // Validate before writing
      const validated = safeParse(key, value);
      localStorage.setItem(key, JSON.stringify(validated));
    } catch (error) {
      console.error(`Error writing to localStorage for key ${key}:`, error);
    }
  },

  remove(key: keyof StorageKeys): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage for key ${key}:`, error);
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Utility to migrate old data if needed
  migrate(): void {
    // This can be extended for future migrations
    console.log('Storage migration completed');
  }
};
