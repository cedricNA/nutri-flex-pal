
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

interface FoodItemProps {
  food: Food;
  isNew?: boolean;
}

const FoodItem = React.forwardRef<HTMLDivElement, FoodItemProps>(({ food, isNew }, ref) => (
  <div
    ref={ref}
    className={`grid grid-cols-6 items-center text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
      isNew ? 'animate-fade-in animate-scale-in' : ''
    }`}
  >
    <span className="col-span-2 font-medium text-gray-900 dark:text-gray-100">{food.name}</span>
    <span className="text-center text-gray-600 dark:text-gray-400">{food.quantity}g</span>
    <span className="text-center font-semibold">{food.calories}</span>
    <span className="text-center text-green-600">{food.protein}</span>
    <span className="text-center text-blue-600">{food.carbs}</span>
    <span className="text-center text-purple-600">{food.fat}</span>
  </div>
));

FoodItem.displayName = 'FoodItem';

export default FoodItem;

