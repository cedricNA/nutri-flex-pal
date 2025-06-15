
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { foodDataService, type Food } from '../services/foodDataService';

interface MealEntry {
  id: string;
  foodId: string;
  quantity: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: Date;
}

interface FoodState {
  // Food library
  foods: Food[];
  isLoaded: boolean;
  searchTerm: string;
  selectedCategory: string;
  showFavoritesOnly: boolean;
  
  // Meal tracking
  todayMeals: MealEntry[];
  
  // Actions
  loadFoods: () => Promise<void>;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setShowFavoritesOnly: (show: boolean) => void;
  toggleFavorite: (foodId: string) => void;
  addMealEntry: (foodId: string, quantity: number, mealType: MealEntry['mealType']) => void;
  removeMealEntry: (entryId: string) => void;
  getFilteredFoods: () => Food[];
  getTodayNutrition: () => { calories: number; protein: number; carbs: number; fat: number };
}

export const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      // Initial state
      foods: [],
      isLoaded: false,
      searchTerm: '',
      selectedCategory: 'all',
      showFavoritesOnly: false,
      todayMeals: [],

      // Actions
      loadFoods: async () => {
        const foods = await foodDataService.loadFoods();
        set({ foods, isLoaded: true });
      },

      setSearchTerm: (searchTerm) => set({ searchTerm }),
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
      setShowFavoritesOnly: (showFavoritesOnly) => set({ showFavoritesOnly }),

      toggleFavorite: (foodId) => {
        foodDataService.toggleFavorite(foodId);
        set((state) => ({
          foods: state.foods.map(food => 
            food.id === foodId ? { ...food, isFavorite: !food.isFavorite } : food
          )
        }));
      },

      addMealEntry: (foodId, quantity, mealType) => {
        const entry: MealEntry = {
          id: `meal_${Date.now()}`,
          foodId,
          quantity,
          mealType,
          date: new Date()
        };
        set((state) => ({
          todayMeals: [...state.todayMeals, entry]
        }));
      },

      removeMealEntry: (entryId) => set((state) => ({
        todayMeals: state.todayMeals.filter(entry => entry.id !== entryId)
      })),

      getFilteredFoods: () => {
        const { foods, searchTerm, selectedCategory, showFavoritesOnly } = get();
        return foodDataService.searchFoods(searchTerm, selectedCategory, showFavoritesOnly);
      },

      getTodayNutrition: () => {
        const { todayMeals, foods } = get();
        const today = new Date().toDateString();
        
        const todayEntries = todayMeals.filter(
          entry => entry.date.toDateString() === today
        );

        return todayEntries.reduce((total, entry) => {
          const food = foods.find(f => f.id === entry.foodId);
          if (!food) return total;

          const multiplier = entry.quantity / 100; // Assuming base values are per 100g
          return {
            calories: total.calories + (food.calories * multiplier),
            protein: total.protein + (food.protein * multiplier),
            carbs: total.carbs + (food.carbs * multiplier),
            fat: total.fat + (food.fat * multiplier)
          };
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
      }
    }),
    {
      name: 'nutriflex-food-storage',
      partialize: (state) => ({
        todayMeals: state.todayMeals,
        searchTerm: state.searchTerm,
        selectedCategory: state.selectedCategory,
        showFavoritesOnly: state.showFavoritesOnly
      })
    }
  )
);
