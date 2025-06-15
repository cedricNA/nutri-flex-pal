
import { z } from "zod";

export const UserGoalsSchema = z.object({
  weightTarget: z.number(),
  dailyCalories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
});

export const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().int().min(0),
  weight: z.number(),
  height: z.number(),
  activityLevel: z.enum([
    "sedentary", "light", "moderate", "active", "very_active"
  ]),
  goals: UserGoalsSchema
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const WeightEntrySchema = z.object({
  id: z.string(),
  date: z.coerce.date(),
  weight: z.number(),
});
export type WeightEntry = z.infer<typeof WeightEntrySchema>;

export const CalorieEntrySchema = z.object({
  id: z.string(),
  date: z.coerce.date(),
  consumed: z.number(),
  target: z.number(),
});
export type CalorieEntry = z.infer<typeof CalorieEntrySchema>;

export const FoodSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  fiber: z.number(),
  unit: z.string(),
  image: z.string(),
  isFavorite: z.boolean().optional(),
});
export type Food = z.infer<typeof FoodSchema>;

export const MealEntrySchema = z.object({
  id: z.string(),
  foodId: z.string(),
  quantity: z.number(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  date: z.coerce.date(),
});
export type MealEntry = z.infer<typeof MealEntrySchema>;
