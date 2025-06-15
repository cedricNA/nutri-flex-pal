
import {
  UserProfileSchema,
  WeightEntrySchema,
  CalorieEntrySchema,
  MealEntrySchema,
  FoodSchema,
  type UserProfile,
  type WeightEntry,
  type CalorieEntry,
  type MealEntry,
  type Food
} from "../schemas";
import { z } from "zod";

type SchemaMap = {
  user: typeof UserProfileSchema,
  weightEntries: z.ZodArray<typeof WeightEntrySchema>,
  calorieEntries: z.ZodArray<typeof CalorieEntrySchema>,
  todayMeals: z.ZodArray<typeof MealEntrySchema>,
  foods: z.ZodArray<typeof FoodSchema>,
};

const schemaMap: Record<string, z.ZodTypeAny> = {
  user: UserProfileSchema,
  weightEntries: z.array(WeightEntrySchema),
  calorieEntries: z.array(CalorieEntrySchema),
  todayMeals: z.array(MealEntrySchema),
  foods: z.array(FoodSchema),
};

// Helper for parse with fallback to default when invalid.
export function safeParse<T>(schema: z.ZodType<T>, data: unknown, fallback: T): T {
  const res = schema.safeParse(data);
  if (res.success) return res.data;
  return fallback;
}

export const dataService = {
  get<T>(key: keyof SchemaMap, defaultValue: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return defaultValue;
      const parsed = JSON.parse(raw);
      return safeParse(schemaMap[key], parsed, defaultValue);
    } catch {
      return defaultValue;
    }
  },
  set<T>(key: keyof SchemaMap, value: T): void {
    // Validate before write!
    const validated = safeParse(schemaMap[key], value, value);
    localStorage.setItem(key, JSON.stringify(validated));
  },
  // Additional helpers to migrate data, wipe, etc. as needed.
};
