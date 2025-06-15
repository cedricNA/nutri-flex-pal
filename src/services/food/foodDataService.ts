
import { ExtendedFood } from '@/types/food';

export class FoodDataService {
  filterValidFoods(foods: ExtendedFood[]): ExtendedFood[] {
    return foods.filter(food => {
      if (!food.name || food.name.length === 0) return false;
      if (food.name.includes(':::')) return false;
      if (food.name.match(/^\d+:\d+/)) return false;
      if (food.name.length > 200) return false;
      if (food.name.match(/^\d+$/)) return false;
      return true;
    });
  }

  searchFoods(
    foods: ExtendedFood[],
    searchTerm: string = '', 
    subgroup: string = 'all', 
    showFavoritesOnly: boolean = false
  ): ExtendedFood[] {
    let filtered = foods;

    if (searchTerm) {
      filtered = filtered.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (subgroup !== 'all') {
      // Utiliser la catégorie à la place du sous-groupe pour le filtrage
      filtered = filtered.filter(food => food.category === subgroup);
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter(food => food.isFavorite);
    }

    return filtered;
  }

  getSubgroups(foods: ExtendedFood[]): { id: string; name: string; count: number }[] {
    const categoryMap = new Map<string, number>();
    
    foods.forEach(food => {
      const category = food.category || 'Autres';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    const subgroups = [
      { id: 'all', name: 'Tous', count: foods.length }
    ];

    categoryMap.forEach((count, categoryName) => {
      if (categoryName && categoryName.trim() !== '') {
        subgroups.push({
          id: categoryName,
          name: categoryName,
          count
        });
      }
    });

    // Trier par nombre d'aliments (décroissant)
    subgroups.sort((a, b) => {
      if (a.id === 'all') return -1;
      if (b.id === 'all') return 1;
      return b.count - a.count;
    });

    return subgroups;
  }
}

export const foodDataService = new FoodDataService();
