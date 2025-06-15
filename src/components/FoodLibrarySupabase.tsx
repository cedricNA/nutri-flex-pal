import React, { useEffect } from 'react';
import { Search, Filter, Plus, Star, Loader2, RefreshCw } from 'lucide-react';
import { useSupabaseFoodStore } from '../stores/useSupabaseFoodStore';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { type ExtendedFood } from '../services/supabaseFoodService';

const FoodLibrarySupabase = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const {
    isLoaded,
    isLoading,
    searchTerm,
    selectedSubgroup,
    showFavoritesOnly,
    subgroups,
    loadFoods,
    setSearchTerm,
    setSelectedSubgroup,
    setShowFavoritesOnly,
    toggleFavorite,
    getFilteredFoods,
    addMealEntry,
    refreshData
  } = useSupabaseFoodStore();

  const filteredFoods = getFilteredFoods();

  useEffect(() => {
    console.log('FoodLibrarySupabase mounted, isLoaded:', isLoaded, 'isLoading:', isLoading);
    if (!isLoaded && !isLoading) {
      loadFoods();
    }
  }, [isLoaded, isLoading, loadFoods]);

  const handleRefresh = async () => {
    console.log('Manual refresh triggered');
    await refreshData();
    toast({
      title: "Données actualisées",
      description: "La bibliothèque d'aliments a été mise à jour.",
    });
  };

  const handleAddToMeal = async (foodId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour ajouter des aliments à vos repas.",
        variant: "destructive"
      });
      return;
    }

    const success = await addMealEntry(foodId, 100, 'lunch');
    if (success) {
      toast({
        title: "Aliment ajouté !",
        description: "L'aliment a été ajouté à votre déjeuner.",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'aliment.",
        variant: "destructive"
      });
    }
  };

  const handleToggleFavorite = async (foodId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour gérer vos favoris.",
        variant: "destructive"
      });
      return;
    }

    await toggleFavorite(foodId);
  };

  const FoodCard = ({ food }: { food: ExtendedFood }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className="relative">
        <img 
          src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop'}
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
        
        <button 
          className="w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition opacity-0 group-hover:opacity-100"
          onClick={() => handleAddToMeal(food.id)}
        >
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Bibliothèque d'aliments</h2>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition flex items-center space-x-2"
          >
            <RefreshCw size={18} />
            <span>Actualiser</span>
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition flex items-center space-x-2">
            <Plus size={18} />
            <span>Nouvel aliment</span>
          </button>
        </div>
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

      {/* Sous-groupes d'aliments */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Sous-groupes d'aliments</h3>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
          {subgroups.map((subgroup) => (
            <button
              key={subgroup.id}
              onClick={() => setSelectedSubgroup(subgroup.id)}
              className={`px-3 py-2 rounded-lg font-medium transition text-sm ${
                selectedSubgroup === subgroup.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {subgroup.name} ({subgroup.count})
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

      {filteredFoods.length === 0 && isLoaded && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun aliment trouvé</h3>
          <p className="text-gray-600 mb-4">
            {subgroups.length > 1 && subgroups.find(c => c.id === 'all')?.count === 0 
              ? "Il semble que la base de données soit vide. Essayez d'importer des aliments."
              : "Essayez de modifier vos critères de recherche"
            }
          </p>
          <button 
            onClick={handleRefresh}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition mr-3"
          >
            Actualiser
          </button>
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition">
            Créer cet aliment
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodLibrarySupabase;
