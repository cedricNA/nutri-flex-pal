import React from 'react';
import { Plus, Calculator, Info, Clock, MoreVertical } from 'lucide-react';
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
  isShowingMacros: boolean;
  onToggleMacros: (mealId: string) => void;
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
  isShowingMacros,
  onToggleMacros,
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
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl hover:scale-102 group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#3b0764] via-[#312e81] to-[#0f172a] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
            {mealIcon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{name}</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock size={14} />
              <span>{time}</span>
            </div>
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

      <div className="space-y-3 mb-6">
        {foods.map((food, idx) => (
          <FoodItem
            key={food.id}
            food={food}
            ref={idx === foods.length - 1 ? lastItemRef : null}
            isNew={highlightLastFood && idx === foods.length - 1}
          />
        ))}
        {foods.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calculator size={28} className="opacity-50" />
            </div>
            <p className="text-lg font-medium mb-2">Aucun aliment ajouté</p>
            <p className="text-sm mb-4">Commencez par ajouter des aliments à votre repas</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="bg-gradient-to-br from-[#3b0764] via-[#312e81] to-[#0f172a] text-white px-6 py-2 rounded-xl hover:brightness-110 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    onClick={() => onAddFood(mealId)}
                  >
                    <Plus size={16} className="mr-2" />
                    Ajouter un aliment
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ajouter un aliment à votre {name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

      <div className="border-t dark:border-gray-700 pt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Progression
          </span>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Objectif : {kcalTarget} kcal
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {totals.calories} kcal
              </div>
            </div>
            {foods.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => onToggleMacros(mealId)}
                    >
                      <Info size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Voir les macronutriments</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`${progressColor} h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
        
        {progress > 0 && (
          <div className="flex justify-center mt-2">
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${badgeColorMap[progressColor]}`}
            >
              {Math.round(progress)}% complété
            </span>
          </div>
        )}
        
        {isShowingMacros && (
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t dark:border-gray-700 animate-fade-in">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{totals.protein}g</div>
              <div className="text-xs text-green-600 dark:text-green-400">Protéines</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{totals.carbs}g</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Glucides</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{totals.fat}g</div>
              <div className="text-xs text-purple-600 dark:text-purple-400">Lipides</div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={() => onAddFood(mealId)}>
            <Plus size={16} className="mr-2" />
            Ajouter un aliment
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

