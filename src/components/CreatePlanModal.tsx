
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CreatePlanModalProps {
  open: boolean;
  onClose: () => void;
  onCreatePlan: (plan: {
    name: string;
    description: string;
    type: 'weight-loss' | 'maintenance' | 'bulk';
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFat: number;
    isActive: boolean;
    duration: number;
  }) => void;
}

const CreatePlanModal = ({ open, onClose, onCreatePlan }: CreatePlanModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'maintenance' as 'weight-loss' | 'maintenance' | 'bulk',
    targetCalories: 2000,
    targetProtein: 100,
    targetCarbs: 250,
    targetFat: 70,
    duration: 8
  });

  const planTemplates = {
    'weight-loss': {
      name: 'Plan perte de poids',
      description: 'Déficit calorique contrôlé pour perdre du poids sainement',
      targetCalories: 1800,
      targetProtein: 120,
      targetCarbs: 180,
      targetFat: 60
    },
    'maintenance': {
      name: 'Plan maintien',
      description: 'Équilibre nutritionnel pour maintenir le poids actuel',
      targetCalories: 2200,
      targetProtein: 110,
      targetCarbs: 275,
      targetFat: 75
    },
    'bulk': {
      name: 'Plan prise de masse',
      description: 'Surplus calorique pour favoriser la croissance musculaire',
      targetCalories: 2800,
      targetProtein: 150,
      targetCarbs: 350,
      targetFat: 90
    }
  };

  const handleTypeChange = (type: 'weight-loss' | 'maintenance' | 'bulk') => {
    const template = planTemplates[type];
    setFormData({
      ...formData,
      type,
      name: template.name,
      description: template.description,
      targetCalories: template.targetCalories,
      targetProtein: template.targetProtein,
      targetCarbs: template.targetCarbs,
      targetFat: template.targetFat
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePlan({
      ...formData,
      isActive: false
    });
    onClose();
    setFormData({
      name: '',
      description: '',
      type: 'maintenance',
      targetCalories: 2000,
      targetProtein: 100,
      targetCarbs: 250,
      targetFat: 70,
      duration: 8
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Créer un nouveau plan</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type de plan */}
            <div className="space-y-3">
              <Label>Type de plan</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(Object.keys(planTemplates) as Array<keyof typeof planTemplates>).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeChange(type)}
                    className={`p-4 rounded-lg border text-left transition ${
                      formData.type === type
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">
                      {type === 'weight-loss' && 'Perte de poids'}
                      {type === 'maintenance' && 'Maintien'}
                      {type === 'bulk' && 'Prise de masse'}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {planTemplates[type].description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Informations générales */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du plan</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Mon plan personnalisé"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez votre objectif..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="duration">Durée (semaines)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="52"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            {/* Objectifs nutritionnels */}
            <div className="space-y-4">
              <h3 className="font-semibold">Objectifs nutritionnels</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="calories">Calories (kcal)</Label>
                  <Input
                    id="calories"
                    type="number"
                    min="1000"
                    max="5000"
                    value={formData.targetCalories}
                    onChange={(e) => setFormData({ ...formData, targetCalories: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="protein">Protéines (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    min="50"
                    max="300"
                    value={formData.targetProtein}
                    onChange={(e) => setFormData({ ...formData, targetProtein: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="carbs">Glucides (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    min="50"
                    max="500"
                    value={formData.targetCarbs}
                    onChange={(e) => setFormData({ ...formData, targetCarbs: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="fat">Lipides (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    min="20"
                    max="200"
                    value={formData.targetFat}
                    onChange={(e) => setFormData({ ...formData, targetFat: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Résumé */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Résumé du plan</h4>
              <div className="text-sm space-y-1">
                <div>Total calories: {formData.targetCalories} kcal</div>
                <div>
                  Répartition: {Math.round((formData.targetProtein * 4 / formData.targetCalories) * 100)}% protéines, {' '}
                  {Math.round((formData.targetCarbs * 4 / formData.targetCalories) * 100)}% glucides, {' '}
                  {Math.round((formData.targetFat * 9 / formData.targetCalories) * 100)}% lipides
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600">
                Créer le plan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePlanModal;
