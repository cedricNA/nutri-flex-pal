import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { foodDataService, type Food } from '../services/foodDataService';
import { dataService } from '../services/dataService';
import { MealEntrySchema, FoodSchema, type Food, type MealEntry } from '../schemas';

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

function loadInitialFoodState(): Pick<FoodState, "foods" | "isLoaded" | "searchTerm" | "selectedCategory" | "showFavoritesOnly" | "todayMeals"> {
  return {
    foods: dataService.get<Food[]>("foods", []),
    isLoaded: false,
    searchTerm: dataService.get<string>("searchTerm", ""),
    selectedCategory: dataService.get<string>("selectedCategory", "all"),
    showFavoritesOnly: dataService.get<boolean>("showFavoritesOnly", false),
    todayMeals: dataService.get<MealEntry[]>("todayMeals", []),
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
        dataService.set("searchTerm", searchTerm);
        set({ searchTerm });
      },
      setSelectedCategory: (selectedCategory) => {
        dataService.set("selectedCategory", selectedCategory);
        set({ selectedCategory });
      },
      setShowFavoritesOnly: (showFavoritesOnly) => {
        dataService.set("showFavoritesOnly", showFavoritesOnly);
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
        dataService.set("todayMeals", todayMeals);
        set({ todayMeals });
      },

      removeMealEntry: (entryId) => {
        const todayMeals = get().todayMeals.filter(entry => entry.id !== entryId);
        dataService.set("todayMeals", todayMeals);
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
