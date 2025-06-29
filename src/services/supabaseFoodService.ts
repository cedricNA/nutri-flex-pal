
import { ExtendedFood, Food, FoodInsert, Subgroup } from '@/types/food';
import { foodRepository } from './food/foodRepository';
import { favoritesService } from './food/favoritesService';
import { foodDataService } from './food/foodDataService';
import { mealService } from './food/mealService';

class SupabaseFoodService {
  
  async loadFoods(userId?: string): Promise<ExtendedFood[]> {
    try {
      console.log('Fetching foods from Supabase...');
      
      const foods = await foodRepository.getAllFoods();
      
      if (!foods || foods.length === 0) {
        console.log('No foods returned from database');
        return [];
      }

      console.log(`Raw foods count: ${foods.length}`);

      // Filter out corrupted entries with invalid names
      const validFoods = foodDataService.filterValidFoods(foods);
      console.log(`Valid foods count: ${validFoods.length}`);

      // Add favorites information
      return await favoritesService.addFoodsWithFavorites(validFoods, userId);
    } catch (error) {
      console.error('Error in loadFoods:', error);
      return [];
    }
  }

  async cleanCorruptedData(): Promise<boolean> {
    return await foodRepository.cleanCorruptedData();
  }

  async searchFoods(
    searchTerm: string = '', 
    subgroup: string = 'all', 
    showFavoritesOnly: boolean = false,
    userId?: string
  ): Promise<ExtendedFood[]> {
    const foods = await this.loadFoods(userId);
    return foodDataService.searchFoods(foods, searchTerm, subgroup, showFavoritesOnly);
  }

  async toggleFavorite(foodId: number, userId: string): Promise<boolean> {
    return await favoritesService.toggleFavorite(foodId, userId);
  }

  async addFood(food: Omit<FoodInsert, 'id' | 'created_at'>): Promise<Food | null> {
    return await foodRepository.addFood(food);
  }

  async getSubgroups(userId?: string): Promise<Subgroup[]> {
    const foods = await this.loadFoods(userId);
    return foodDataService.getSubgroups(foods);
  }

  async addMealEntry(
    userId: string,
    foodId: number,
    grams: number,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ): Promise<boolean> {
    return await mealService.addMealEntry(userId, foodId, grams, mealType);
  }
}

export const supabaseFoodService = new SupabaseFoodService();
export type { ExtendedFood };
