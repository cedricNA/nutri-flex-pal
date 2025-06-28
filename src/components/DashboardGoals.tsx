import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { dynamicDataService, type UserGoal } from '@/services/dynamicDataService';
import { calculateGoalProgress } from '@/utils/progress';
import ObjectiveSummary from './ObjectiveSummary';

interface DashboardGoalsProps {
  onViewProgress: () => void;
}

const DashboardGoals = ({ onViewProgress }: DashboardGoalsProps) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    dynamicDataService
      .getUserGoals(user.id)
      .then(async (data) => {
        setGoals(data);
        const progressValues = await Promise.all(
          data.map(async g => [g.id, await calculateGoalProgress(g)] as [string, number])
        );
        setProgressMap(Object.fromEntries(progressValues));
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target size={20} />
          Objectifs actifs
        </CardTitle>
        <CardDescription>Suivi rapide de vos progrès</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Chargement...</p>
        ) : goals.length === 0 ? (
          <div className="space-y-2 text-center">
            <p>Aucun objectif actif actuellement.</p>
            <Button variant="link" onClick={onViewProgress} className="p-0 h-auto">
              Fixez-en un dans la section Progression
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <ObjectiveSummary key={goal.id} goal={goal} progress={progressMap[goal.id] || 0} />
            ))}
            <div className="text-right">
              <Button variant="link" onClick={onViewProgress} className="p-0 h-auto">
                Voir mes objectifs
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardGoals;
