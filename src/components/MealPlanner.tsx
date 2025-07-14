
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
  }, [user, toast]);

  const displayMeals = [...meals].sort((a, b) => (a.mealOrder ?? 0) - (b.mealOrder ?? 0));

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
    const today = new Date().toISOString().split('T')[0];

    const { data: meals, error } = await supabase
      .from('planned_meals')
      .select('id,name,meal_time,meal_order,target_calories,meal_type_id')
      .eq('plan_id', id)
      .order('meal_order', { ascending: true });

    if (error || !meals) throw error;

    const { data: foods, error: foodsError } = await supabase
      .from('planned_meal_foods')
      .select('id,grams,planned_meal_id,foods:foods_clean(id,name:name_fr,calories:kcal,protein:protein_g,carbs:carb_g,fat:fat_g)')
      .in('planned_meal_id', meals.map((m) => m.id))
      .eq('target_date', today);

    if (foodsError) throw foodsError;

    const foodsByMeal: Record<string, any[]> = {};
    (foods || []).forEach((f: any) => {
      if (!foodsByMeal[f.planned_meal_id]) {
        foodsByMeal[f.planned_meal_id] = [];
      }
      foodsByMeal[f.planned_meal_id].push({
        id: f.id,
        name: f.foods?.name ?? 'Aliment inconnu',
        calories: Math.round(((f.foods?.calories ?? 0) * f.grams) / 100),
        protein: Math.round(((f.foods?.protein ?? 0) * f.grams) / 100 * 10) / 10,
        carbs: Math.round(((f.foods?.carbs ?? 0) * f.grams) / 100 * 10) / 10,
        fat: Math.round(((f.foods?.fat ?? 0) * f.grams) / 100 * 10) / 10,
        quantity: f.grams,
        unit: 'g',
      });
    });

    const mapped: Meal[] = meals.map((meal) => ({
      id: meal.id,
      name: meal.name,
      time: meal.meal_time,
      mealType: nameToType[meal.name] || meal.name.toLowerCase(),
      mealTypeId: meal.meal_type_id ?? null,
      mealOrder: meal.meal_order ?? undefined,
      targetCalories: meal.target_calories,
      foods: foodsByMeal[meal.id] || [],
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
        targetDate: new Date().toISOString().split('T')[0],
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {displayMeals.map((meal) => (
          <MealCard
            key={meal.id}
            mealId={meal.id}
            name={meal.name}
            time={meal.time}
            mealTypeId={meal.mealTypeId}
            kcalTarget={meal.targetCalories}
            foods={meal.foods}
            onAddFood={handleOpenAddFood}
            progressColor={planColors[planType].progress}
            highlightLastFood={lastAddedMealId === meal.id}
            planId={planId}
            onMealUpdated={() => planId && fetchMeals(planId)}
          />
        ))}
        {displayMeals.length === 0 && (
          <div className="col-span-1 lg:col-span-2 text-center py-8">
            <p className="text-muted-foreground">
              Aucun repas planifié pour aujourd'hui.
            </p>
          </div>
        )}
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
