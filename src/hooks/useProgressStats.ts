
import { useMemo } from 'react';
import { useAppStore } from '../stores/useAppStore';

export const useProgressStats = () => {
  const { weightEntries, calorieEntries, currentPeriod, getFilteredWeightData, getFilteredCalorieData } = useAppStore();

  const stats = useMemo(() => {
    const filteredWeights = getFilteredWeightData();
    const filteredCalories = getFilteredCalorieData();

    // Weight change calculation
    const weightChange = filteredWeights.length >= 2 
      ? filteredWeights[filteredWeights.length - 1].weight - filteredWeights[0].weight
      : 0;

    // Average calories calculation
    const caloriesAverage = filteredCalories.length > 0
      ? Math.round(filteredCalories.reduce((sum, entry) => sum + entry.consumed, 0) / filteredCalories.length)
      : 0;

    // Calculate streak (simplified for demo)
    const workoutStreak = 7; // This would come from actual workout tracking

    // Goals achieved (simplified calculation)
    const goalsAchieved = filteredCalories.filter(entry => 
      Math.abs(entry.consumed - entry.target) <= 100
    ).length;

    // Global score calculation (0-100%)
    const weightProgress = Math.max(0, Math.min(100, 100 - Math.abs(weightChange) * 10));
    const calorieProgress = filteredCalories.length > 0 
      ? (goalsAchieved / filteredCalories.length) * 100 
      : 0;
    const globalScore = Math.round((weightProgress + calorieProgress + (workoutStreak * 5)) / 3);

    return {
      weightChange,
      caloriesAverage,
      workoutStreak,
      goalsAchieved,
      globalScore: Math.min(100, globalScore),
      period: currentPeriod
    };
  }, [weightEntries, calorieEntries, currentPeriod, getFilteredWeightData, getFilteredCalorieData]);

  return stats;
};
