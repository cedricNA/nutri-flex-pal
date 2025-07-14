import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Drumstick, Sandwich, Nut, Trash2 } from 'lucide-react';
import type { Database } from '@/types/supabase';
import { planColors, PlanType } from '@/utils/planColors';

type NutritionPlan = Database['public']['Tables']['nutrition_plans']['Row'];

interface ActivePlanCardProps {
  plan: NutritionPlan;
  onDelete?: (id: string) => void;
}

const ActivePlanCard = ({ plan, onDelete }: ActivePlanCardProps) => {
  const colors = planColors[plan.type as PlanType] || planColors.maintenance;
  return (
    <div className={`${colors.card} text-white rounded-xl shadow-md p-6 space-y-4`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <div className="flex items-center gap-2">
          <Badge className={`${colors.badge} text-white py-0.5 px-2 text-xs`}>Actif</Badge>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(plan.id)}
              className="h-8 w-8 text-white/80 hover:text-red-300"
            >
              <Trash2 size={14} />
            </Button>
          )}
        </div>
      </div>
      {plan.description && <p className="text-sm">{plan.description}</p>}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-1">
          <Zap className="w-4 h-4" />
          <span>{plan.target_calories} kcal</span>
        </div>
        <div className="flex items-center space-x-1">
          <Drumstick className="w-4 h-4" />
          <span>{plan.target_protein}g</span>
        </div>
        <div className="flex items-center space-x-1">
          <Sandwich className="w-4 h-4" />
          <span>{plan.target_carbs}g</span>
        </div>
        <div className="flex items-center space-x-1">
          <Nut className="w-4 h-4" />
          <span>{plan.target_fat}g</span>
        </div>
      </div>
    </div>
  );
};

export default ActivePlanCard;
