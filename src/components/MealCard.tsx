import React from 'react';
import { Plus, Calculator, Clock, Pencil, Trash2, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import FoodItem from './FoodItem';
import { useMealIcon } from './mealIcons';
import EditMealDialog from './EditMealDialog';
import { deletePlannedMeal } from '@/api/mealOperations';

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


  return (
    <div className="bg-[#1e1e2e] text-white rounded-2xl shadow-md p-4 space-y-4 relative">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
            {mealIcon}
          </div>
          <span>{name}</span>
        </div>
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <Clock size={12} />
          <span>{time}</span>
        </div>
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <Flame size={12} />
          <span>Objectif : {kcalTarget} kcal</span>
        </div>
        <div className="text-xs flex items-center gap-1">
          <Calculator size={12} />
          <span>{totals.calories} / {kcalTarget} kcal ({Math.round(progress)}%)</span>
        </div>
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
        <div className="flex justify-between text-sm font-medium">
          <span>{totals.calories} kcal</span>
          <span>{totals.protein}g P | {totals.carbs}g G | {totals.fat}g L</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
          <div
            className={`${progressColor} h-1 rounded-full transition-all`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-around text-xs pt-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-green-400 cursor-help">Prot: {totals.protein}g</span>
              </TooltipTrigger>
              <TooltipContent>Protéines</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-blue-400 cursor-help">Gluc: {totals.carbs}g</span>
              </TooltipTrigger>
              <TooltipContent>Glucides</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-purple-400 cursor-help">Lip: {totals.fat}g</span>
              </TooltipTrigger>
              <TooltipContent>Lipides</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="absolute bottom-3 right-3 flex gap-2">
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

