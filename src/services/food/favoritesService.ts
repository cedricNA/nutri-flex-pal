
import supabase from '@/lib/supabase';
import { Food, ExtendedFood } from '@/types/food';

export class FavoritesService {
  async getUserFavorites(userId: string): Promise<number[]> {
    try {
      const { data: favorites, error } = await supabase
        .from('user_food_favorites')
        .select('food_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error loading favorites:', error);
        return [];
      }

      return favorites?.map(fav => fav.food_id) || [];
    } catch (error) {
      console.error('Error in getUserFavorites:', error);
      return [];
    }
  }

  async addFoodsWithFavorites(foods: Food[], userId?: string): Promise<ExtendedFood[]> {
    if (!userId) {
      return foods.map(food => ({ ...food, isFavorite: false }));
    }

    const favoriteIds = await this.getUserFavorites(userId);
    const favoriteSet = new Set(favoriteIds);
    
    return foods.map(food => ({
      ...food,
      isFavorite: favoriteSet.has(food.id)
    }));
  }

  async toggleFavorite(foodId: number, userId: string): Promise<boolean> {
    try {
      // Check if favorite already exists
      const { data: existing, error: checkError } = await supabase
        .from('user_food_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('food_id', foodId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking favorite:', checkError);
        return false;
      }

      if (existing) {
        // Remove favorite
        const { error: deleteError } = await supabase
          .from('user_food_favorites')
          .delete()
          .eq('user_id', userId)
          .eq('food_id', foodId);

        if (deleteError) {
          console.error('Error removing favorite:', deleteError);
          return false;
        }
        return false; // Not favorite anymore
      } else {
        // Add favorite
        const { error: insertError } = await supabase
          .from('user_food_favorites')
          .insert({ user_id: userId, food_id: foodId });

        if (insertError) {
          console.error('Error adding favorite:', insertError);
          return false;
        }
        return true; // Now favorite
      }
    } catch (error) {
      console.error('Error in toggleFavorite:', error);
      return false;
    }
  }
}

export const favoritesService = new FavoritesService();
