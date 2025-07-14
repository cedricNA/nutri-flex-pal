import supabase from '@/lib/supabase';
import type { Database } from '@/types/supabase';

// Database row types
type ConsumedMealFood = Database['public']['Tables']['consumed_meal_foods']['Row'];
type FoodClean = Database['public']['Views']['foods_clean']['Row'];
type MealType = Database['public']['Tables']['meal_types']['Row'];
type DailySummary = Database['public']['Views']['daily_nutrition_summary']['Row'];

export interface ConsumedMealEnriched {
  id: string;
  user_id: string;
  eaten_at: string;
  meal_type: string;
  sort_order: number;
  name_fr: string;
  quantity_grams: number;
  kcal: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
}

export const foodJournalService = {
  async getTodayMeals(userId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('consumed_meal_foods')
      .select(
        `*,
        food:foods_clean (*),
        meal_type:meal_types (*)
      `
      )
      .eq('user_id', userId)
      .gte('consumed_at', startOfDay.toISOString())
      .lte('consumed_at', endOfDay.toISOString())
      .order('consumed_at', { ascending: false });

    if (error) {
      console.error('Error fetching today meals:', error);
      return [] as (ConsumedMealFood & { food: FoodClean; meal_type: MealType })[];
    }
    return (data || []) as (ConsumedMealFood & {
      food: FoodClean;
      meal_type: MealType;
    })[];
  },

  async getDailySummary(userId: string, date: Date) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('daily_nutrition_summary')
      .select('*')
      .eq('user_id', userId)
      .eq('summary_date', targetDate.toISOString().split('T')[0])
      .maybeSingle();

    if (error) {
      console.error('Error fetching daily summary:', error);
      return null as DailySummary | null;
    }

    return data as DailySummary | null;
  },

  async getTodayEnrichedMeals(userId: string): Promise<ConsumedMealEnriched[]> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('consumed_meals_enriched')
      .select('*, sort_order')
      .eq('user_id', userId)
      .gte('eaten_at', startOfDay.toISOString())
      .lte('eaten_at', endOfDay.toISOString())
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching enriched meals:', error);
      return [];
    }

    return (data || []) as ConsumedMealEnriched[];
  }
};
