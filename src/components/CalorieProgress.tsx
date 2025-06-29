import React from 'react';

interface CalorieProgressProps {
  currentCalories: number;
  targetCalories: number;
}

const CalorieProgress: React.FC<CalorieProgressProps> = ({ currentCalories, targetCalories }) => {
  const percentage = targetCalories > 0 ? Math.min(Math.round((currentCalories / targetCalories) * 100), 100) : 0;

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {currentCalories} / {targetCalories} kcal ({percentage}%)
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export default CalorieProgress;
