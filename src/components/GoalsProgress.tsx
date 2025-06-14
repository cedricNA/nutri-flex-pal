
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Target } from 'lucide-react';

const GoalsProgress = () => {
  const goals = [
    {
      id: 1,
      title: 'Perdre 3 kg ce mois',
      description: 'Objectif de perte de poids progressive',
      progress: 83,
      current: 2.5,
      target: 3,
      unit: 'kg',
      completed: false,
      deadline: '28 Février'
    },
    {
      id: 2,
      title: 'Boire 2.5L d\'eau par jour',
      description: 'Maintenir une hydratation optimale',
      progress: 100,
      current: 2.5,
      target: 2.5,
      unit: 'L/jour',
      completed: true,
      deadline: 'Quotidien'
    },
    {
      id: 3,
      title: '5 séances de sport par semaine',
      description: 'Augmenter l\'activité physique',
      progress: 80,
      current: 4,
      target: 5,
      unit: 'séances',
      completed: false,
      deadline: 'Hebdomadaire'
    },
    {
      id: 4,
      title: 'Respecter le déficit calorique',
      description: 'Maintenir -300 cal/jour',
      progress: 92,
      current: 276,
      target: 300,
      unit: 'cal/jour',
      completed: false,
      deadline: 'Quotidien'
    },
    {
      id: 5,
      title: 'Dormir 8h par nuit',
      description: 'Améliorer la qualité du sommeil',
      progress: 65,
      current: 5.2,
      target: 8,
      unit: 'heures',
      completed: false,
      deadline: 'Quotidien'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Mes objectifs</span>
          </CardTitle>
          <CardDescription>
            Suivez vos objectifs personnalisés et votre progression
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {goals.map((goal) => (
              <div key={goal.id} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      {goal.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <h4 className="font-medium">{goal.title}</h4>
                      <Badge variant={goal.completed ? "default" : goal.progress >= 80 ? "secondary" : "outline"}>
                        {goal.progress}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                      <span className="text-muted-foreground">{goal.deadline}</span>
                    </div>
                  </div>
                </div>
                <Progress 
                  value={goal.progress} 
                  className={`h-2 ${goal.completed ? 'bg-green-100' : ''}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-green-700 dark:text-green-400">Objectifs atteints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800 dark:text-green-300">1/5</div>
            <p className="text-sm text-green-600 dark:text-green-400">Ce mois-ci</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-700 dark:text-blue-400">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800 dark:text-blue-300">4/5</div>
            <p className="text-sm text-blue-600 dark:text-blue-400">Progression active</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-orange-700 dark:text-orange-400">Score moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-800 dark:text-orange-300">84%</div>
            <p className="text-sm text-orange-600 dark:text-orange-400">Tous objectifs</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoalsProgress;
