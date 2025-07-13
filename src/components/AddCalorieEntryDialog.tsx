import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { calorieService } from '@/services/supabaseServices';

interface AddCalorieEntryDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddCalorieEntryDialog: React.FC<AddCalorieEntryDialogProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    consumed: '',
    target: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await calorieService.addCalorieEntry(
        user.id,
        parseInt(formData.consumed),
        parseInt(formData.target),
        new Date(formData.date)
      );

      toast({
        title: 'Entrée ajoutée',
        description: 'Votre entrée calorique a été enregistrée avec succès.'
      });

      onSuccess?.();
      onClose();
      setFormData({
        consumed: '',
        target: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible d'ajouter l'entrée calorique.",
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
          <DialogTitle>Ajouter une entrée calorique</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="consumed">Calories consommées</Label>
            <Input
              id="consumed"
              type="number"
              placeholder="Ex: 1800"
              value={formData.consumed}
              onChange={(e) => setFormData(prev => ({ ...prev, consumed: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="target">Objectif calorique</Label>
            <Input
              id="target"
              type="number"
              placeholder="Ex: 2200"
              value={formData.target}
              onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Ajout...' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCalorieEntryDialog;