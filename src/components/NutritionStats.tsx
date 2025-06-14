
import React from 'react';
import { Utensils, Flame, Droplets } from 'lucide-react';

interface MacroCircleProps {
  label: string;
  current: number;
  target: number;
  color: string;
  unit: string;
}

const MacroCircle = ({ label, current, target, color, unit }: MacroCircleProps) => {
  const percentage = Math.min((current / target) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={color}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-gray-900">{current}</span>
          <span className="text-xs text-gray-500">/{target}</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{unit}</p>
      </div>
    </div>
  );
};

const NutritionStats = () => {
  const dailyStats = {
    calories: { current: 1850, target: 2200 },
    proteins: { current: 85, target: 120 },
    carbs: { current: 220, target: 275 },
    fats: { current: 65, target: 75 },
    water: { current: 6, target: 8 }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Nutrition du jour</h2>
        <div className="flex items-center space-x-2 text-green-600">
          <Utensils size={20} />
          <span className="text-sm font-medium">Objectif: Maintien</span>
        </div>
      </div>

      {/* Calories principales */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Flame className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Calories</h3>
              <p className="text-sm text-gray-600">Restantes: {dailyStats.calories.target - dailyStats.calories.current} kcal</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-600">{dailyStats.calories.current}</p>
            <p className="text-sm text-gray-500">/ {dailyStats.calories.target} kcal</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((dailyStats.calories.current / dailyStats.calories.target) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Macronutriments */}
      <div className="grid grid-cols-3 gap-6 mb-6">
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
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Droplets className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Hydratation</h3>
              <p className="text-sm text-gray-600">{dailyStats.water.current} / {dailyStats.water.target} verres</p>
            </div>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition">
            + Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default NutritionStats;
