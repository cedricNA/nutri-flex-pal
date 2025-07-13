
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { useProgressStats } from '@/hooks/useProgressStats';

type ProgressStatsData = ReturnType<typeof useProgressStats>;

interface ProgressStatsProps {
  progressStats: ProgressStatsData;
}

const ProgressStats = ({ progressStats }: ProgressStatsProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!progressStats.loading) {
      setLoading(false);
    }
  }, [progressStats.loading]);

  if (loading || progressStats.loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistiques détaillées</CardTitle>
          <CardDescription>Chargement de vos statistiques...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Calculer les statistiques basées sur les vraies données
  const hydrationLiters = (progressStats.hydrationGlasses * 0.25); // 250ml par verre
  const activityProgress = Math.min(100, (progressStats.activityCount / 5) * 100); // 5 séances par semaine
  const sleepProgress = progressStats.averageSleep > 0 ? Math.min(100, (progressStats.averageSleep / 8) * 100) : 0;
  const planProgress = Math.min(100, progressStats.planComplianceRate);

  const stats = [
    {
      label: 'Hydratation quotidienne',
      current: hydrationLiters,
      target: 2.5,
      unit: 'L',
      progress: Math.min(100, (hydrationLiters / 2.5) * 100),
      color: 'bg-blue-500'
    },
    {
      label: 'Activité physique',
      current: progressStats.activityCount,
      target: 5,
      unit: 'séances/semaine',
      progress: activityProgress,
      color: 'bg-green-500'
    },
    {
      label: 'Sommeil moyen',
      current: progressStats.averageSleep,
      target: 8,
      unit: 'heures',
      progress: sleepProgress,
      color: 'bg-purple-500'
    },
    {
      label: 'Respect du plan',
      current: Math.round(progressStats.planComplianceRate / 100 * 7),
      target: 7,
      unit: 'jours/semaine',
      progress: planProgress,
      color: 'bg-orange-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques détaillées</CardTitle>
        <CardDescription>
          Vue d'ensemble de vos habitudes et performances
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{stat.label}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold">
                    {stat.current} {stat.unit}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {stat.target} {stat.unit}
                  </span>
                  <Badge variant={stat.progress >= 85 ? "default" : "secondary"}>
                    {stat.progress.toFixed(0)}%
                  </Badge>
                </div>
              </div>
            </div>
            <Progress 
              value={stat.progress} 
              className="h-2"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProgressStats;
