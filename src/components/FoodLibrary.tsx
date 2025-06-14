
import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Star, Loader2 } from 'lucide-react';
import { foodDataService, type Food } from '../services/foodDataService';

const FoodLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loadedFoods = await foodDataService.loadFoods();
      setFoods(loadedFoods);
      setCategories(foodDataService.getCategories());
    } catch (err) {
      setError('Erreur lors du chargement des aliments');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFoods = foodDataService.searchFoods(searchTerm, selectedCategory, showFavoritesOnly);

  const handleToggleFavorite = (foodId: string) => {
    foodDataService.toggleFavorite(foodId);
    setFoods([...foods]); // Force re-render
  };

  const FoodCard = ({ food }: { food: Food }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className="relative">
        <img 
          src={food.image}
          alt={food.name}
          className="w-full h-32 object-cover rounded-lg mb-3"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop';
          }}
        />
        <button 
          className={`absolute top-2 right-2 p-2 rounded-full ${
            food.isFavorite ? 'bg-yellow-500 text-white' : 'bg-white text-gray-400'
          } shadow-sm hover:scale-110 transition-transform`}
          onClick={(e) => {
            e.stopPropagation();
            handleToggleFavorite(food.id);
          }}
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-green-500" size={48} />
        <span className="ml-3 text-lg text-gray-600">Chargement des aliments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <Search size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={loadFoods}
          className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition"
        >
          Réessayer
        </button>
      </div>
    );
  }

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

      {filteredFoods.length === 0 && !isLoading && (
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
