
import { useMemo, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { weightService, calorieService, hydrationService } from '@/services/supabaseServices';
import { useAppStore } from '../stores/useAppStore';

export const useProgressStats = () => {
  const { user } = useAuth();
  const { currentPeriod } = useAppStore();
  const [weightEntries, setWeightEntries] = useState<any[]>([]);
  const [calorieEntries, setCalorieEntries] = useState<any[]>([]);
  const [todayHydration, setTodayHydration] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const [weights, calories, hydration] = await Promise.all([
          weightService.getWeightEntries(user.id),
          calorieService.getCalorieEntries(user.id),
          hydrationService.getTodayHydration(user.id)
        ]);
        
        setWeightEntries(weights);
        setCalorieEntries(calories);
        setTodayHydration(hydration);
      } catch (error) {
        console.error('Error loading progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const stats = useMemo(() => {
    if (loading || !user) {
      return {
        weightChange: 0,
        caloriesAverage: 0,
        workoutStreak: 0,
        goalsAchieved: 0,
        globalScore: 0,
        period: currentPeriod,
        loading: true
      };
    }

    // Filtrer les données selon la période
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (currentPeriod) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      default:
        cutoffDate = new Date(0); // Toutes les données
    }

    const filteredWeights = weightEntries.filter(entry => 
      new Date(entry.date) >= cutoffDate
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const filteredCalories = calorieEntries.filter(entry => 
      new Date(entry.date) >= cutoffDate
    );

    // Calcul du changement de poids
    const weightChange = filteredWeights.length >= 2 
      ? filteredWeights[filteredWeights.length - 1].weight - filteredWeights[0].weight
      : 0;

    // Moyenne des calories
    const caloriesAverage = filteredCalories.length > 0
      ? Math.round(filteredCalories.reduce((sum, entry) => sum + entry.consumed, 0) / filteredCalories.length)
      : 0;

    // Calcul de la série d'entraînements (basé sur les entrées de calories régulières)
    let workoutStreak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasEntry = calorieEntries.some(entry => 
        entry.date.split('T')[0] === dateStr
      );
      
      if (hasEntry) {
        workoutStreak++;
      } else {
        break;
      }
    }

    // Objectifs atteints (calories dans la fourchette cible ±100)
    const goalsAchieved = filteredCalories.filter(entry => 
      Math.abs(entry.consumed - entry.target) <= 100
    ).length;

    // Score global
    const weightProgress = Math.max(0, Math.min(100, 100 - Math.abs(weightChange) * 10));
    const calorieProgress = filteredCalories.length > 0 
      ? (goalsAchieved / filteredCalories.length) * 100 
      : 0;
    const hydrationProgress = Math.min(100, (todayHydration / 8) * 100); // 8 verres par jour
    
    const globalScore = Math.round((weightProgress + calorieProgress + hydrationProgress) / 3);

    return {
      weightChange,
      caloriesAverage,
      workoutStreak,
      goalsAchieved,
      globalScore: Math.min(100, globalScore),
      period: currentPeriod,
      loading: false,
      hydrationGlasses: todayHydration
    };
  }, [weightEntries, calorieEntries, todayHydration, currentPeriod, loading, user]);

  return stats;
};
