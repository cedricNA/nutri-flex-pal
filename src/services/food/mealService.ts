
import supabase from '@/lib/supabase';

export class MealService {
  async addMealEntry(
    userId: string,
    foodId: number,
    grams: number,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('meal_entries')
        .insert({
          user_id: userId,
          food_id: foodId,
          grams,
          meal_type: mealType,
          eaten_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error adding meal entry:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in addMealEntry:', error);
      return false;
    }
  }
}

export const mealService = new MealService();
