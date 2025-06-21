
import { useMemo, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { weightService, calorieService, hydrationService } from '@/services/supabaseServices';
import { activityService, sleepService } from '@/services/nutritionPlanService';
import { useAppStore } from '../stores/useAppStore';
import type { WeightEntry, CalorieEntry } from '@/schemas';

export const useProgressStats = () => {
  const { user } = useAuth();
  const { currentPeriod } = useAppStore();
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [calorieEntries, setCalorieEntries] = useState<CalorieEntry[]>([]);
  const [activityEntries, setActivityEntries] = useState<any[]>([]);
  const [sleepEntries, setSleepEntries] = useState<any[]>([]);
  const [todayHydration, setTodayHydration] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Calculer les dates selon la période
        const now = new Date();
        let startDate = new Date();
        
        switch (currentPeriod) {
          case '7d':
            startDate.setDate(now.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(now.getDate() - 30);
            break;
          default:
            startDate = new Date(0); // Toutes les données
        }

        const [weights, calories, activities, sleep, hydration] = await Promise.all([
          weightService.getWeightEntries(user.id),
          calorieService.getCalorieEntries(user.id),
          activityService.getActivityEntries(user.id, startDate),
          sleepService.getSleepEntries(user.id, startDate),
          hydrationService.getTodayHydration(user.id)
        ]);
        
        setWeightEntries(weights);
        setCalorieEntries(calories);
        setActivityEntries(activities);
        setSleepEntries(sleep);
        setTodayHydration(hydration);
      } catch (error) {
        console.error('Error loading progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, currentPeriod]);

  const stats = useMemo(() => {
    if (loading || !user) {
      return {
        weightChange: 0,
        caloriesAverage: 0,
        workoutStreak: 0,
        goalsAchieved: 0,
        globalScore: 0,
        activityCount: 0,
        averageSleep: 0,
        planComplianceRate: 0,
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

    // Calcul des activités physiques
    const activityCount = activityEntries.length;
    const weeklyActivityTarget = currentPeriod === '7d' ? 5 : (currentPeriod === '30d' ? 20 : activityCount);

    // Calcul du sommeil moyen
    const averageSleep = sleepEntries.length > 0
      ? sleepEntries.reduce((sum, entry) => sum + Number(entry.hours_slept), 0) / sleepEntries.length
      : 0;

    // Calcul de la série d'entraînements basée sur les activités réelles
    let workoutStreak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasActivity = activityEntries.some(entry => 
        entry.date === dateStr
      );
      
      if (hasActivity) {
        workoutStreak++;
      } else {
        break;
      }
    }

    // Objectifs atteints (calories dans la fourchette cible ±100)
    const goalsAchieved = filteredCalories.filter(entry => 
      Math.abs(entry.consumed - entry.target) <= 100
    ).length;

    // Calcul du taux de respect du plan (basé sur les entrées de calories)
    const totalDays = currentPeriod === '7d' ? 7 : (currentPeriod === '30d' ? 30 : Math.max(1, filteredCalories.length));
    const planComplianceRate = (filteredCalories.length / totalDays) * 100;

    // Score global amélioré
    const weightProgress = filteredWeights.length >= 2
      ? Math.max(0, Math.min(100, 100 - Math.abs(weightChange) * 10))
      : 0;
    const calorieProgress = filteredCalories.length > 0 
      ? (goalsAchieved / filteredCalories.length) * 100 
      : 0;
    const hydrationProgress = Math.min(100, (todayHydration / 8) * 100); // 8 verres par jour
    const activityProgress = Math.min(100, (activityCount / weeklyActivityTarget) * 100);
    const sleepProgress = averageSleep > 0 ? Math.min(100, (averageSleep / 8) * 100) : 0;
    
    const globalScore = Math.round((weightProgress + calorieProgress + hydrationProgress + activityProgress + sleepProgress) / 5);

    return {
      weightChange,
      caloriesAverage,
      workoutStreak,
      goalsAchieved,
      globalScore: Math.min(100, globalScore),
      activityCount,
      averageSleep: Math.round(averageSleep * 10) / 10,
      planComplianceRate: Math.round(planComplianceRate),
      period: currentPeriod,
      loading: false,
      hydrationGlasses: todayHydration
    };
  }, [weightEntries, calorieEntries, activityEntries, sleepEntries, todayHydration, currentPeriod, loading, user]);

  return stats;
};
