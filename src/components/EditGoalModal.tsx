
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dynamicDataService, type UserGoal } from '@/services/dynamicDataService';
import { useToast } from '@/hooks/use-toast';

interface EditGoalModalProps {
  goal: UserGoal;
  onClose: () => void;
  onGoalUpdated: () => void;
}

const EditGoalModal = ({ goal, onClose, onGoalUpdated }: EditGoalModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: goal.title,
    description: goal.description || '',
    target_value: goal.target_value,
    current_value: goal.current_value,
    unit: goal.unit,
    goal_type: goal.goal_type,
    deadline: goal.deadline ? goal.deadline.split('T')[0] : ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await dynamicDataService.updateUserGoal(goal.id, {
        ...formData,
        deadline: formData.deadline || undefined
      });
      
      toast({
        title: "Objectif mis à jour",
        description: "Votre objectif a été mis à jour avec succès."
      });
      
      onGoalUpdated();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'objectif.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier l'objectif</DialogTitle>
          <DialogDescription>
            Modifiez les détails de votre objectif.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'objectif</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Perdre 5 kg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez votre objectif en détail..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_value">Objectif cible</Label>
              <Input
                id="target_value"
                type="number"
                value={formData.target_value}
                onChange={(e) => setFormData({ ...formData, target_value: parseFloat(e.target.value) || 0 })}
                placeholder="10"
                required
                min="0"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unité</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="kg, L, séances..."
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_value">Valeur actuelle</Label>
            <Input
              id="current_value"
              type="number"
              value={formData.current_value}
              onChange={(e) => setFormData({ ...formData, current_value: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal_type">Type d'objectif</Label>
            <Select value={formData.goal_type} onValueChange={(value) => setFormData({ ...formData, goal_type: value as any })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight_loss">Perte de poids</SelectItem>
                <SelectItem value="hydration">Hydratation</SelectItem>
                <SelectItem value="exercise">Exercice</SelectItem>
                <SelectItem value="calorie_deficit">Déficit calorique</SelectItem>
                <SelectItem value="sleep">Sommeil</SelectItem>
                <SelectItem value="nutrition">Nutrition</SelectItem>
                <SelectItem value="custom">Personnalisé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Échéance (optionnel)</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditGoalModal;
