
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Wrench, Trash2, CheckCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { nutritionPlanService } from '@/services/nutritionPlanService';
import { useToast } from "@/hooks/use-toast";
import CreatePlanModal from './CreatePlanModal';
import EditPlanModal from './EditPlanModal';
import ActivePlanCard from './ActivePlanCard';
import type { Database } from '@/types/supabase';

type NutritionalPlan = Database['public']['Tables']['nutrition_plans']['Row'];

interface NewPlan {
  name: string;
  description: string;
  type: 'weight-loss' | 'maintenance' | 'bulk';
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  duration: number;
  isActive: boolean;
}

const PlanManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<NutritionalPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<NutritionalPlan | null>(null);

  const planTypeConfig = {
    'weight-loss': {
      label: 'Perte de poids',
      color: 'from-red-400 to-pink-500',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700'
    },
    'maintenance': {
      label: 'Maintien',
      color: 'from-green-400 to-blue-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    },
    'bulk': {
      label: 'Prise de masse',
      color: 'from-blue-400 to-purple-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    }
  };

  const loadPlans = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const userPlans = await nutritionPlanService.getUserPlans(user.id);
      setPlans(userPlans);
    } catch (error) {
      console.error('Error loading plans:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos plans nutritionnels.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const activatePlan = async (planId: string) => {
    if (!user) return;

    try {
      await nutritionPlanService.activatePlan(user.id, planId);
      await loadPlans();
      toast({
        title: "Plan activé",
        description: "Le plan nutritionnel a été activé avec succès.",
      });
    } catch (error) {
      console.error('Error activating plan:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'activer le plan.",
        variant: "destructive"
      });
    }
  };

  const deletePlan = async (planId: string) => {
    try {
      await nutritionPlanService.deletePlan(planId);
      await loadPlans();
      toast({
        title: "Plan supprimé",
        description: "Le plan nutritionnel a été supprimé.",
      });
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le plan.",
        variant: "destructive"
      });
    }
  };

  const duplicatePlan = async (plan: NutritionalPlan) => {
    if (!user) return;

    try {
      const newPlan = {
        name: `${plan.name} (Copie)`,
        description: plan.description,
        type: plan.type,
        target_calories: plan.target_calories,
        target_protein: plan.target_protein,
        target_carbs: plan.target_carbs,
        target_fat: plan.target_fat,
        duration: plan.duration,
        is_active: false
      };

      await nutritionPlanService.createPlan(user.id, newPlan);
      await loadPlans();
      toast({
        title: "Plan dupliqué",
        description: "Le plan a été copié avec succès.",
      });
    } catch (error) {
      console.error('Error duplicating plan:', error);
      toast({
        title: "Erreur",
        description: "Impossible de dupliquer le plan.",
        variant: "destructive"
      });
    }
  };

  const createPlan = async (newPlan: NewPlan) => {
    if (!user) return;

    try {
      await nutritionPlanService.createPlan(user.id, {
        name: newPlan.name,
        description: newPlan.description,
        type: newPlan.type,
        target_calories: newPlan.targetCalories,
        target_protein: newPlan.targetProtein,
        target_carbs: newPlan.targetCarbs,
        target_fat: newPlan.targetFat,
        duration: newPlan.duration,
        is_active: newPlan.isActive,
      });
      await loadPlans();
      toast({
        title: "Plan créé",
        description: "Le nouveau plan nutritionnel a été créé.",
      });
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le plan.",
        variant: "destructive"
      });
    }
  };

  const updatePlan = async (updatedPlan: NutritionalPlan) => {
    try {
      await nutritionPlanService.updatePlan(updatedPlan.id, updatedPlan);
      await loadPlans();
      toast({
        title: "Plan modifié",
        description: "Le plan nutritionnel a été mis à jour.",
      });
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le plan.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Plans alimentaires</h2>
            <p className="text-muted-foreground">Chargement de vos plans...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Plans alimentaires</h2>
          <p className="text-muted-foreground">Gérez vos plans personnalisés selon vos objectifs</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-green-500 hover:bg-green-600">
          <Plus className="mr-2" size={16} />
          Nouveau plan
        </Button>
      </div>

      {/* Plan actif */}
      {plans.find(plan => plan.is_active) && (
        <ActivePlanCard plan={plans.find(plan => plan.is_active)!} />
      )}

      {/* Liste des autres plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.filter(plan => !plan.is_active).map((plan) => {
          const config = planTypeConfig[plan.type as keyof typeof planTypeConfig];
          return (
            <Card key={plan.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 bg-gradient-to-r ${config.color} rounded-xl flex items-center justify-center`}>
                    <span className="text-white text-lg font-bold">{plan.name[0]}</span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => activatePlan(plan.id)}
                      className="h-8 w-8 text-green-500 hover:text-green-700"
                    >
                      <CheckCircle size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingPlan(plan)}
                      className="h-8 w-8"
                    >
                      <Wrench size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePlan(plan.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                <div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <Badge variant="secondary" className="bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300 mt-2">
                    {config.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Calories:</span>
                    <span className="font-medium">{plan.target_calories} kcal</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Protéines:</span>
                    <span className="font-medium">{plan.target_protein}g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Glucides:</span>
                    <span className="font-medium">{plan.target_carbs}g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Lipides:</span>
                    <span className="font-medium">{plan.target_fat}g</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {plan.duration} semaines
                  </div>
                  <span>Créé le {new Date(plan.created_at!).toLocaleDateString('fr-FR')}</span>
                </div>

              </CardContent>
            </Card>
          );
        })}
      </div>

      {plans.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">Aucun plan nutritionnel créé</p>
            <Button onClick={() => setShowCreateModal(true)} className="bg-green-500 hover:bg-green-600">
              <Plus className="mr-2" size={16} />
              Créer votre premier plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <CreatePlanModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreatePlan={createPlan}
      />

      {editingPlan && (
        <EditPlanModal
          open={!!editingPlan}
          onClose={() => setEditingPlan(null)}
          plan={editingPlan}
          onUpdatePlan={updatePlan}
        />
      )}
    </div>
  );
};

export default PlanManager;
