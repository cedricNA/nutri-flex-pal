
import { create } from 'zustand';
import { supabaseFoodService, type ExtendedFood } from '../services/supabaseFoodService';

interface SupabaseFoodState {
  // Food library
  foods: ExtendedFood[];
  isLoaded: boolean;
  isLoading: boolean;
  searchTerm: string;
  selectedSubgroup: string;
  showFavoritesOnly: boolean;
  subgroups: { id: string; name: string; count: number }[];
  
  // Actions
  loadFoods: () => Promise<void>;
  setSearchTerm: (term: string) => void;
  setSelectedSubgroup: (subgroup: string) => void;
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
  selectedSubgroup: 'all',
  showFavoritesOnly: false,
  subgroups: [],

  // Actions
  loadFoods: async () => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true });
    
    try {
      console.log('Loading foods from database...');
      const foods = await supabaseFoodService.loadFoods();
      console.log('Loaded foods:', foods.length);
      
      const subgroups = await supabaseFoodService.getSubgroups();
      console.log('Loaded subgroups:', subgroups);
      
      set({ 
        foods, 
        subgroups,
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

  setSelectedSubgroup: (selectedSubgroup) => {
    set({ selectedSubgroup });
  },

  setShowFavoritesOnly: (showFavoritesOnly) => {
    set({ showFavoritesOnly });
  },

  toggleFavorite: async (foodId) => {
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
      console.log('Adding meal entry:', { foodId, quantity, mealType });
      return true;
    } catch (error) {
      console.error('Error adding meal entry:', error);
      return false;
    }
  },

  getFilteredFoods: () => {
    const { foods, searchTerm, selectedSubgroup, showFavoritesOnly } = get();
    
    let filtered = foods;

    if (searchTerm) {
      filtered = filtered.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubgroup !== 'all') {
      // Utiliser category au lieu de subgroup pour le filtrage
      filtered = filtered.filter(food => food.category === selectedSubgroup);
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter(food => food.isFavorite);
    }

    return filtered;
  },

  refreshData: async () => {
    console.log('Refreshing food data...');
    set({ isLoaded: false, isLoading: false });
    await get().loadFoods();
  }
}));
