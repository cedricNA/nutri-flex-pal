
import React, { useEffect, useState } from 'react';
import { Coffee, Utensils, CakeSlice, Egg, Clock } from 'lucide-react';
import { dynamicDataService, type MealType } from '@/services/dynamicDataService';

// Cache pour éviter les appels répétés
let mealTypesCache: MealType[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Mapping des icônes Lucide par nom
const iconMapping: { [key: string]: React.ComponentType<any> } = {
  Coffee,
  UtensilsCrossed: Utensils,
  ChefHat: Utensils,
  Cookie: CakeSlice,
  Clock
};

// Fonction de fallback avec les icônes hardcodées
const getMealIconFallback = (mealName: string, size: number = 18, className?: string): React.ReactElement => {
  switch (mealName) {
    case 'breakfast':
    case 'Petit-déjeuner':
      return React.createElement(Coffee, { size, className: className || "text-blue-500" });
    case 'lunch':
    case 'Déjeuner':
      return React.createElement(Utensils, { size, className: className || "text-green-600" });
    case 'snack':
    case 'Collation':
      return React.createElement(CakeSlice, { size, className: className || "text-pink-500" });
    case 'dinner':
    case 'Dîner':
      return React.createElement(Egg, { size, className: className || "text-yellow-600" });
    default:
      return React.createElement(Clock, { size, className });
  }
};

// Fonction pour obtenir l'icône depuis la base de données (asynchrone)
export const getMealIcon = async (mealTypeKey: string, size: number = 18, className?: string): Promise<React.ReactElement> => {
  // Vérifier le cache
  const now = Date.now();
  if (!mealTypesCache || (now - cacheTimestamp) > CACHE_DURATION) {
    try {
      mealTypesCache = await dynamicDataService.getMealTypes();
      cacheTimestamp = now;
    } catch (error) {
      console.error('Error loading meal types:', error);
      // Fallback vers les icônes par défaut
      return getMealIconFallback(mealTypeKey, size, className);
    }
  }

  // Trouver le type de repas correspondant
  const mealType = mealTypesCache.find(mt => mt.type_key === mealTypeKey);
  if (!mealType) {
    return getMealIconFallback(mealTypeKey, size, className);
  }

  // Obtenir l'icône correspondante
  const IconComponent = iconMapping[mealType.icon_name] || Clock;
  return React.createElement(IconComponent, { size, className });
};

// Hook pour utiliser les icônes de repas dans les composants React
export const useMealIcon = (mealTypeKey: string) => {
  const [icon, setIcon] = useState<React.ReactElement>(() => getMealIconFallback(mealTypeKey));

  useEffect(() => {
    const loadIcon = async () => {
      const iconElement = await getMealIcon(mealTypeKey);
      setIcon(iconElement);
    };
    
    loadIcon();
  }, [mealTypeKey]);

  return icon;
};

// Version synchrone pour la compatibilité (utilise le fallback)
export const getMealIconSync = (mealName: string, size: number = 18, className?: string): React.ReactElement => {
  return getMealIconFallback(mealName, size, className);
};
