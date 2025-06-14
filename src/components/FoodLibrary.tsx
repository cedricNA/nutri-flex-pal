
import React, { useState } from 'react';
import { Search, Filter, Plus, Star } from 'lucide-react';

interface Food {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  image: string;
  isFavorite: boolean;
  unit: string;
}

const FoodLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const categories = [
    { id: 'all', name: 'Tous', count: 245 },
    { id: 'proteins', name: 'Protéines', count: 45 },
    { id: 'grains', name: 'Céréales', count: 32 },
    { id: 'vegetables', name: 'Légumes', count: 67 },
    { id: 'fruits', name: 'Fruits', count: 38 },
    { id: 'dairy', name: 'Laitiers', count: 28 },
    { id: 'fats', name: 'Matières grasses', count: 21 },
    { id: 'snacks', name: 'Collations', count: 14 }
  ];

  const foods: Food[] = [
    {
      id: '1',
      name: 'Poulet grillé',
      category: 'proteins',
      calories: 231,
      protein: 43,
      carbs: 0,
      fat: 5,
      fiber: 0,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&fit=crop',
      isFavorite: true,
      unit: '100g'
    },
    {
      id: '2',
      name: 'Avoine',
      category: 'grains',
      calories: 389,
      protein: 17,
      carbs: 66,
      fat: 7,
      fiber: 11,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&fit=crop',
      isFavorite: false,
      unit: '100g'
    },
    {
      id: '3',
      name: 'Saumon',
      category: 'proteins',
      calories: 206,
      protein: 28,
      carbs: 0,
      fat: 9,
      fiber: 0,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&fit=crop',
      isFavorite: true,
      unit: '100g'
    },
    {
      id: '4',
      name: 'Banane',
      category: 'fruits',
      calories: 89,
      protein: 1,
      carbs: 23,
      fat: 0,
      fiber: 3,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&fit=crop',
      isFavorite: false,
      unit: '1 unité'
    },
    {
      id: '5',
      name: 'Brocolis',
      category: 'vegetables',
      calories: 25,
      protein: 3,
      carbs: 5,
      fat: 0,
      fiber: 3,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&fit=crop',
      isFavorite: false,
      unit: '100g'
    },
    {
      id: '6',
      name: 'Riz complet',
      category: 'grains',
      calories: 123,
      protein: 3,
      carbs: 25,
      fat: 1,
      fiber: 2,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&fit=crop',
      isFavorite: true,
      unit: '100g'
    }
  ];

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
    const matchesFavorites = !showFavoritesOnly || food.isFavorite;
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const FoodCard = ({ food }: { food: Food }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className="relative">
        <img 
          src={food.image}
          alt={food.name}
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
        <button 
          className={`absolute top-2 right-2 p-2 rounded-full ${
            food.isFavorite ? 'bg-yellow-500 text-white' : 'bg-white text-gray-400'
          } shadow-sm hover:scale-110 transition-transform`}
        >
          <Star size={16} fill={food.isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition">{food.name}</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{food.unit}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-orange-50 rounded-lg p-2 text-center">
            <p className="font-bold text-orange-600">{food.calories}</p>
            <p className="text-xs text-gray-600">kcal</p>
          </div>
          <div className="bg-green-50 rounded-lg p-2 text-center">
            <p className="font-bold text-green-600">{food.protein}g</p>
            <p className="text-xs text-gray-600">protéines</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-1 text-xs text-gray-600">
          <div className="text-center">
            <p className="font-medium">{food.carbs}g</p>
            <p>Glucides</p>
          </div>
          <div className="text-center">
            <p className="font-medium">{food.fat}g</p>
            <p>Lipides</p>
          </div>
          <div className="text-center">
            <p className="font-medium">{food.fiber}g</p>
            <p>Fibres</p>
          </div>
        </div>
        
        <button className="w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition opacity-0 group-hover:opacity-100">
          Ajouter au repas
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Bibliothèque d'aliments</h2>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition flex items-center space-x-2">
          <Plus size={18} />
          <span>Nouvel aliment</span>
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un aliment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-4 py-3 rounded-lg font-medium transition flex items-center space-x-2 ${
                showFavoritesOnly 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Star size={18} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
              <span>Favoris</span>
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition flex items-center space-x-2">
              <Filter size={18} />
              <span>Filtres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Catégories */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Catégories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === category.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Grille d'aliments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFoods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>

      {filteredFoods.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun aliment trouvé</h3>
          <p className="text-gray-600 mb-4">Essayez de modifier vos critères de recherche</p>
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition">
            Créer cet aliment
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodLibrary;
