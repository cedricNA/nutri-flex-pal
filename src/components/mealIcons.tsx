
import React from 'react';
import { Coffee, Utensils, CakeSlice, Egg, Clock } from 'lucide-react';

export const getMealIcon = (mealName: string) => {
  switch (mealName) {
    case 'Petit-déjeuner':
      return <Coffee size={18} className="text-blue-500" />;
    case 'Déjeuner':
      return <Utensils size={18} className="text-green-600" />;
    case 'Collation':
      return <CakeSlice size={18} className="text-pink-500" />;
    case 'Dîner':
      return <Egg size={18} className="text-yellow-600" />;
    default:
      return <Clock size={18} />;
  }
};
