import React from 'react';
import { Plus, Calculator, Clock, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import FoodItem from './FoodItem';
import { useMealIcon } from './mealIcons';
import EditMealDialog from './EditMealDialog';
import { deletePlannedMeal, duplicatePlannedMeal } from '@/api/mealOperations';

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: string;
}

interface MealCardProps {
  mealId: string;
  name: string;
  time: string;
  mealTypeId: string | null;
  kcalTarget: number;
  foods: Food[];
  onAddFood: (mealId: string) => void;
  progressColor?: string;
  highlightLastFood?: boolean;
  planId?: string;
  onMealUpdated?: () => void;
}

const calculateMealTotals = (foods: Food[]) => {
  return foods.reduce(
    (totals, food) => ({
      calories: totals.calories + food.calories,
      protein: totals.protein + food.protein,
      carbs: totals.carbs + food.carbs,
      fat: totals.fat + food.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
};

const MealCard: React.FC<MealCardProps> = ({
  mealId,
  name,
  time,
  mealTypeId,
  kcalTarget,
  foods,
  onAddFood,
  progressColor = 'bg-green-500',
  highlightLastFood = false,
  planId,
  onMealUpdated,
}) => {
  const totals = calculateMealTotals(foods);
  const progress = (totals.calories / kcalTarget) * 100;
  const mealIcon = useMealIcon(mealTypeId || name);
  const { toast } = useToast();
  const lastItemRef = React.useRef<HTMLDivElement | null>(null);
  const [showEditDialog, setShowEditDialog] = React.useState(false);

  React.useEffect(() => {
    if (highlightLastFood && lastItemRef.current) {
      lastItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightLastFood, foods.length]);

  const badgeColorMap: Record<string, string> = {
    'bg-blue-500': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'bg-pink-500': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    'bg-green-500': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  };

  return (
    <div className="bg-[#1e1e2e] text-white rounded-2xl shadow-md p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
            {mealIcon}
          </div>
          <div className="text-lg font-semibold">
            {name}
            <span className="ml-2 text-sm font-normal opacity-70">{time} – {kcalTarget} kcal</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
              Modifier le repas
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={async () => {
                try {
                  await deletePlannedMeal(mealId);
                  toast({
                    title: 'Repas supprimé',
                    description: 'Le repas a été supprimé avec succès.'
                  });
                  onMealUpdated?.();
                } catch (error) {
                  toast({
                    title: 'Erreur',
                    description: 'Impossible de supprimer le repas.',
                    variant: 'destructive'
                  });
                }
              }}
              className="text-red-600"
            >
              Supprimer
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={async () => {
                if (!planId) {
                  toast({
                    title: 'Erreur',
                    description: 'Impossible de dupliquer le repas.',
                    variant: 'destructive'
                  });
                  return;
                }
                try {
                  await duplicatePlannedMeal(mealId, planId);
                  toast({
                    title: 'Repas dupliqué',
                    description: 'Le repas a été dupliqué avec succès.'
                  });
                  onMealUpdated?.();
                } catch (error) {
                  toast({
                    title: 'Erreur',
                    description: 'Impossible de dupliquer le repas.',
                    variant: 'destructive'
                  });
                }
              }}
            >
              Dupliquer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-4">
        {foods.length > 0 && (
          <div className="text-xs grid grid-cols-6 pb-2 mb-2 border-b border-white/10 font-semibold">
            <span className="col-span-2">Aliment</span>
            <span className="text-center">g</span>
            <span className="text-center">kcal</span>
            <span className="text-center">P</span>
            <span className="text-center">G</span>
            <span className="text-center">L</span>
          </div>
        )}
        <div className="space-y-1">
          {foods.map((food, idx) => (
            <FoodItem
              key={food.id}
              food={food}
              ref={idx === foods.length - 1 ? lastItemRef : null}
              isNew={highlightLastFood && idx === foods.length - 1}
            />
          ))}
        </div>
        {foods.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            <p className="text-sm mb-2">Aucun aliment ajouté</p>
            <Button variant="ghost" size="sm" onClick={() => onAddFood(mealId)}>
              <Plus size={16} className="mr-1" /> Ajouter
            </Button>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 pt-2 space-y-2">
        <div className="flex justify-between text-sm">
          <span>{totals.calories} / {kcalTarget} kcal</span>
          <span>{totals.protein}P {totals.carbs}G {totals.fat}L</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className={`${progressColor} h-2 rounded-full transition-all`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => onAddFood(mealId)}>
            <Plus size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowEditDialog(true)}>
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500"
            onClick={async () => {
              try {
                await deletePlannedMeal(mealId);
                toast({ title: 'Repas supprimé' });
                onMealUpdated?.();
              } catch (error) {
                toast({ title: 'Erreur', description: 'Suppression impossible', variant: 'destructive' });
              }
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
        <div className="flex justify-around text-xs pt-2">
          <span className="text-green-400">Prot: {totals.protein}g</span>
          <span className="text-blue-400">Gluc: {totals.carbs}g</span>
          <span className="text-purple-400">Lip: {totals.fat}g</span>
        </div>
      </div>
      {showEditDialog && (
        <EditMealDialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          onSuccess={() => {
            setShowEditDialog(false);
            onMealUpdated?.();
          }}
          mealId={mealId}
          initialData={{
            name,
            time,
            targetCalories: kcalTarget
          }}
        />
      )}
    </div>
  );
};

export default MealCard;

