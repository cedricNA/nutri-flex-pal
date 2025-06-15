
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { nutritionPlanService, plannedMealService } from '@/services/nutritionPlanService';

export const useNutritionPlan = () => {
  const { user } = useAuth();
  const [activePlan, setActivePlan] = useState<any>(null);
  const [plannedMeals, setPlannedMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivePlan = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const plan = await nutritionPlanService.getActivePlan(user.id);
        setActivePlan(plan);

        if (plan) {
          const meals = await plannedMealService.getPlannedMeals(plan.id);
          setPlannedMeals(meals);
        } else {
          setPlannedMeals([]);
        }
      } catch (error) {
        console.error('Error loading nutrition plan:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivePlan();
  }, [user]);

  const refreshPlan = async () => {
    if (!user) return;
    
    const plan = await nutritionPlanService.getActivePlan(user.id);
    setActivePlan(plan);

    if (plan) {
      const meals = await plannedMealService.getPlannedMeals(plan.id);
      setPlannedMeals(meals);
    } else {
      setPlannedMeals([]);
    }
  };

  return {
    activePlan,
    plannedMeals,
    loading,
    refreshPlan
  };
};
