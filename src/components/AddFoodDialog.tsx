import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFoods } from '@/hooks/useFoods';
import { useFoodGroups } from '@/hooks/useFoodGroups';
import { useToast } from '@/hooks/use-toast';
import type { FoodClean } from '@/types/supabase';

interface AddFoodDialogProps {
  open: boolean;
  mealId: string;
  mealName: string;
  onClose: () => void;
  onAddFood: (mealId: string, foodId: string, grams: number) => Promise<void> | void;
}

const AddFoodDialog = ({ open, mealId, mealName, onClose, onAddFood }: AddFoodDialogProps) => {
  const [search, setSearch] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [group, setGroup] = useState('all');
  const { groups } = useFoodGroups();
  const { foods, loading } = useFoods({ search, group: group === 'all' ? '' : group });
  const { toast } = useToast();

  const handleAdd = async (food: FoodClean) => {
    try {
      if (!mealName) {
        console.error('mealName is undefined when adding food');
        toast({
          title: 'Erreur',
          description: 'Le repas cible est introuvable.',
          variant: 'destructive'
        });
        return;
      }

      await onAddFood(mealId, food.id, quantity);
      toast({ title: 'Aliment ajouté', description: `${food.name_fr} ajouté à ${mealName}.` });
      onClose();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible d'ajouter l'aliment.",
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={open ? onClose : undefined}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter un aliment à {mealName}</DialogTitle>
          <DialogDescription>Sélectionnez un aliment et la quantité à ajouter.</DialogDescription>
        </DialogHeader>
        <Select value={group} onValueChange={setGroup}>
          <SelectTrigger className="mb-4">
            <SelectValue placeholder="Choisir un groupe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {groups.map((g) => (
              <SelectItem key={g} value={g}>{g}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Rechercher un aliment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />
        <div className="flex items-center space-x-2 mb-4">
          <label className="text-sm">Quantité (g)</label>
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-24"
          />
        </div>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {loading && <p>Chargement...</p>}
          {!loading && foods.map((food) => (
            <div key={food.id} className="flex items-center justify-between p-2 border rounded-md">
              <div>
                <p className="font-medium">{food.name_fr}</p>
                <p className="text-xs text-gray-500">{food.kcal} kcal / 100g</p>
              </div>
              <Button size="sm" onClick={() => handleAdd(food)}>Ajouter</Button>
            </div>
          ))}
          {!loading && foods.length === 0 && (
            <p className="text-sm text-center text-gray-500">Aucun aliment trouvé.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodDialog;
