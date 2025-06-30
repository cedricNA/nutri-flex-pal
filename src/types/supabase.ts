import type { Database as GeneratedDatabase } from '@/integrations/supabase/types'

export type Database = GeneratedDatabase

export interface FoodClean {
  id: number
  name_fr: string
  group_fr: string
  kcal: number
  protein_g: number
  carb_g: number
  fat_g: number
  sugars_g: number
  fiber_g: number
  sat_fat_g: number
  salt_g: number
}

export interface MealEntry {
  id: string
  user_id: string
  food_id: number
  grams: number
  eaten_at: string
}

export interface Favorite {
  id: string
  user_id: string
  food_id: number
  created_at: string
}

export interface PlannedMeal {
  id: string
  user_id: string
  food_id: number
  target_date: string
  grams: number
}

export interface PlannedMealFood {
  id: string
  planned_meal_id: string
  user_id: string
  food_id: number
  grams: number
  target_date: string
  created_at: string
}
