
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { ensureActivePlan } from '@/api/plan';
import { addFoodToMeal } from '@/api/meals';
import supabase from '@/lib/supabase';
import MealCard from './MealCard';
import AddFoodDialog from './AddFoodDialog';

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
  const { user } = useAuth();
  const [planId, setPlanId] = useState<string | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMacros, setShowMacros] = useState<string | null>(null);
  const [mealToAddFood, setMealToAddFood] = useState<Meal | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const id = await ensureActivePlan(user.id);
        setPlanId(id);
        await fetchMeals(id);
      } catch (err) {
        console.error(err);
        toast({
          title: 'Erreur',
          description: "Impossible de charger vos repas.",
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

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

  const displayMeals = meals.length > 0 ? meals : defaultMeals;

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

  const handleOpenAddFood = (meal: Meal) => {
    setMealToAddFood(meal);
  };

  const fetchMeals = async (id: string) => {
    const { data, error } = await supabase
      .from('planned_meals')
      .select('id,name,meal_time,target_calories,planned_meal_foods(id,grams,foods(id,name,calories,protein,carbs,fat,unit)))')
      .eq('plan_id', id)
      .order('meal_order');

    if (error) throw error;

    const mapped: Meal[] = (data || []).map((meal) => ({
      id: meal.id,
      name: meal.name,
      time: meal.meal_time,
      targetCalories: meal.target_calories,
      foods:
        meal.planned_meal_foods?.map((pf: any) => ({
          id: pf.id,
          name: pf.foods?.name ?? 'Aliment inconnu',
          calories: Math.round(((pf.foods?.calories ?? 0) * pf.grams) / 100),
          protein: Math.round(((pf.foods?.protein ?? 0) * pf.grams) / 100 * 10) / 10,
          carbs: Math.round(((pf.foods?.carbs ?? 0) * pf.grams) / 100 * 10) / 10,
          fat: Math.round(((pf.foods?.fat ?? 0) * pf.grams) / 100 * 10) / 10,
          quantity: pf.grams,
          unit: pf.foods?.unit ?? 'g',
        })) || [],
    }));

    setMeals(mapped);
  };

  const handleAddFood = async (mealId: string, foodId: string, grams: number) => {
    try {
      await addFoodToMeal({ plannedMealId: mealId, foodId: Number(foodId), grams });
      if (planId) {
        await fetchMeals(planId);
      }
    } catch (err) {
      toast({
        title: 'Erreur',
        description: "Impossible d'ajouter l'aliment.",
        variant: 'destructive',
      });
    }
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

      {!planId && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            Aucun plan nutritionnel actif. Rendez-vous dans la section "Plans" pour créer ou activer un plan alimentaire personnalisé.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {displayMeals.map((meal) => (
          <MealCard
            key={meal.id}
            mealId={meal.id}
            name={meal.name}
            time={meal.time}
            kcalTarget={meal.targetCalories}
            foods={meal.foods}
            isShowingMacros={showMacros === meal.id}
            onToggleMacros={(mealId) =>
              setShowMacros(showMacros === mealId ? null : mealId)
            }
            onAddFood={handleOpenAddFood}
          />
        ))}
      </div>
      {mealToAddFood && (
        <AddFoodDialog
          open={!!mealToAddFood}
          mealId={mealToAddFood.id}
          mealName={mealToAddFood.name}
          onClose={() => setMealToAddFood(null)}
          onAddFood={handleAddFood}
        />
      )}
    </div>
  );
};

export default MealPlanner;
