import React from 'react';
import type { Database } from '@/types/supabase';

// Types reused from the service
type ConsumedMealFood = Database['public']['Tables']['consumed_meal_foods']['Row'];
type FoodClean = Database['public']['Views']['foods_clean']['Row'];
type MealType = Database['public']['Tables']['meal_types']['Row'];

interface ConsumedMealProps {
  mealName: string;
  items: (ConsumedMealFood & { food: FoodClean; meal_type: MealType })[];
}

const ConsumedMeal = ({ mealName, items }: ConsumedMealProps) => {
  const totalCalories = items.reduce(
    (sum, item) => sum + Math.round((item.food.kcal * item.grams) / 100),
    0
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-4 space-y-2">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {mealName}
      </h3>
      <ul className="space-y-1">
        {items.map((entry) => (
          <li key={entry.id} className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">
              {entry.food.name_fr}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {entry.grams} g - {Math.round((entry.food.kcal * entry.grams) / 100)} kcal
            </span>
          </li>
        ))}
      </ul>
      <div className="text-right font-semibold text-gray-800 dark:text-gray-200 pt-1">
        Total: {totalCalories} kcal
      </div>
    </div>
  );
};

export default ConsumedMeal;
