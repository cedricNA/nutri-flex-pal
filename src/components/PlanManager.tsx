
import React, { useState } from 'react';
import { Plus, Settings, Trash2, Copy, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CreatePlanModal from './CreatePlanModal';
import EditPlanModal from './EditPlanModal';

interface NutritionalPlan {
  id: string;
  name: string;
  description: string;
  type: 'weight-loss' | 'maintenance' | 'bulk';
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  isActive: boolean;
  createdAt: string;
  duration: number; // en semaines
}

const PlanManager = () => {
  const [plans, setPlans] = useState<NutritionalPlan[]>([
    {
      id: '1',
      name: 'Perte de poids été',
      description: 'Plan hypocalorique pour perdre 5kg avant l\'été',
      type: 'weight-loss',
      targetCalories: 1800,
      targetProtein: 120,
      targetCarbs: 180,
      targetFat: 60,
      isActive: true,
      createdAt: '2024-01-15',
      duration: 12
    },
    {
      id: '2',
      name: 'Maintien forme',
      description: 'Plan équilibré pour maintenir le poids actuel',
      type: 'maintenance',
      targetCalories: 2200,
      targetProtein: 110,
      targetCarbs: 275,
      targetFat: 75,
      isActive: false,
      createdAt: '2024-02-01',
      duration: 8
    },
    {
      id: '3',
      name: 'Prise de masse',
      description: 'Plan hypercalorique pour gagner du muscle',
      type: 'bulk',
      targetCalories: 2800,
      targetProtein: 150,
      targetCarbs: 350,
      targetFat: 90,
      isActive: false,
      createdAt: '2024-03-01',
      duration: 16
    }
  ]);

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

  const activatePlan = (planId: string) => {
    setPlans(plans.map(plan => ({
      ...plan,
      isActive: plan.id === planId
    })));
  };

  const deletePlan = (planId: string) => {
    setPlans(plans.filter(plan => plan.id !== planId));
  };

  const duplicatePlan = (plan: NutritionalPlan) => {
    const newPlan = {
      ...plan,
      id: Date.now().toString(),
      name: `${plan.name} (Copie)`,
      isActive: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPlans([...plans, newPlan]);
  };

  const createPlan = (newPlan: Omit<NutritionalPlan, 'id' | 'createdAt'>) => {
    const plan: NutritionalPlan = {
      ...newPlan,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPlans([...plans, plan]);
  };

  const updatePlan = (updatedPlan: NutritionalPlan) => {
    setPlans(plans.map(plan => plan.id === updatedPlan.id ? updatedPlan : plan));
  };

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
      {plans.find(plan => plan.isActive) && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-800">Plan actuel</CardTitle>
              <Badge variant="default" className="bg-green-500">Actif</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              const activePlan = plans.find(plan => plan.isActive)!;
              const config = planTypeConfig[activePlan.type];
              return (
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${config.color} rounded-2xl flex items-center justify-center`}>
                    <Target className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-800">{activePlan.name}</h3>
                    <p className="text-green-600 text-sm">{activePlan.description}</p>
                    <div className="flex space-x-4 mt-2 text-sm text-green-700">
                      <span>{activePlan.targetCalories} kcal</span>
                      <span>P: {activePlan.targetProtein}g</span>
                      <span>G: {activePlan.targetCarbs}g</span>
                      <span>L: {activePlan.targetFat}g</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Liste des plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const config = planTypeConfig[plan.type];
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
                      onClick={() => setEditingPlan(plan)}
                      className="h-8 w-8"
                    >
                      <Settings size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => duplicatePlan(plan)}
                      className="h-8 w-8"
                    >
                      <Copy size={14} />
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
                  <Badge variant="secondary" className={`${config.bgColor} ${config.textColor} mt-2`}>
                    {config.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Calories:</span>
                    <span className="font-medium">{plan.targetCalories} kcal</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Protéines:</span>
                    <span className="font-medium">{plan.targetProtein}g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Glucides:</span>
                    <span className="font-medium">{plan.targetCarbs}g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Lipides:</span>
                    <span className="font-medium">{plan.targetFat}g</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {plan.duration} semaines
                  </div>
                  <span>Créé le {new Date(plan.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>

                {!plan.isActive && (
                  <Button
                    onClick={() => activatePlan(plan.id)}
                    className="w-full"
                    variant="outline"
                  >
                    Activer ce plan
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

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
