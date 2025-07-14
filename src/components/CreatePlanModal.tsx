
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateNutritionTargets } from '@/utils/nutritionUtils';
import { useAuth } from '@/hooks/useAuth';
import { generatePlanSuggestion } from '@/services/planSuggestionService';

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
  const defaultTargets = generateNutritionTargets(2200, 'maintenance');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'maintenance' as 'weight-loss' | 'maintenance' | 'bulk',
    targetCalories: defaultTargets.calories,
    targetProtein: defaultTargets.protein,
    targetCarbs: defaultTargets.carbs,
    targetFat: defaultTargets.fat,
    duration: 8
  });
  const { user } = useAuth();
  const [suggestion, setSuggestion] = useState<string>('');
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  useEffect(() => {
    const fetchSuggestion = async () => {
      if (!user || !open) return;
      setLoadingSuggestion(true);
      try {
        const text = await generatePlanSuggestion(user.id);
        setSuggestion(text);
      } catch (e) {
        console.error('Erreur lors de la génération de la suggestion:', e);
      } finally {
        setLoadingSuggestion(false);
      }
    };
    fetchSuggestion();
  }, [open, user]);

  // L'utilisateur définit manuellement ses objectifs nutritionnels, sans plan
  // prédéfini. Le type reste fixé à "maintenance" par défaut.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePlan({
      ...formData,
      isActive: false
    });
    onClose();
    const reset = generateNutritionTargets(2200, 'maintenance');
    setFormData({
      name: '',
      description: '',
      type: 'maintenance',
      targetCalories: reset.calories,
      targetProtein: reset.protein,
      targetCarbs: reset.carbs,
      targetFat: reset.fat,
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
              {loadingSuggestion && (
                <p className="text-sm text-muted-foreground">Calcul de la suggestion...</p>
              )}
              {!loadingSuggestion && suggestion && (
                <p className="text-sm text-muted-foreground">{suggestion}</p>
              )}
              
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
