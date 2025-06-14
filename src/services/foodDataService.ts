
import Papa from 'papaparse';

export interface Food {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  unit: string;
  image: string;
  isFavorite?: boolean;
}

class FoodDataService {
  private foods: Food[] = [];
  private isLoaded = false;
  private favoriteIds: string[] = [];

  constructor() {
    this.loadFavorites();
  }

  async loadFoods(): Promise<Food[]> {
    if (this.isLoaded) {
      return this.foods;
    }

    try {
      const response = await fetch('/data/foods.csv');
      const csvText = await response.text();
      
      const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transform: (value, header) => {
          // Convert numeric fields
          if (['calories', 'protein', 'carbs', 'fat', 'fiber'].includes(header)) {
            return parseFloat(value) || 0;
          }
          return value;
        }
      });

      this.foods = result.data.map((food: any) => ({
        ...food,
        isFavorite: this.favoriteIds.includes(food.id)
      }));
      
      this.isLoaded = true;
      return this.foods;
    } catch (error) {
      console.error('Erreur lors du chargement des aliments:', error);
      return [];
    }
  }

  searchFoods(searchTerm: string, category: string = 'all', showFavoritesOnly: boolean = false): Food[] {
    let filtered = this.foods;

    if (searchTerm) {
      filtered = filtered.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category !== 'all') {
      filtered = filtered.filter(food => food.category === category);
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter(food => food.isFavorite);
    }

    return filtered;
  }

  toggleFavorite(foodId: string): void {
    const food = this.foods.find(f => f.id === foodId);
    if (food) {
      food.isFavorite = !food.isFavorite;
      if (food.isFavorite) {
        this.favoriteIds.push(foodId);
      } else {
        this.favoriteIds = this.favoriteIds.filter(id => id !== foodId);
      }
      this.saveFavorites();
    }
  }

  getCategories(): { id: string; name: string; count: number }[] {
    const categoryMap = new Map<string, number>();
    
    this.foods.forEach(food => {
      categoryMap.set(food.category, (categoryMap.get(food.category) || 0) + 1);
    });

    const categories = [
      { id: 'all', name: 'Tous', count: this.foods.length }
    ];

    const categoryNames: { [key: string]: string } = {
      proteins: 'Protéines',
      grains: 'Céréales',
      vegetables: 'Légumes',
      fruits: 'Fruits',
      dairy: 'Laitiers',
      fats: 'Matières grasses',
      snacks: 'Collations'
    };

    categoryMap.forEach((count, categoryId) => {
      categories.push({
        id: categoryId,
        name: categoryNames[categoryId] || categoryId,
        count
      });
    });

    return categories;
  }

  private loadFavorites(): void {
    try {
      const saved = localStorage.getItem('food-favorites');
      this.favoriteIds = saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      this.favoriteIds = [];
    }
  }

  private saveFavorites(): void {
    try {
      localStorage.setItem('food-favorites', JSON.stringify(this.favoriteIds));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des favoris:', error);
    }
  }
}

export const foodDataService = new FoodDataService();
