
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useNutritionPlan } from '@/hooks/useNutritionPlan';
import MealCard from './MealCard';

// Types pour les repas dynamiques
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
  const { activePlan, plannedMeals, loading } = useNutritionPlan();
  const [showMacros, setShowMacros] = useState<string | null>(null);

  // Transformer les repas planifiés en format attendu par MealCard
  const transformedMeals: Meal[] = plannedMeals.map(meal => ({
    id: meal.id,
    name: meal.name,
    time: meal.meal_time,
    targetCalories: meal.target_calories,
    foods: meal.planned_meal_foods?.map((plannedFood: any) => ({
      id: plannedFood.id,
      name: plannedFood.foods?.name || 'Aliment inconnu',
      calories: Math.round((plannedFood.foods?.calories || 0) * plannedFood.quantity / 100),
      protein: Math.round((plannedFood.foods?.protein || 0) * plannedFood.quantity / 100 * 10) / 10,
      carbs: Math.round((plannedFood.foods?.carbs || 0) * plannedFood.quantity / 100 * 10) / 10,
      fat: Math.round((plannedFood.foods?.fat || 0) * plannedFood.quantity / 100 * 10) / 10,
      quantity: plannedFood.quantity,
      unit: plannedFood.foods?.unit || 'g'
    })) || []
  }));

  // Repas par défaut si aucun plan actif
  const defaultMeals: Meal[] = [
    {
      id: 'default-1',
      name: 'Petit-déjeuner',
      time: '08:00',
      foods: [],
      targetCalories: 400
    },
    {
      id: 'default-2',
      name: 'Déjeuner',
      time: '12:30',
      foods: [],
      targetCalories: 550
    },
    {
      id: 'default-3',
      name: 'Collation',
      time: '16:00',
      foods: [],
      targetCalories: 200
    },
    {
      id: 'default-4',
      name: 'Dîner',
      time: '19:30',
      foods: [],
      targetCalories: 500
    }
  ];

  const meals = transformedMeals.length > 0 ? transformedMeals : defaultMeals;

  const handleCopyFromYesterday = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "La copie des repas d'hier sera bientôt disponible.",
    });
  };

  const handleNewMeal = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "La création de nouveaux repas sera bientôt disponible.",
    });
  };

  const handleAddFood = (mealName: string) => {
    toast({
      title: "Fonctionnalité à venir",
      description: `L'ajout d'aliments à ${mealName} sera bientôt disponible.`,
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Plan alimentaire du jour</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Chargement de votre plan alimentaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Plan alimentaire du jour</h2>
          {activePlan && (
            <p className="text-sm text-muted-foreground mt-1">
              Plan actuel : {activePlan.name} ({activePlan.target_calories} kcal/jour)
            </p>
          )}
        </div>
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

      {!activePlan && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            Aucun plan nutritionnel actif. Rendez-vous dans la section "Plans" pour créer ou activer un plan alimentaire personnalisé.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {meals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            isShowingMacros={showMacros === meal.id}
            onToggleMacros={(mealId) =>
              setShowMacros(showMacros === mealId ? null : mealId)
            }
            onAddFood={handleAddFood}
          />
        ))}
      </div>
    </div>
  );
};

export default MealPlanner;
