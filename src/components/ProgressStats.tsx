
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { hydrationService, settingsService } from '@/services/supabaseServices';

const ProgressStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    {
      label: 'Hydratation quotidienne',
      current: 0,
      target: 2.5,
      unit: 'L',
      progress: 0,
      color: 'bg-blue-500'
    },
    {
      label: 'Activité physique',
      current: 0,
      target: 5,
      unit: 'séances/semaine',
      progress: 0,
      color: 'bg-green-500'
    },
    {
      label: 'Sommeil moyen',
      current: 7.2,
      target: 8,
      unit: 'heures',
      progress: 90,
      color: 'bg-purple-500'
    },
    {
      label: 'Respect du plan',
      current: 0,
      target: 7,
      unit: 'jours/semaine',
      progress: 0,
      color: 'bg-orange-500'
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      try {
        // Récupérer l'hydratation du jour
        const todayHydration = await hydrationService.getTodayHydration(user.id);
        const hydrationLiters = (todayHydration * 0.25); // 250ml par verre
        
        // Récupérer les paramètres utilisateur pour les objectifs
        const userSettings = await settingsService.getSettings(user.id);
        
        setStats(prevStats => [
          {
            ...prevStats[0],
            current: hydrationLiters,
            progress: Math.min(100, (hydrationLiters / 2.5) * 100)
          },
          {
            ...prevStats[1],
            current: 4, // Pour l'instant, on garde une valeur par défaut
            progress: 80
          },
          {
            ...prevStats[2],
            // Sommeil - pour l'instant valeur par défaut, pourra être étendu plus tard
            current: 7.2,
            progress: 90
          },
          {
            ...prevStats[3],
            current: 6, // Pour l'instant, on garde une valeur par défaut  
            progress: 86
          }
        ]);
      } catch (error) {
        console.error('Error loading progress stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistiques détaillées</CardTitle>
          <CardDescription>Chargement de vos statistiques...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

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
