
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { foodDataService, type Food } from '../services/foodDataService';
import { storageService } from '../services/storageService';
import { MealEntrySchema, type MealEntry } from '../schemas';

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

function loadInitialFoodState(): Pick<FoodState, "foods" | "isLoaded" | "searchTerm" | "selectedCategory" | "showFavoritesOnly" | "todayMeals"> {
  const storedFoods = storageService.get("foods");
  const storedMeals = storageService.get("todayMeals");
  
  return {
    foods: Array.isArray(storedFoods) ? storedFoods : [],
    isLoaded: false,
    searchTerm: storageService.get("searchTerm") || "",
    selectedCategory: storageService.get("selectedCategory") || "all",
    showFavoritesOnly: storageService.get("showFavoritesOnly") || false,
    todayMeals: Array.isArray(storedMeals) ? storedMeals : [],
  };
}

export const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      // Initial state
      ...loadInitialFoodState(),

      // Actions
      loadFoods: async () => {
        const foods = await foodDataService.loadFoods();
        set({ foods, isLoaded: true });
      },

      setSearchTerm: (searchTerm) => {
        storageService.set("searchTerm", searchTerm);
        set({ searchTerm });
      },
      setSelectedCategory: (selectedCategory) => {
        storageService.set("selectedCategory", selectedCategory);
        set({ selectedCategory });
      },
      setShowFavoritesOnly: (showFavoritesOnly) => {
        storageService.set("showFavoritesOnly", showFavoritesOnly);
        set({ showFavoritesOnly });
      },

      toggleFavorite: (foodId) => {
        foodDataService.toggleFavorite(foodId);
        set((state) => ({
          foods: state.foods.map(food => 
            food.id === foodId ? { ...food, isFavorite: !food.isFavorite } : food
          )
        }));
      },

      addMealEntry: (foodId, quantity, mealType) => {
        const entry = MealEntrySchema.parse({
          id: `meal_${Date.now()}`,
          foodId,
          quantity,
          mealType,
          date: new Date()
        });
        const todayMeals = [...get().todayMeals, entry];
        storageService.set("todayMeals", todayMeals);
        set({ todayMeals });
      },

      removeMealEntry: (entryId) => {
        const todayMeals = get().todayMeals.filter(entry => entry.id !== entryId);
        storageService.set("todayMeals", todayMeals);
        set({ todayMeals });
      },

      getFilteredFoods: () => {
        const { foods, searchTerm, selectedCategory, showFavoritesOnly } = get();
        return foodDataService.searchFoods(searchTerm, selectedCategory, showFavoritesOnly);
      },

      getTodayNutrition: () => {
        const { todayMeals, foods } = get();
        const today = new Date().toDateString();
        
        const todayEntries = todayMeals.filter(
          entry => {
            // entry.date may be a string after hydration, fix:
            const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
            return entryDate.toDateString() === today;
          }
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
