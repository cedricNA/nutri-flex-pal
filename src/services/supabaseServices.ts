import supabase from '@/lib/supabase';
import type { Database } from '@/types/supabase';

// Type definitions from the database
type Profile = Database['public']['Tables']['profiles']['Row'];
type WeightEntry = Database['public']['Tables']['weight_entries']['Row'];
type CalorieEntry = Database['public']['Tables']['calorie_entries']['Row'];
type MealEntry = Database['public']['Tables']['meal_entries']['Row'];
type Food = Database['public']['Tables']['foods']['Row'];
import type { FoodClean } from '@/types/supabase';
type HydrationEntry = Database['public']['Tables']['hydration_entries']['Row'];
type UserSettings = Database['public']['Tables']['user_settings']['Row'];

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};

export const weightService = {
  async getWeightEntries(userId: string): Promise<WeightEntry[]> {
    const { data, error } = await supabase
      .from('weight_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching weight entries:', error);
      return [];
    }
    return data || [];
  },

  async addWeightEntry(userId: string, weight: number, date?: Date) {
    const { error } = await supabase
      .from('weight_entries')
      .insert({
        user_id: userId,
        weight,
        date: date?.toISOString() || new Date().toISOString()
      });

    if (error) {
      console.error('Error adding weight entry:', error);
      throw error;
    }

    const activeGoal = await goalService.getActiveGoalByType(userId, 'weight_loss');
    if (activeGoal) {
      try {
        await goalService.setGoalCurrentValue(activeGoal.id, weight);
      } catch (goalError) {
        console.error('Error updating weight goal:', goalError);
      }
    }
  }
};

export const calorieService = {
  async getCalorieEntries(userId: string): Promise<CalorieEntry[]> {
    const { data, error } = await supabase
      .from('calorie_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching calorie entries:', error);
      return [];
    }
    return data || [];
  },

  async addCalorieEntry(userId: string, consumed: number, target: number, date?: Date) {
    const { error } = await supabase
      .from('calorie_entries')
      .insert({
        user_id: userId,
        consumed,
        target,
        date: date?.toISOString() || new Date().toISOString()
      });
    
    if (error) {
      console.error('Error adding calorie entry:', error);
      throw error;
    }
  }
};

export const foodService = {
  async getFoods(): Promise<Food[]> {
    const { data, error } = await supabase
      .from('foods_clean')
      .select('*')
      .order('name_fr');

    if (error) {
      console.error('Error fetching foods:', error);
      return [];
    }
    return (data as FoodClean[]).map(f => ({
      id: String(f.id),
      name: f.name_fr,
      category: f.group_fr,
      calories: f.kcal,
      protein: f.protein_g,
      carbs: f.carb_g,
      fat: f.fat_g,
      fiber: f.fiber_g,
      salt: f.salt_g,
      unit: 'g',
      image: null,
      created_at: null,
      calcium: null,
      iron: null,
      magnesium: null,
      potassium: null,
      sodium: null,
      vitamin_c: null,
      vitamin_d: null,
    }));
  },

  async getUserFavorites(userId: string): Promise<number[]> {
    const { data, error } = await supabase
      .from('user_food_favorites')
      .select('food_id')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
    return data?.map(f => f.food_id) || [];
  },

  async toggleFavorite(userId: string, foodId: number) {
    // Check if already favorite
    const { data: existing } = await supabase
      .from('user_food_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('food_id', foodId)
      .maybeSingle();

    if (existing) {
      // Remove favorite
      const { error } = await supabase
        .from('user_food_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('food_id', foodId);
      
      if (error) throw error;
    } else {
      // Add favorite
      const { error } = await supabase
        .from('user_food_favorites')
        .insert({ user_id: userId, food_id: foodId });
      
      if (error) throw error;
    }
  }
};

export const mealService = {
  async getMealEntries(userId: string, date?: Date): Promise<MealEntry[]> {
    let query = supabase
      .from('meal_entries')
      .select(`
        *,
        foods:foods_clean (*)
      `)
      .eq('user_id', userId);

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query = query
        .gte('eaten_at', startOfDay.toISOString())
        .lte('eaten_at', endOfDay.toISOString());
    }

    const { data, error } = await query.order('eaten_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching meal entries:', error);
      return [];
    }
    return data || [];
  },

  async addMealEntry(
    userId: string,
    foodId: number,
    grams: number,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    eatenAt?: Date
  ) {
    const { error } = await supabase
      .from('meal_entries')
      .insert({
        user_id: userId,
        food_id: foodId,
        grams,
        meal_type: mealType,
        eaten_at: eatenAt?.toISOString() || new Date().toISOString()
      });
    
    if (error) {
      console.error('Error adding meal entry:', error);
      throw error;
    }
  }
};

export const hydrationService = {
  async getTodayHydration(userId: string): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('hydration_entries')
      .select('glasses_count')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching hydration:', error);
      return 0;
    }
    return data?.glasses_count || 0;
  },

  async updateHydration(userId: string, glassesCount: number) {
    const today = new Date().toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('hydration_entries')
      .upsert({
        user_id: userId,
        date: today,
        glasses_count: glassesCount
      });
    
    if (error) {
      console.error('Error updating hydration:', error);
      throw error;
    }
  }
};

export const settingsService = {
  async getSettings(userId: string): Promise<UserSettings | null> {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching settings:', error);
      return null;
    }
    return data;
  },

  async updateSettings(userId: string, updates: Partial<UserSettings>) {
    const { error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
};

// Nouveaux services pour les données dynamiques
export const goalService = {
  async getUserGoals(userId: string) {
    const { data, error } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user goals:', error);
      return [];
    }
    return data || [];
  },

  async getActiveGoalByType(userId: string, goalType: string) {
    const { data, error } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('goal_type', goalType)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching active goal:', error);
      return null;
    }

    return data;
  },

  async createUserGoal(userId: string, goal: any) {
    const { error } = await supabase
      .from('user_goals')
      .insert({
        user_id: userId,
        ...goal,
        // Ensure newly created goals start without progress
        current_value: 0
      });
    
    if (error) {
      console.error('Error creating user goal:', error);
      throw error;
    }
  },

  async updateUserGoal(goalId: string, updates: any) {
    const { error } = await supabase
      .from('user_goals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', goalId);
    
    if (error) {
      console.error('Error updating user goal:', error);
      throw error;
    }
  },

  async setGoalCurrentValue(goalId: string, value: number) {
    const { error } = await supabase
      .from('user_goals')
      .update({ current_value: value, updated_at: new Date().toISOString() })
      .eq('id', goalId);

    if (error) {
      console.error('Error updating goal current value:', error);
      throw error;
    }
  },

  async deleteUserGoal(goalId: string) {
    const { error } = await supabase
      .from('user_goals')
      .delete()
      .eq('id', goalId);
    
    if (error) {
      console.error('Error deleting user goal:', error);
      throw error;
    }
  }
};

