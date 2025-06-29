
import supabase from '@/lib/supabase';
import { Food, FoodInsert } from '@/types/food';

export class FoodRepository {
  async getAllFoods(): Promise<Food[]> {
    try {
      console.log('Fetching foods from Supabase...');
      
      const { data: foods, error } = await supabase
        .from('foods')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error loading foods:', error);
        return [];
      }

      if (!foods) {
        console.log('No foods returned from database');
        return [];
      }

      console.log(`Raw foods count: ${foods.length}`);
      return foods;
    } catch (error) {
      console.error('Error in getAllFoods:', error);
      return [];
    }
  }

  async addFood(food: Omit<FoodInsert, 'id' | 'created_at'>): Promise<Food | null> {
    try {
      // Validate the food data before insertion
      if (!food.name || food.name.trim() === '') {
        console.error('Food name is required');
        return null;
      }

      // Clean the food data
      const cleanedFood = {
        name: food.name.trim(),
        category: food.category,
        calories: Math.max(0, food.calories || 0),
        protein: Math.max(0, food.protein || 0),
        carbs: Math.max(0, food.carbs || 0),
        fat: Math.max(0, food.fat || 0),
        fiber: Math.max(0, food.fiber || 0),
        unit: food.unit || '100g',
        calcium: food.calcium ? Math.max(0, food.calcium) : 0,
        iron: food.iron ? Math.max(0, food.iron) : 0,
        magnesium: food.magnesium ? Math.max(0, food.magnesium) : 0,
        potassium: food.potassium ? Math.max(0, food.potassium) : 0,
        sodium: food.sodium ? Math.max(0, food.sodium) : 0,
        vitamin_c: food.vitamin_c ? Math.max(0, food.vitamin_c) : 0,
        vitamin_d: food.vitamin_d ? Math.max(0, food.vitamin_d) : 0,
        salt: food.salt ? Math.max(0, food.salt) : 0
      };

      const { data, error } = await supabase
        .from('foods')
        .insert(cleanedFood)
        .select()
        .single();

      if (error) {
        console.error('Error adding food:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in addFood:', error);
      return null;
    }
  }

  async cleanCorruptedData(): Promise<boolean> {
    try {
      console.log('Cleaning corrupted data...');
      
      // Delete entries with corrupted names
      const { error } = await supabase
        .from('foods')
        .delete()
        .or(
          'name.like.*:::*,' +
          'name.like.%:%,' +
          'name.eq.,' +
          'name.is.null'
        );

      if (error) {
        console.error('Error cleaning corrupted data:', error);
        return false;
      }

      console.log('Corrupted data cleaned successfully');
      return true;
    } catch (error) {
      console.error('Error in cleanCorruptedData:', error);
      return false;
    }
  }
}

export const foodRepository = new FoodRepository();
