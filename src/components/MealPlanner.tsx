
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { ensureActivePlan } from '@/api/plan';
import { addFoodToMeal, getOrCreatePlannedMeal } from '@/api/meals';
import { copyMealsFromYesterday } from '@/api/mealOperations';
import supabase from '@/lib/supabase';
import MealCard from './MealCard';
import AddFoodDialog from './AddFoodDialog';
import CreateMealDialog from './CreateMealDialog';
import { planColors } from '@/utils/planColors';

const nameToType: Record<string, string> = {
  'Petit-déjeuner': 'breakfast',
  Breakfast: 'breakfast',
  'Déjeuner': 'lunch',
  Lunch: 'lunch',
  'Dîner': 'dinner',
  Dinner: 'dinner',
  Collation: 'snack',
  Snack: 'snack'
};

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
  mealType: string;
  mealTypeId: string | null;
  mealOrder?: number;
  foods: Food[];
  targetCalories: number;
}

const MealPlanner = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [planId, setPlanId] = useState<string | null>(null);
  const [planType, setPlanType] = useState<'maintenance' | 'weight-loss' | 'bulk'>('maintenance');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMacros, setShowMacros] = useState<string | null>(null);
  const [mealToAddFood, setMealToAddFood] = useState<Meal | null>(null);
  const [lastAddedMealId, setLastAddedMealId] = useState<string | null>(null);
  const [showCreateMeal, setShowCreateMeal] = useState(false);

  const todayString = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedDate = todayString.charAt(0).toUpperCase() + todayString.slice(1);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const id = await ensureActivePlan(user.id);
        setPlanId(id);
        const { data: planData } = await supabase
          .from('nutrition_plans')
          .select('type')
          .eq('id', id)
          .single();
        if (planData && planData.type) {
          setPlanType(planData.type as 'maintenance' | 'weight-loss' | 'bulk');
        }
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
      mealType: 'breakfast',
      mealTypeId: null,
      foods: [],
      targetCalories: 400
    },
    {
      id: 'default-2',
      name: 'Déjeuner',
      time: '12:30',
      mealType: 'lunch',
      mealTypeId: null,
      foods: [],
      targetCalories: 550
    },
    {
      id: 'default-3',
      name: 'Collation',
      time: '16:00',
      mealType: 'snack',
      mealTypeId: null,
      foods: [],
      targetCalories: 200
    },
    {
      id: 'default-4',
      name: 'Dîner',
      time: '19:30',
      mealType: 'dinner',
      mealTypeId: null,
      foods: [],
      targetCalories: 500
    }
  ];

  const displayMeals = meals.length > 0
    ? [...meals].sort((a, b) => (a.mealOrder ?? 0) - (b.mealOrder ?? 0))
    : defaultMeals;

  const handleCopyFromYesterday = async () => {
    if (!planId) {
      toast({
        title: "Erreur",
        description: "Aucun plan actif trouvé.",
        variant: 'destructive'
      });
      return;
    }

    try {
      await copyMealsFromYesterday(planId);
      toast({
        title: "Repas copiés",
        description: "Les repas d'hier ont été copiés avec succès.",
      });
      await fetchMeals(planId);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de copier les repas d'hier.",
        variant: 'destructive'
      });
    }
  };

  const handleNewMeal = () => {
    setShowCreateMeal(true);
  };

  // Open the "Add food" dialog for the given meal
  const handleOpenAddFood = (mealId: string) => {
    const meal = displayMeals.find((m) => m.id === mealId);
    if (meal) {
      setMealToAddFood(meal);
    } else {
      console.error('Meal not found for id', mealId);
    }
  };

  const fetchMeals = async (id: string) => {
      const { data, error } = await supabase
        .from('planned_meals')
        .select(
          'id,name,meal_time,meal_order,target_calories,meal_type_id,planned_meal_foods(id,grams,foods:foods_clean(id,name:name_fr,calories:kcal,protein:protein_g,carbs:carb_g,fat:fat_g))'
        )
      .eq('plan_id', id)
      .order('meal_order', { ascending: true });

    if (error) throw error;

    const mapped: Meal[] = (data || []).map((meal) => ({
      id: meal.id,
      name: meal.name,
      time: meal.meal_time,
      mealType: nameToType[meal.name] || meal.name.toLowerCase(),
      mealTypeId: meal.meal_type_id ?? null,
      mealOrder: meal.meal_order ?? undefined,
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
          unit: 'g',
        })) || [],
    }));

    setMeals(mapped);
  };

  const handleAddFood = async (mealId: string, foodId: string, grams: number) => {
    try {
      if (!planId) {
        throw new Error('Aucun plan actif');
      }

      // Find meal info by id from current state
      const mealInfo = displayMeals.find((m) => m.id === mealId);

      if (!mealInfo) {
        throw new Error('Repas introuvable');
      }

      // Ensure the meal exists in database and get its id
      const dbMealId = await getOrCreatePlannedMeal({
        planId,
        name: mealInfo.name,
        mealTime: mealInfo.time,
        mealType: mealInfo.mealType,
        targetCalories: mealInfo.targetCalories,
      });

      await addFoodToMeal({
        plannedMealId: dbMealId,
        foodId,
        grams,
      });

      await fetchMeals(planId);
      setLastAddedMealId(mealId);
      setTimeout(() => setLastAddedMealId(null), 1000);
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
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Plan alimentaire du jour</h2>
            <p className="text-gray-600 dark:text-gray-400">{formattedDate}</p>
          </div>
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
          <p className="text-gray-600 dark:text-gray-400">{formattedDate}</p>
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
            mealTypeId={meal.mealTypeId}
            kcalTarget={meal.targetCalories}
            foods={meal.foods}
            isShowingMacros={showMacros === meal.id}
            onToggleMacros={(mealId) =>
              setShowMacros(showMacros === mealId ? null : mealId)
            }
            onAddFood={handleOpenAddFood}
            progressColor={planColors[planType].progress}
            highlightLastFood={lastAddedMealId === meal.id}
            planId={planId}
            onMealUpdated={() => planId && fetchMeals(planId)}
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
      {showCreateMeal && planId && (
        <CreateMealDialog
          open={showCreateMeal}
          onClose={() => setShowCreateMeal(false)}
          onSuccess={() => {
            setShowCreateMeal(false);
            fetchMeals(planId);
          }}
          planId={planId}
        />
      )}
    </div>
  );
};

export default MealPlanner;
