import React, { useState } from 'react';
import { Utensils, Droplets, TrendingDown, Minus, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useNutritionStats } from '../hooks/useNutritionStats';
import MacroIcons from './MacroIcons';


const NutritionStats = () => {
  const { toast } = useToast();
  const [goal] = useState<'weight-loss' | 'maintenance' | 'bulk'>('weight-loss');
  const { stats, addWater } = useNutritionStats();

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

  const handleAddWater = () => {
    addWater();
    toast({
      title: "Hydratation ajoutée !",
      description: "Un verre d'eau a été ajouté à votre compteur.",
    });
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 space-y-6 hover:shadow-lg transition-all duration-200">
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
                Restantes: {Math.max(0, stats.calories.target - stats.calories.current)} kcal
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-xl md:text-2xl font-bold ${currentGoal.textColor}`}>
              {stats.calories.current}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">/ {stats.calories.target} kcal</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`bg-gradient-to-r ${currentGoal.color} h-2.5 rounded-full transition-all duration-1000`}
              style={{ width: `${Math.min((stats.calories.current / stats.calories.target) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Macronutriments */}
      <MacroIcons
        proteins={stats.proteins}
        carbs={stats.carbs}
        fats={stats.fats}
      />

      {/* Hydratation */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Droplets className="text-white" size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Hydratation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stats.water.current} / {stats.water.target} verres</p>
            </div>
          </div>
          <Button
            className="px-4 py-2 rounded-md font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-500 shadow hover:brightness-110 transition cursor-pointer border border-blue-400/20 group-hover:scale-105"
            onClick={handleAddWater}
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NutritionStats;
