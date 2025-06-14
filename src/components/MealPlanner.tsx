
import React, { useState } from 'react';
import { Plus, Clock, Calculator } from 'lucide-react';

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

interface Meal {
  id: string;
  name: string;
  time: string;
  foods: Food[];
  targetCalories: number;
}

const MealPlanner = () => {
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: '1',
      name: 'Petit-déjeuner',
      time: '08:00',
      foods: [
        { id: '1', name: 'Avoine', calories: 150, protein: 5, carbs: 27, fat: 3, quantity: 50, unit: 'g' },
        { id: '2', name: 'Banane', calories: 89, protein: 1, carbs: 23, fat: 0, quantity: 1, unit: 'unité' },
        { id: '3', name: 'Lait d\'amande', calories: 50, protein: 1, carbs: 8, fat: 2, quantity: 200, unit: 'ml' },
      ],
      targetCalories: 400
    },
    {
      id: '2',
      name: 'Déjeuner',
      time: '12:30',
      foods: [
        { id: '4', name: 'Poulet grillé', calories: 231, protein: 43, carbs: 0, fat: 5, quantity: 150, unit: 'g' },
        { id: '5', name: 'Riz complet', calories: 123, protein: 3, carbs: 25, fat: 1, quantity: 100, unit: 'g' },
        { id: '6', name: 'Brocolis', calories: 25, protein: 3, carbs: 5, fat: 0, quantity: 150, unit: 'g' },
      ],
      targetCalories: 550
    },
    {
      id: '3',
      name: 'Collation',
      time: '16:00',
      foods: [],
      targetCalories: 200
    },
    {
      id: '4',
      name: 'Dîner',
      time: '19:30',
      foods: [
        { id: '7', name: 'Saumon', calories: 206, protein: 28, carbs: 0, fat: 9, quantity: 120, unit: 'g' },
        { id: '8', name: 'Quinoa', calories: 120, protein: 4, carbs: 22, fat: 2, quantity: 80, unit: 'g' },
        { id: '9', name: 'Épinards', calories: 20, protein: 2, carbs: 3, fat: 0, quantity: 100, unit: 'g' },
      ],
      targetCalories: 500
    }
  ]);

  const calculateMealTotals = (foods: Food[]) => {
    return foods.reduce((totals, food) => ({
      calories: totals.calories + food.calories,
      protein: totals.protein + food.protein,
      carbs: totals.carbs + food.carbs,
      fat: totals.fat + food.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const FoodItem = ({ food }: { food: Food }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{food.name}</h4>
        <p className="text-sm text-gray-600">{food.quantity} {food.unit}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">{food.calories} kcal</p>
        <p className="text-xs text-gray-500">P: {food.protein}g | G: {food.carbs}g | L: {food.fat}g</p>
      </div>
    </div>
  );

  const MealCard = ({ meal }: { meal: Meal }) => {
    const totals = calculateMealTotals(meal.foods);
    const progress = (totals.calories / meal.targetCalories) * 100;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Clock className="text-white" size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{meal.name}</h3>
              <p className="text-sm text-gray-500">{meal.time}</p>
            </div>
          </div>
          <button className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition">
            <Plus size={18} />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {meal.foods.map((food) => (
            <FoodItem key={food.id} food={food} />
          ))}
          {meal.foods.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calculator size={32} className="mx-auto mb-2 opacity-50" />
              <p>Aucun aliment ajouté</p>
              <button className="mt-2 text-green-600 font-medium hover:text-green-700">
                Ajouter un aliment
              </button>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progression</span>
            <span className="text-sm text-gray-600">
              {totals.calories} / {meal.targetCalories} kcal
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>P: {totals.protein}g</span>
            <span>G: {totals.carbs}g</span>
            <span>L: {totals.fat}g</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Plan alimentaire du jour</h2>
        <div className="flex space-x-3">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition">
            Copier d'hier
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition">
            Nouveau repas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>
    </div>
  );
};

export default MealPlanner;
