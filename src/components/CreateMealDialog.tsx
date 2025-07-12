import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createMeal } from '@/api/meals';

interface CreateMealDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  planId: string;
}

const CreateMealDialog: React.FC<CreateMealDialogProps> = ({
  open,
  onClose,
  onSuccess,
  planId
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    time: '12:00',
    targetCalories: '400',
    mealType: ''
  });

  const mealTypes = [
    { value: 'breakfast', label: 'Petit-déjeuner' },
    { value: 'lunch', label: 'Déjeuner' },
    { value: 'dinner', label: 'Dîner' },
    { value: 'snack', label: 'Collation' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createMeal(
        formData.name,
        formData.time,
        parseInt(formData.targetCalories),
        planId,
        formData.mealType
      );

      toast({
        title: 'Repas créé',
        description: 'Le nouveau repas a été ajouté avec succès.'
      });

      onSuccess?.();
      onClose();
      setFormData({
        name: '',
        time: '12:00',
        targetCalories: '400',
        mealType: ''
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le repas.',
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
          <DialogTitle>Créer un nouveau repas</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom du repas</Label>
            <Input
              id="name"
              placeholder="Ex: Goûter de l'après-midi"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="mealType">Type de repas</Label>
            <Select 
              value={formData.mealType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, mealType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un type de repas" />
              </SelectTrigger>
              <SelectContent>
                {mealTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              placeholder="Ex: 400"
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
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMealDialog;