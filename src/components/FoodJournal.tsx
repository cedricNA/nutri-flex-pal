import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { foodJournalService } from '@/services/foodJournalService';
import type { Database } from '@/types/supabase';
import ConsumedMeal from './ConsumedMeal';

// Reuse database types
type ConsumedMealFood = Database['public']['Tables']['consumed_meal_foods']['Row'];
type FoodClean = Database['public']['Views']['foods_clean']['Row'];
type MealType = Database['public']['Tables']['meal_types']['Row'];
type DailySummary = Database['public']['Views']['daily_nutrition_summary']['Row'];

interface GroupedMeals {
  [mealName: string]: (ConsumedMealFood & { food: FoodClean; meal_type: MealType })[];
}

const FoodJournal = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<GroupedMeals>({});
  const [summary, setSummary] = useState<DailySummary | null>(null);

  useEffect(() => {
    if (!user) return;

    foodJournalService.getTodayMeals(user.id).then((data) => {
      const grouped: GroupedMeals = {};
      data.forEach((item) => {
        const name = item.meal_type.display_name;
        if (!grouped[name]) grouped[name] = [];
        grouped[name].push(item);
      });
      setMeals(grouped);
    });

    foodJournalService
      .getDailySummary(user.id, new Date())
      .then((res) => setSummary(res));
  }, [user]);

  if (!user) return null;

  const todayString = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedDate = todayString.charAt(0).toUpperCase() + todayString.slice(1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
          Journal alimentaire
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{formattedDate}</p>
      </div>
      <div className="space-y-4">
        {Object.entries(meals).map(([name, items]) => (
          <ConsumedMeal key={name} mealName={name} items={items} />
        ))}
      </div>
      {summary && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-300">
          <p className="font-semibold mb-1">Résumé de la journée</p>
          <p>
            {summary.calories} kcal - {summary.protein}g prot - {summary.carbs}g
            gluc - {summary.fat}g lip - {summary.fiber}g fibres
          </p>
        </div>
      )}
    </div>
  );
};

export default FoodJournal;
