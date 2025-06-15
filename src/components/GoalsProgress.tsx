
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Target, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { dynamicDataService, type UserGoal } from '@/services/dynamicDataService';
import { useToast } from '@/hooks/use-toast';
import CreateGoalModal from './CreateGoalModal';
import EditGoalModal from './EditGoalModal';

const GoalsProgress = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<UserGoal | null>(null);

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userGoals = await dynamicDataService.getUserGoals(user.id);
      setGoals(userGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos objectifs.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (goal: UserGoal): number => {
    if (goal.target_value === 0) return 0;
    return Math.min(Math.round((goal.current_value / goal.target_value) * 100), 100);
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await dynamicDataService.deleteUserGoal(goalId);
      setGoals(goals.filter(g => g.id !== goalId));
      toast({
        title: "Objectif supprimé",
        description: "L'objectif a été supprimé avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'objectif.",
        variant: "destructive"
      });
    }
  };

  const handleGoalCreated = () => {
    setShowCreateModal(false);
    loadGoals();
  };

  const handleGoalUpdated = () => {
    setEditingGoal(null);
    loadGoals();
  };

  const completedGoals = goals.filter(g => calculateProgress(g) >= 100).length;
  const averageProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, goal) => sum + calculateProgress(goal), 0) / goals.length)
    : 0;

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes objectifs</CardTitle>
          <CardDescription>
            Connectez-vous pour voir vos objectifs personnalisés
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Mes objectifs</span>
              </CardTitle>
              <CardDescription>
                Suivez vos objectifs personnalisés et votre progression
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel objectif
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Chargement de vos objectifs...</div>
          ) : goals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun objectif défini</h3>
              <p className="text-gray-600 mb-4">
                Créez votre premier objectif pour commencer à suivre vos progrès
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un objectif
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {goals.map((goal) => {
                const progress = calculateProgress(goal);
                const isCompleted = progress >= 100;
                
                return (
                  <div key={goal.id} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center space-x-2">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                          <h4 className="font-medium">{goal.title}</h4>
                          <Badge variant={isCompleted ? "default" : progress >= 80 ? "secondary" : "outline"}>
                            {progress}%
                          </Badge>
                        </div>
                        {goal.description && (
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {goal.current_value} / {goal.target_value} {goal.unit}
                          </span>
                          {goal.deadline && (
                            <span className="text-muted-foreground">
                              Échéance: {new Date(goal.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingGoal(goal)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Progress 
                      value={progress} 
                      className={`h-2 ${isCompleted ? 'bg-green-100' : ''}`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-green-700 dark:text-green-400">Objectifs atteints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800 dark:text-green-300">
              {completedGoals}/{goals.length}
            </div>
            <p className="text-sm text-green-600 dark:text-green-400">Ce mois-ci</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-700 dark:text-blue-400">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800 dark:text-blue-300">
              {goals.length - completedGoals}/{goals.length}
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400">Progression active</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-orange-700 dark:text-orange-400">Score moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-800 dark:text-orange-300">{averageProgress}%</div>
            <p className="text-sm text-orange-600 dark:text-orange-400">Tous objectifs</p>
          </CardContent>
        </Card>
      </div>

      {showCreateModal && (
        <CreateGoalModal
          onClose={() => setShowCreateModal(false)}
          onGoalCreated={handleGoalCreated}
        />
      )}

      {editingGoal && (
        <EditGoalModal
          goal={editingGoal}
          onClose={() => setEditingGoal(null)}
          onGoalUpdated={handleGoalUpdated}
        />
      )}
    </div>
  );
};

export default GoalsProgress;
