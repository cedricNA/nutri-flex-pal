
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const ProgressStats = () => {
  const stats = [
    {
      label: 'Hydratation quotidienne',
      current: 2.1,
      target: 2.5,
      unit: 'L',
      progress: 84,
      color: 'bg-blue-500'
    },
    {
      label: 'Activité physique',
      current: 4,
      target: 5,
      unit: 'séances/semaine',
      progress: 80,
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
      current: 6,
      target: 7,
      unit: 'jours/semaine',
      progress: 86,
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
                    {stat.progress}%
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
