
import supabase from '@/lib/supabase';
import type { Database, PlannedMealFood } from '@/types/supabase';

type NutritionPlan = Database['public']['Tables']['nutrition_plans']['Row'];
type PlannedMeal = Database['public']['Tables']['planned_meals']['Row'];
type ActivityEntry = Database['public']['Tables']['activity_entries']['Row'];
type SleepEntry = Database['public']['Tables']['sleep_entries']['Row'];

export const nutritionPlanService = {
  async getUserPlans(userId: string): Promise<NutritionPlan[]> {
    const { data, error } = await supabase
      .from('nutrition_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching nutrition plans:', error);
      return [];
    }
    return data || [];
  },

  async getActivePlan(userId: string): Promise<NutritionPlan | null> {
    const { data, error } = await supabase
      .from('nutrition_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching active plan:', error);
      return null;
    }
    return data;
  },

  async createPlan(userId: string, plan: Omit<NutritionPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { error } = await supabase
      .from('nutrition_plans')
      .insert({
        user_id: userId,
        ...plan
      });
    
    if (error) {
      console.error('Error creating nutrition plan:', error);
      throw error;
    }
  },

  async updatePlan(planId: string, updates: Partial<NutritionPlan>) {
    const { error } = await supabase
      .from('nutrition_plans')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', planId);
    
    if (error) {
      console.error('Error updating nutrition plan:', error);
      throw error;
    }
  },

  async activatePlan(userId: string, planId: string) {
    // Désactiver tous les plans existants
    await supabase
      .from('nutrition_plans')
      .update({ is_active: false })
      .eq('user_id', userId);
    
    // Activer le plan sélectionné
    const { error } = await supabase
      .from('nutrition_plans')
      .update({ is_active: true })
      .eq('id', planId);
    
    if (error) {
      console.error('Error activating plan:', error);
      throw error;
    }
  },

  async deletePlan(planId: string) {
    const { error } = await supabase
      .from('nutrition_plans')
      .delete()
      .eq('id', planId);
    
    if (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  }
};

export const plannedMealService = {
  async getPlannedMeals(planId: string): Promise<(PlannedMeal & { foods: Array<PlannedMealFood & { food: any }> })[]> {
    const { data: meals, error } = await supabase
      .from('planned_meals')
      .select('*')
      .eq('plan_id', planId)
      .order('meal_order');

    if (error) {
      console.error('Error fetching planned meals:', error);
      return [];
    }

    if (!meals || meals.length === 0) {
      return [];
    }

    const { data: mealFoods, error: foodsError } = await supabase
      .from('planned_meal_foods')
      .select('*, foods:foods_clean(id,name:name_fr,calories:kcal,protein:protein_g,carbs:carb_g,fat:fat_g)')
      .in('planned_meal_id', meals.map((m) => m.id));

    if (foodsError) {
      console.error('Error fetching planned meal foods:', foodsError);
    }

    const foodsByMeal: Record<string, any[]> = {};
    (mealFoods || []).forEach((food: any) => {
      const mealId = food.planned_meal_id;
      if (!foodsByMeal[mealId]) {
        foodsByMeal[mealId] = [];
      }
      foodsByMeal[mealId].push({
        ...food,
        food: food.foods,
      });
    });

    return meals.map((meal) => ({
      ...meal,
      foods: foodsByMeal[meal.id] || [],
    }));
  },

  async createPlannedMeal(planId: string, meal: Omit<PlannedMeal, 'id' | 'plan_id' | 'created_at'>) {
    const { error } = await supabase
      .from('planned_meals')
      .insert({
        plan_id: planId,
        ...meal
      });
    
    if (error) {
      console.error('Error creating planned meal:', error);
      throw error;
    }
  },

  async addFoodToMeal(
    plannedMealId: string,
    foodId: number,
    quantity: number,
    targetDate?: string
  ) {
    const { error } = await supabase
      .from('planned_meal_foods')
      .insert({
        planned_meal_id: plannedMealId,
        food_id: foodId,
        grams: quantity,
        target_date: targetDate,
      });

    if (error) {
      console.error('Error adding food to meal:', error);
      throw error;
    }
  }
};

export const activityService = {
  async getActivityEntries(userId: string, startDate?: Date, endDate?: Date): Promise<ActivityEntry[]> {
    let query = supabase
      .from('activity_entries')
      .select('*')
      .eq('user_id', userId);

    if (startDate) {
      query = query.gte('date', startDate.toISOString().split('T')[0]);
    }
    if (endDate) {
      query = query.lte('date', endDate.toISOString().split('T')[0]);
    }

    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching activity entries:', error);
      return [];
    }
    return data || [];
  },

  async addActivityEntry(userId: string, activity: Omit<ActivityEntry, 'id' | 'user_id' | 'created_at'>) {
    const { error } = await supabase
      .from('activity_entries')
      .insert({
        user_id: userId,
        ...activity
      });
    
    if (error) {
      console.error('Error adding activity entry:', error);
      throw error;
    }
  }
};

export const sleepService = {
  async getSleepEntries(userId: string, startDate?: Date, endDate?: Date): Promise<SleepEntry[]> {
    let query = supabase
      .from('sleep_entries')
      .select('*')
      .eq('user_id', userId);

    if (startDate) {
      query = query.gte('date', startDate.toISOString().split('T')[0]);
    }
    if (endDate) {
      query = query.lte('date', endDate.toISOString().split('T')[0]);
    }

    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching sleep entries:', error);
      return [];
    }
    return data || [];
  },

  async addSleepEntry(userId: string, sleep: Omit<SleepEntry, 'id' | 'user_id' | 'created_at'>) {
    const { error } = await supabase
      .from('sleep_entries')
      .insert({
        user_id: userId,
        ...sleep
      });
    
    if (error) {
      console.error('Error adding sleep entry:', error);
      throw error;
    }
  }
};
