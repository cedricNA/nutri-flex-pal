import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Food = Database['public']['Tables']['foods']['Row'];
type FoodInsert = Database['public']['Tables']['foods']['Insert'];
type UserFoodFavorite = Database['public']['Tables']['user_food_favorites']['Row'];

export interface ExtendedFood extends Food {
  isFavorite?: boolean;
}

class SupabaseFoodService {
  
  async loadFoods(userId?: string): Promise<ExtendedFood[]> {
    try {
      // Load foods from Supabase with new nutritional columns
      const { data: foods, error } = await supabase
        .from('foods')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error loading foods:', error);
        return [];
      }

      if (!foods) {
        return [];
      }

      // Filter out corrupted entries with invalid names
      const validFoods = foods.filter(food => 
        food.name && 
        food.name.length > 0 && 
        !food.name.includes(':::') && // Remove entries with corrupted separators
        !food.name.match(/^\d+:\d+/) && // Remove entries starting with numbers and colons
        food.name.length < 200 // Remove extremely long names
      );

      if (!userId) {
        return validFoods.map(food => ({ ...food, isFavorite: false }));
      }

      // Load user favorites
      const { data: favorites, error: favError } = await supabase
        .from('user_food_favorites')
        .select('food_id')
        .eq('user_id', userId);

      if (favError) {
        console.error('Error loading favorites:', favError);
        return validFoods.map(food => ({ ...food, isFavorite: false }));
      }

      const favoriteIds = new Set(favorites?.map(fav => fav.food_id) || []);
      
      return validFoods.map(food => ({
        ...food,
        isFavorite: favoriteIds.has(food.id)
      }));
    } catch (error) {
      console.error('Error in loadFoods:', error);
      return [];
    }
  }

  async cleanCorruptedData(): Promise<boolean> {
    try {
      // Delete entries with corrupted names
      const { error } = await supabase
        .from('foods')
        .delete()
        .or(
          'name.like.*:::*,' +
          'name.like.0*:*,' +
          'name.like.1*:*,' +
          'name.eq.,' +
          'name.is.null'
        );

      if (error) {
        console.error('Error cleaning corrupted data:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in cleanCorruptedData:', error);
      return false;
    }
  }

  async searchFoods(
    searchTerm: string = '', 
    category: string = 'all', 
    showFavoritesOnly: boolean = false,
    userId?: string
  ): Promise<ExtendedFood[]> {
    const foods = await this.loadFoods(userId);
    
    let filtered = foods;

    if (searchTerm) {
      filtered = filtered.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category !== 'all') {
      filtered = filtered.filter(food => food.category === category);
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter(food => food.isFavorite);
    }

    return filtered;
  }

  async toggleFavorite(foodId: string, userId: string): Promise<boolean> {
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

  async addFood(food: Omit<FoodInsert, 'id' | 'created_at'>): Promise<Food | null> {
    try {
      // Validate the food data before insertion
      if (!food.name || food.name.trim() === '') {
        console.error('Food name is required');
        return null;
      }

      // Clean the food name
      const cleanedFood = {
        ...food,
        name: food.name.trim(),
        calories: Math.max(0, food.calories || 0),
        protein: Math.max(0, food.protein || 0),
        carbs: Math.max(0, food.carbs || 0),
        fat: Math.max(0, food.fat || 0),
        fiber: Math.max(0, food.fiber || 0)
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

  async getCategories(userId?: string): Promise<{ id: string; name: string; count: number }[]> {
    const foods = await this.loadFoods(userId);
    const categoryMap = new Map<string, number>();
    
    foods.forEach(food => {
      categoryMap.set(food.category, (categoryMap.get(food.category) || 0) + 1);
    });

    const categories = [
      { id: 'all', name: 'Tous', count: foods.length }
    ];

    const categoryNames: { [key: string]: string } = {
      proteins: 'Protéines',
      grains: 'Céréales',
      vegetables: 'Légumes',
      fruits: 'Fruits',
      dairy: 'Laitiers',
      fats: 'Matières grasses',
      snacks: 'Collations'
    };

    categoryMap.forEach((count, categoryId) => {
      categories.push({
        id: categoryId,
        name: categoryNames[categoryId] || categoryId,
        count
      });
    });

    return categories;
  }

  async addMealEntry(
    userId: string,
    foodId: string,
    quantity: number,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('meal_entries')
        .insert({
          user_id: userId,
          food_id: foodId,
          quantity,
          meal_type: mealType,
          date: new Date().toISOString()
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

export const supabaseFoodService = new SupabaseFoodService();
