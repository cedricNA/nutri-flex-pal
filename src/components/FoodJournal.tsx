import React, { useEffect, useState } from 'react';

import { foodJournalService } from '@/services/foodJournalService';
import { useAuth } from '@/hooks/useAuth';

const FoodJournal = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeals = async () => {
      if (!user) return;
      const data = await foodJournalService.getTodayMeals(user.id);
      setMeals(data);
      setLoading(false);
    };
    loadMeals();
  }, [user]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Journal Alimentaire
      </h1>
      {meals.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          Aucun repas enregistré aujourd\'hui.
        </p>
      ) : (
        <ul className="space-y-2">
          {meals.map((meal) => (
            <li
              key={meal.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <div className="font-semibold">{meal.food.name_fr}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {meal.grams}g - {meal.meal_type?.name_fr || meal.meal_type?.name}
              </div>
            </li>
          ))}
        </ul>

      )}
    </div>
  );
};

export default FoodJournal;
