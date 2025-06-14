
import React, { useState } from 'react';
import { Utensils, Flame, Droplets, TrendingDown, Minus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

interface MacroCircleProps {
  label: string;
  current: number;
  target: number;
  color: string;
  unit: string;
}

const MacroCircle = ({ label, current, target, color, unit }: MacroCircleProps) => {
  const percentage = Math.min((current / target) * 100, 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 88 88">
          <circle
            cx="44"
            cy="44"
            r="40"
            stroke="currentColor"
            strokeWidth="5"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="44"
            cy="44"
            r="40"
            stroke={color}
            strokeWidth="5"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{current}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">/{target}</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{unit}</p>
      </div>
    </div>
  );
};

const NutritionStats = () => {
  const { toast } = useToast();
  const [goal] = useState<'weight-loss' | 'maintenance' | 'bulk'>('weight-loss');
  
  const dailyStats = {
    calories: { current: 1850, target: 2200 },
    proteins: { current: 85, target: 120 },
    carbs: { current: 220, target: 275 },
    fats: { current: 65, target: 75 },
    water: { current: 6, target: 8 }
  };

  const goalConfig = {
    'weight-loss': {
      label: 'Perte de poids',
      icon: TrendingDown,
      color: 'from-red-400 to-pink-500',
      bgColor: 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
      textColor: 'text-red-600 dark:text-red-400',
      iconColor: 'text-red-600 dark:text-red-400'
    },
    'maintenance': {
      label: 'Maintien',
      icon: Minus,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    'bulk': {
      label: 'Prise de masse',
      icon: TrendingUp,
      color: 'from-orange-400 to-amber-500',
      bgColor: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      iconColor: 'text-orange-600 dark:text-orange-400'
    }
  };

  const currentGoal = goalConfig[goal];
  const GoalIcon = currentGoal.icon;

  const addWater = () => {
    toast({
      title: "Hydratation ajoutée !",
      description: "Un verre d'eau a été ajouté à votre compteur.",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">Nutrition du jour</h2>
        <div className={`flex items-center space-x-2 ${currentGoal.textColor}`}>
          <Utensils size={18} />
          <span className="text-sm font-medium hidden sm:inline">{currentGoal.label}</span>
        </div>
      </div>

      {/* Calories principales */}
      <div className={`bg-gradient-to-r ${currentGoal.bgColor} rounded-xl p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${currentGoal.color} rounded-xl flex items-center justify-center`}>
              <GoalIcon className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Calories</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Restantes: {Math.max(0, dailyStats.calories.target - dailyStats.calories.current)} kcal
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-xl md:text-2xl font-bold ${currentGoal.textColor}`}>
              {dailyStats.calories.current}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">/ {dailyStats.calories.target} kcal</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`bg-gradient-to-r ${currentGoal.color} h-2.5 rounded-full transition-all duration-1000`}
              style={{ width: `${Math.min((dailyStats.calories.current / dailyStats.calories.target) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Macronutriments */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <MacroCircle
          label="Protéines"
          current={dailyStats.proteins.current}
          target={dailyStats.proteins.target}
          color="#10B981"
          unit="g"
        />
        <MacroCircle
          label="Glucides"
          current={dailyStats.carbs.current}
          target={dailyStats.carbs.target}
          color="#3B82F6"
          unit="g"
        />
        <MacroCircle
          label="Lipides"
          current={dailyStats.fats.current}
          target={dailyStats.fats.target}
          color="#F59E0B"
          unit="g"
        />
      </div>

      {/* Hydratation */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Droplets className="text-white" size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Hydratation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{dailyStats.water.current} / {dailyStats.water.target} verres</p>
            </div>
          </div>
          <Button 
            className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
            onClick={addWater}
          >
            + Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NutritionStats;
