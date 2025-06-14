
import React from 'react';

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

const FoodItem = ({ food }: { food: Food }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
    <div className="flex-1">
      <h4 className="font-medium text-gray-900 dark:text-gray-100">{food.name}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {food.quantity} {food.unit}
      </p>
    </div>
    <div className="text-right">
      <p className="font-semibold text-gray-900 dark:text-gray-100">{food.calories} kcal</p>
    </div>
  </div>
);

export default FoodItem;
