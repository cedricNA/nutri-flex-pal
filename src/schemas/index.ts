
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

export const NotificationDataSchema = z.object({
  id: z.string(),
  type: z.enum(['meal', 'hydration', 'achievement', 'reminder', 'info']),
  title: z.string(),
  message: z.string(),
  timestamp: z.coerce.date(),
  read: z.boolean(),
  actionUrl: z.string().optional(),
});
export type NotificationData = z.infer<typeof NotificationDataSchema>;

export const AppSettingsSchema = z.object({
  // Notifications
  mealReminders: z.boolean().default(true),
  hydrationReminders: z.boolean().default(true),
  weeklyReports: z.boolean().default(true),
  emailNotifications: z.boolean().default(false),
  pushNotifications: z.boolean().default(true),
  
  // Apparence
  darkMode: z.boolean().default(false),
  compactView: z.boolean().default(false),
  animations: z.boolean().default(true),
  
  // Confidentialité
  profilePublic: z.boolean().default(false),
  shareProgress: z.boolean().default(true),
  analyticsOptIn: z.boolean().default(true),
  
  // Langue et région
  language: z.string().default('fr'),
  timezone: z.string().default('Europe/Paris'),
  units: z.string().default('metric'),
});
export type AppSettings = z.infer<typeof AppSettingsSchema>;
