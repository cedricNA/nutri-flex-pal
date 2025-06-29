
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Database } from '@/types/supabase';

type NutritionalPlan = Database['public']['Tables']['nutrition_plans']['Row'];

interface EditPlanModalProps {
  open: boolean;
  onClose: () => void;
  plan: NutritionalPlan;
  onUpdatePlan: (plan: NutritionalPlan) => void;
}

const EditPlanModal = ({ open, onClose, plan, onUpdatePlan }: EditPlanModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'maintenance' as 'weight-loss' | 'maintenance' | 'bulk',
    target_calories: 2000,
    target_protein: 100,
    target_carbs: 250,
    target_fat: 70,
    duration: 8
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        description: plan.description || '',
        type: plan.type as 'weight-loss' | 'maintenance' | 'bulk',
        target_calories: plan.target_calories,
        target_protein: plan.target_protein,
        target_carbs: plan.target_carbs,
        target_fat: plan.target_fat,
        duration: plan.duration
      });
    }
  }, [plan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePlan({
      ...plan,
      name: formData.name,
      description: formData.description,
      type: formData.type,
      target_calories: formData.target_calories,
      target_protein: formData.target_protein,
      target_carbs: formData.target_carbs,
      target_fat: formData.target_fat,
      duration: formData.duration
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Modifier le plan</CardTitle>
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
                {(['weight-loss', 'maintenance', 'bulk'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type })}
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
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                    value={formData.target_calories}
                    onChange={(e) => setFormData({ ...formData, target_calories: parseInt(e.target.value) })}
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
                    value={formData.target_protein}
                    onChange={(e) => setFormData({ ...formData, target_protein: parseInt(e.target.value) })}
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
                    value={formData.target_carbs}
                    onChange={(e) => setFormData({ ...formData, target_carbs: parseInt(e.target.value) })}
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
                    value={formData.target_fat}
                    onChange={(e) => setFormData({ ...formData, target_fat: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600">
                Sauvegarder
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPlanModal;
