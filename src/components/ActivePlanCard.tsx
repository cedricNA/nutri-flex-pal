import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Zap, Drumstick, Sandwich, Nut } from 'lucide-react';
import type { Database } from '@/types/supabase';

type NutritionPlan = Database['public']['Tables']['nutrition_plans']['Row'];

interface ActivePlanCardProps {
  plan: NutritionPlan;
}

const ActivePlanCard = ({ plan }: ActivePlanCardProps) => {
  return (
    <div className="bg-blue-900 text-white rounded-xl shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <Badge className="bg-green-500 text-white py-0.5 px-2 text-xs">Actif</Badge>
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
