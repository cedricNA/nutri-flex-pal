import React from 'react';
import { Plus, Calculator, Info, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import FoodItem from './FoodItem';
import { useMealIcon } from './mealIcons';

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
  const mealIcon = useMealIcon(meal.name);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl hover:scale-102 group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#3b0764] via-[#312e81] to-[#0f172a] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
            {mealIcon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{meal.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock size={14} />
              <span>{meal.time}</span>
            </div>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={() => onAddFood(meal.name)}
              >
                <Plus size={18} className="mr-2" />
                <span className="hidden sm:inline font-medium">Ajouter</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ajouter un aliment à {meal.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-3 mb-6">
        {meal.foods.map((food) => (
          <FoodItem key={food.id} food={food} />
        ))}
        {meal.foods.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calculator size={28} className="opacity-50" />
            </div>
            <p className="text-lg font-medium mb-2">Aucun aliment ajouté</p>
            <p className="text-sm mb-4">Commencez par ajouter des aliments à votre repas</p>
            <Button
              variant="ghost"
              className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 px-6 py-2 rounded-xl transition-all duration-200"
              onClick={() => onAddFood(meal.name)}
            >
              <Plus size={16} className="mr-2" />
              Ajouter un aliment
            </Button>
          </div>
        )}
      </div>

      <div className="border-t dark:border-gray-700 pt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Progression
          </span>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {totals.calories} / {meal.targetCalories}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">kcal</div>
            </div>
            {meal.foods.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => onToggleMacros(meal.id)}
                    >
                      <Info size={16} />
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
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
            style={{ width: `${Math.min(progress, 100)}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
        
        {progress > 0 && (
          <div className="flex justify-center mt-2">
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              progress >= 100 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            }`}>
              {Math.round(progress)}% complété
            </span>
          </div>
        )}
        
        {isShowingMacros && (
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t dark:border-gray-700 animate-fade-in">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{totals.protein}g</div>
              <div className="text-xs text-green-600 dark:text-green-400">Protéines</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{totals.carbs}g</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Glucides</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{totals.fat}g</div>
              <div className="text-xs text-purple-600 dark:text-purple-400">Lipides</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealCard;
