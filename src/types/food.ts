
import { Database } from '@/types/supabase';

export type Food = Database['public']['Tables']['foods']['Row'];
export type FoodInsert = Database['public']['Tables']['foods']['Insert'];
export type UserFoodFavorite = Database['public']['Tables']['user_food_favorites']['Row'];

export interface ExtendedFood extends Food {
  isFavorite?: boolean;
  subgroup?: string; // Pour affichage seulement, pas stocké en DB
}

export interface Subgroup {
  id: string;
  name: string;
  count: number;
}
