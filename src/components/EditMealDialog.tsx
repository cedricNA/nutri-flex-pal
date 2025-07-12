import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updatePlannedMeal } from '@/api/mealOperations';

interface EditMealDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mealId: string;
  initialData: {
    name: string;
    time: string;
    targetCalories: number;
  };
}

const EditMealDialog: React.FC<EditMealDialogProps> = ({
  open,
  onClose,
  onSuccess,
  mealId,
  initialData
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData.name,
    time: initialData.time,
    targetCalories: initialData.targetCalories.toString()
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updatePlannedMeal(mealId, {
        name: formData.name,
        meal_time: formData.time,
        target_calories: parseInt(formData.targetCalories)
      });

      toast({
        title: 'Repas modifié',
        description: 'Le repas a été mis à jour avec succès.'
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le repas.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le repas</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom du repas</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="time">Heure</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="calories">Objectif calorique</Label>
            <Input
              id="calories"
              type="number"
              value={formData.targetCalories}
              onChange={(e) => setFormData(prev => ({ ...prev, targetCalories: e.target.value }))}
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Modification...' : 'Modifier'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMealDialog;