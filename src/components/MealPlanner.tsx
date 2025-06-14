
import React, { useState } from 'react';
import { Plus, Clock, Calculator, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

const MealPlanner = () => {
  const { toast } = useToast();
  const [showMacros, setShowMacros] = useState<string | null>(null);
  
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: '1',
      name: 'Petit-déjeuner',
      time: '08:00',
      foods: [
        { id: '1', name: 'Avoine', calories: 150, protein: 5, carbs: 27, fat: 3, quantity: 50, unit: 'g' },
        { id: '2', name: 'Banane', calories: 89, protein: 1, carbs: 23, fat: 0, quantity: 1, unit: 'unité' },
        { id: '3', name: 'Lait d\'amande', calories: 50, protein: 1, carbs: 8, fat: 2, quantity: 200, unit: 'ml' },
      ],
      targetCalories: 400
    },
    {
      id: '2',
      name: 'Déjeuner',
      time: '12:30',
      foods: [
        { id: '4', name: 'Poulet grillé', calories: 231, protein: 43, carbs: 0, fat: 5, quantity: 150, unit: 'g' },
        { id: '5', name: 'Riz complet', calories: 123, protein: 3, carbs: 25, fat: 1, quantity: 100, unit: 'g' },
        { id: '6', name: 'Brocolis', calories: 25, protein: 3, carbs: 5, fat: 0, quantity: 150, unit: 'g' },
      ],
      targetCalories: 550
    },
    {
      id: '3',
      name: 'Collation',
      time: '16:00',
      foods: [],
      targetCalories: 200
    },
    {
      id: '4',
      name: 'Dîner',
      time: '19:30',
      foods: [
        { id: '7', name: 'Saumon', calories: 206, protein: 28, carbs: 0, fat: 9, quantity: 120, unit: 'g' },
        { id: '8', name: 'Quinoa', calories: 120, protein: 4, carbs: 22, fat: 2, quantity: 80, unit: 'g' },
        { id: '9', name: 'Épinards', calories: 20, protein: 2, carbs: 3, fat: 0, quantity: 100, unit: 'g' },
      ],
      targetCalories: 500
    }
  ]);

  const calculateMealTotals = (foods: Food[]) => {
    return foods.reduce((totals, food) => ({
      calories: totals.calories + food.calories,
      protein: totals.protein + food.protein,
      carbs: totals.carbs + food.carbs,
      fat: totals.fat + food.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const handleCopyFromYesterday = () => {
    toast({
      title: "Repas copiés !",
      description: "Les repas d'hier ont été ajoutés à votre plan d'aujourd'hui.",
    });
  };

  const handleNewMeal = () => {
    toast({
      title: "Nouveau repas",
      description: "Créez votre nouveau repas personnalisé.",
    });
  };

  const handleAddFood = (mealName: string) => {
    toast({
      title: "Ajouter un aliment",
      description: `Sélectionnez un aliment pour ${mealName}.`,
    });
  };

  const FoodItem = ({ food }: { food: Food }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 dark:text-gray-100">{food.name}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{food.quantity} {food.unit}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900 dark:text-gray-100">{food.calories} kcal</p>
      </div>
    </div>
  );

  const MealCard = ({ meal }: { meal: Meal }) => {
    const totals = calculateMealTotals(meal.foods);
    const progress = (totals.calories / meal.targetCalories) * 100;
    const isShowingMacros = showMacros === meal.id;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Clock className="text-white" size={18} />
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
                  onClick={() => handleAddFood(meal.name)}
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
                onClick={() => handleAddFood(meal.name)}
              >
                + Ajouter un aliment
              </Button>
            </div>
          )}
        </div>

        <div className="border-t dark:border-gray-700 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progression</span>
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
                        onClick={() => setShowMacros(isShowingMacros ? null : meal.id)}
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Plan alimentaire du jour</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button 
            variant="outline"
            className="text-sm px-4 py-2 rounded-lg font-medium transition"
            onClick={handleCopyFromYesterday}
          >
            Copier d'hier
          </Button>
          <Button 
            className="bg-green-500 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition"
            onClick={handleNewMeal}
          >
            <Plus size={16} className="mr-2" />
            Nouveau repas
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>
    </div>
  );
};

export default MealPlanner;
