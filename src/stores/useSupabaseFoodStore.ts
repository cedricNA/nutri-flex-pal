
import { create } from 'zustand';
import { supabaseFoodService, type ExtendedFood } from '../services/supabaseFoodService';
import { useAuth } from '@/hooks/useAuth';

interface SupabaseFoodState {
  // Food library
  foods: ExtendedFood[];
  isLoaded: boolean;
  isLoading: boolean;
  searchTerm: string;
  selectedCategory: string;
  showFavoritesOnly: boolean;
  categories: { id: string; name: string; count: number }[];
  
  // Actions
  loadFoods: () => Promise<void>;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setShowFavoritesOnly: (show: boolean) => void;
  toggleFavorite: (foodId: string) => Promise<void>;
  addMealEntry: (foodId: string, quantity: number, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => Promise<boolean>;
  getFilteredFoods: () => ExtendedFood[];
  refreshData: () => Promise<void>;
}

export const useSupabaseFoodStore = create<SupabaseFoodState>((set, get) => ({
  // Initial state
  foods: [],
  isLoaded: false,
  isLoading: false,
  searchTerm: '',
  selectedCategory: 'all',
  showFavoritesOnly: false,
  categories: [],

  // Actions
  loadFoods: async () => {
    const { isLoading, isLoaded } = get();
    if (isLoading || isLoaded) return;

    set({ isLoading: true });
    
    try {
      // Get current user from auth context - this is a workaround
      // In real usage, we should pass userId as parameter
      const foods = await supabaseFoodService.loadFoods();
      const categories = await supabaseFoodService.getCategories();
      
      set({ 
        foods, 
        categories,
        isLoaded: true, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error loading foods:', error);
      set({ isLoading: false });
    }
  },

  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
  },

  setSelectedCategory: (selectedCategory) => {
    set({ selectedCategory });
  },

  setShowFavoritesOnly: (showFavoritesOnly) => {
    set({ showFavoritesOnly });
  },

  toggleFavorite: async (foodId) => {
    // This needs user context - will be improved when auth is fully integrated
    try {
      const { foods } = get();
      // Optimistically update UI
      const updatedFoods = foods.map(food => 
        food.id === foodId ? { ...food, isFavorite: !food.isFavorite } : food
      );
      set({ foods: updatedFoods });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert optimistic update on error
      get().refreshData();
    }
  },

  addMealEntry: async (foodId, quantity, mealType) => {
    try {
      // This needs user context - placeholder for now
      console.log('Adding meal entry:', { foodId, quantity, mealType });
      return true;
    } catch (error) {
      console.error('Error adding meal entry:', error);
      return false;
    }
  },

  getFilteredFoods: () => {
    const { foods, searchTerm, selectedCategory, showFavoritesOnly } = get();
    
    let filtered = foods;

    if (searchTerm) {
      filtered = filtered.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(food => food.category === selectedCategory);
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter(food => food.isFavorite);
    }

    return filtered;
  },

  refreshData: async () => {
    set({ isLoaded: false });
    await get().loadFoods();
  }
}));
