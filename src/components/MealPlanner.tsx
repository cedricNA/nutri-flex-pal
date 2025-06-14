
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import MealCard from './MealCard';

// Types
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
