import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Drumstick, Sandwich, Nut, Pencil, CheckCircle, Trash2 } from 'lucide-react';
import type { Database } from '@/types/supabase';
import { planColors, PlanType } from '@/utils/planColors';
import { differenceInWeeks } from 'date-fns';

type NutritionPlan = Database['public']['Tables']['nutrition_plans']['Row'];

interface NutritionPlanCardProps {
  plan: NutritionPlan;
  onEdit?: (plan: NutritionPlan) => void;
  onActivate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const NutritionPlanCard = ({ plan, onEdit, onActivate, onDelete }: NutritionPlanCardProps) => {
  const colors = planColors[plan.type as PlanType] || planColors.maintenance;
  const weeksAgo = plan.created_at ? differenceInWeeks(new Date(), new Date(plan.created_at)) : 0;

  return (
    <div className="bg-[#1e1e2e] text-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
      <div className={`px-4 py-2 flex items-center justify-between ${colors.card} rounded-t-2xl`}> 
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold">{plan.name}</span>
          {plan.is_active && <Badge className={`${colors.badge} text-white`}>Actif</Badge>}
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={() => onEdit(plan)} className="h-8 w-8 text-white/80 hover:text-white">
              <Pencil size={14} />
            </Button>
          )}
          {onActivate && (
            <Button variant="ghost" size="icon" onClick={() => onActivate(plan.id)} className="h-8 w-8 text-green-400 hover:text-green-300">
              <CheckCircle size={14} />
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="icon" onClick={() => onDelete(plan.id)} className="h-8 w-8 text-red-400 hover:text-red-300">
              <Trash2 size={14} />
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-2 flex-1">
        {plan.description && <p className="text-sm text-white/80">{plan.description}</p>}
        {plan.created_at && (
          <p className="text-xs text-white/60">Créé il y a {weeksAgo} semaine{weeksAgo > 1 ? 's' : ''}</p>
        )}
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge className="bg-white/10 text-white flex items-center gap-1">
            <Zap className="h-3 w-3" /> {plan.target_calories} kcal
          </Badge>
          <Badge className="bg-white/10 text-white flex items-center gap-1">
            <Drumstick className="h-3 w-3" /> {plan.target_protein}g prot
          </Badge>
          <Badge className="bg-white/10 text-white flex items-center gap-1">
            <Sandwich className="h-3 w-3" /> {plan.target_carbs}g gluc
          </Badge>
          <Badge className="bg-white/10 text-white flex items-center gap-1">
            <Nut className="h-3 w-3" /> {plan.target_fat}g lip
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default NutritionPlanCard;
