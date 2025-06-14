
import React from 'react';
import { Plus, Calculator, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import FoodItem from './FoodItem';
import { getMealIcon } from './mealIcons';

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: string;
}

interface Meal {
  id: string;
  name: string;
  time: string;
  foods: Food[];
  targetCalories: number;
}

interface MealCardProps {
  meal: Meal;
  isShowingMacros: boolean;
  onToggleMacros: (mealId: string) => void;
  onAddFood: (mealName: string) => void;
}

const calculateMealTotals = (foods: Food[]) => {
  return foods.reduce(
    (totals, food) => ({
      calories: totals.calories + food.calories,
      protein: totals.protein + food.protein,
      carbs: totals.carbs + food.carbs,
      fat: totals.fat + food.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
};

const MealCard: React.FC<MealCardProps> = ({
  meal,
  isShowingMacros,
  onToggleMacros,
  onAddFood,
}) => {
  const totals = calculateMealTotals(meal.foods);
  const progress = (totals.calories / meal.targetCalories) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
            {getMealIcon(meal.name)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{meal.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{meal.time}</p>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                onClick={() => onAddFood(meal.name)}
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Ajouter</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ajouter un aliment à {meal.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2 mb-4">
        {meal.foods.map((food) => (
          <FoodItem key={food.id} food={food} />
        ))}
        {meal.foods.length === 0 && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <Calculator size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun aliment ajouté</p>
            <Button
              variant="ghost"
              className="mt-2 text-green-600 hover:text-green-700 text-sm"
              onClick={() => onAddFood(meal.name)}
            >
              + Ajouter un aliment
            </Button>
          </div>
        )}
      </div>

      <div className="border-t dark:border-gray-700 pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progression
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {totals.calories} / {meal.targetCalories} kcal
            </span>
            {meal.foods.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => onToggleMacros(meal.id)}
                    >
                      <Info size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Voir les macronutriments</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        {isShowingMacros && (
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t dark:border-gray-700 animate-fade-in">
            <span>Protéines: {totals.protein}g</span>
            <span>Glucides: {totals.carbs}g</span>
            <span>Lipides: {totals.fat}g</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealCard;
