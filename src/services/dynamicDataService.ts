
import { supabase } from '@/integrations/supabase/client';

export interface CategoryMapping {
  id: string;
  ciqual_category: string;
  simplified_category: string;
}

export interface CsvColumnMapping {
  id: string;
  field_type: string;
  possible_names: string[];
}

export interface MealType {
  id: string;
  type_key: string;
  display_name: string;
  icon_name: string;
  sort_order: number;
}

export type GoalType = 'weight_loss' | 'hydration' | 'exercise' | 'calorie_deficit' | 'sleep' | 'nutrition' | 'custom';

export interface UserGoal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  unit: string;
  goal_type: GoalType;
  deadline?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class DynamicDataService {
  // Category mappings
  async getCategoryMappings(): Promise<CategoryMapping[]> {
    const { data, error } = await supabase
      .from('category_mappings')
      .select('*');
    
    if (error) {
      console.error('Error fetching category mappings:', error);
      return [];
    }
    return data || [];
  }

  async createCategoryMapping(ciqual_category: string, simplified_category: string): Promise<boolean> {
    const { error } = await supabase
      .from('category_mappings')
      .insert({ ciqual_category, simplified_category });
    
    if (error) {
      console.error('Error creating category mapping:', error);
      return false;
    }
    return true;
  }

  // CSV column mappings
  async getCsvColumnMappings(): Promise<CsvColumnMapping[]> {
    const { data, error } = await supabase
      .from('csv_column_mappings')
      .select('*');
    
    if (error) {
      console.error('Error fetching CSV column mappings:', error);
      return [];
    }
    return data || [];
  }

  async updateCsvColumnMapping(field_type: string, possible_names: string[]): Promise<boolean> {
    const { error } = await supabase
      .from('csv_column_mappings')
      .upsert({ field_type, possible_names });
    
    if (error) {
      console.error('Error updating CSV column mapping:', error);
      return false;
    }
    return true;
  }

  // Meal types
  async getMealTypes(): Promise<MealType[]> {
    const { data, error } = await supabase
      .from('meal_types')
      .select('*')
      .order('sort_order');
    
    if (error) {
      console.error('Error fetching meal types:', error);
      return [];
    }
    return data || [];
  }

  // User goals
  async getUserGoals(userId: string): Promise<UserGoal[]> {
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
    
    // Assurer la compatibilité des types
    return (data || []).map(goal => ({
      ...goal,
      goal_type: goal.goal_type as GoalType
    }));
  }

  async getCompletedUserGoals(userId: string, limit = 5): Promise<UserGoal[]> {
    const { data, error } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', false)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching completed user goals:', error);
      return [];
    }

    return (data || []).map(goal => ({
      ...goal,
      goal_type: goal.goal_type as GoalType
    }));
  }

  async createUserGoal(userId: string, goal: Omit<UserGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<boolean> {
    const { error } = await supabase
      .from('user_goals')
      .insert({
        user_id: userId,
        ...goal,
        // Start every new goal with 0 progress
        current_value: 0
      });
    
    if (error) {
      console.error('Error creating user goal:', error);
      return false;
    }
    return true;
  }

  async updateUserGoal(goalId: string, updates: Partial<UserGoal>): Promise<boolean> {
    const { error } = await supabase
      .from('user_goals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', goalId);
    
    if (error) {
      console.error('Error updating user goal:', error);
      return false;
    }
    return true;
  }

  async deleteUserGoal(goalId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_goals')
      .delete()
      .eq('id', goalId);
    
    if (error) {
      console.error('Error deleting user goal:', error);
      return false;
    }
    return true;
  }
}

export const dynamicDataService = new DynamicDataService();
