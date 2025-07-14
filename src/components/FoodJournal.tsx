import React, { useEffect, useState } from 'react';
import { foodJournalService, type ConsumedMealEnriched } from '@/services/foodJournalService';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface MealGroupProps {
  mealType: string;
  items: ConsumedMealEnriched[];
}

const MealGroup = ({ mealType, items }: MealGroupProps) => {
  const totals = items.reduce(
    (acc, item) => ({
      kcal: acc.kcal + item.kcal,
      protein: acc.protein + item.protein_g,
      carbs: acc.carbs + item.carb_g,
      fat: acc.fat + item.fat_g,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="space-y-1 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
        {mealType} ({totals.kcal} kcal)
      </h3>
      <ul className="space-y-1 text-sm">
        {items.map((food) => (
          <li key={food.id} className="flex justify-between">
            <span>
              {food.quantity_grams}g {food.name_fr}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {food.kcal} kcal • {food.protein_g}g P • {food.carb_g}g G • {food.fat_g}g L
            </span>
          </li>
        ))}
      </ul>
      <div className="text-right text-sm font-medium mt-1">
        Total : {totals.kcal} kcal | 🍗 {totals.protein}g • 🍞 {totals.carbs}g • 🧈 {totals.fat}g
      </div>
      <div className="text-right mt-2">
        <Button size="sm" variant="outline">Ajouter un aliment</Button>
      </div>
    </div>
  );
};

const FoodJournal = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<ConsumedMealEnriched[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const data = await foodJournalService.getTodayEnrichedMeals(user.id);
      setEntries(data);
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (entries.length === 0) {
    return <p className="text-gray-600 dark:text-gray-400">Aucun repas enregistré aujourd'hui.</p>;
  }

  // Group items by meal type and maintain sort order
  const groups: Record<string, ConsumedMealEnriched[]> = {};
  entries.forEach((item) => {
    if (!groups[item.meal_type]) groups[item.meal_type] = [];
    groups[item.meal_type].push(item);
  });

  const sortedMealTypes = Object.keys(groups).sort((a, b) => {
    const aOrder = groups[a][0]?.sort_order ?? 0;
    const bOrder = groups[b][0]?.sort_order ?? 0;
    return aOrder - bOrder;
  });

  const dayTotals = entries.reduce(
    (acc, item) => ({
      kcal: acc.kcal + item.kcal,
      protein: acc.protein + item.protein_g,
      carbs: acc.carbs + item.carb_g,
      fat: acc.fat + item.fat_g,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-sm font-medium">
        Total du jour : {dayTotals.kcal} kcal | 🍗 {dayTotals.protein}g • 🍞 {dayTotals.carbs}g • 🧈 {dayTotals.fat}g
      </div>
      {sortedMealTypes.map((type) => (
        <MealGroup key={type} mealType={type} items={groups[type]} />
      ))}
    </div>
  );
};

export default FoodJournal;

