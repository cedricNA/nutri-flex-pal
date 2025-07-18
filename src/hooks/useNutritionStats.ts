
import { useMemo } from 'react';
import { useFoodStore } from '../stores/useFoodStore';
import { useAppStore } from '../stores/useAppStore';
import { generateNutritionTargets } from '../utils/nutritionUtils';

export const useNutritionStats = () => {
  const { getTodayNutrition } = useFoodStore();
  const { user, todayWater, addWater } = useAppStore();

  const stats = useMemo(() => {
    const todayNutrition = getTodayNutrition();
    
    // Objectifs par défaut si pas d'utilisateur
    const defaults = generateNutritionTargets(2200, 'maintenance');
    const defaultGoals = {
      dailyCalories: defaults.calories,
      protein: defaults.protein,
      carbs: defaults.carbs,
      fat: defaults.fat
    };

    const goals = user?.goals || defaultGoals;
    const waterTarget = 8; // 8 verres par jour par défaut

    return {
      calories: {
        current: Math.round(todayNutrition.calories),
        target: goals.dailyCalories
      },
      proteins: {
        current: Math.round(todayNutrition.protein),
        target: goals.protein
      },
      carbs: {
        current: Math.round(todayNutrition.carbs),
        target: goals.carbs
      },
      fats: {
        current: Math.round(todayNutrition.fat),
        target: goals.fat
      },
      water: {
        current: todayWater,
        target: waterTarget
      }
    };
  }, [getTodayNutrition, user, todayWater]);

  return {
    stats,
    addWater
  };
};
