
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
const getMealIconFallback = (
  mealName: string,
  size: number = 18,
  className?: string
): React.ReactElement => {
  let emoji = '🍽️';
  switch (mealName) {
    case 'breakfast':
    case 'Petit-déjeuner':
      emoji = '🥐';
      break;
    case 'lunch':
    case 'Déjeuner':
      emoji = '🍽️';
      break;
    case 'dinner':
    case 'Dîner':
      emoji = '🍲';
      break;
    case 'snack':
    case 'Collation':
      emoji = '🍎';
      break;
    default:
      emoji = '🍽️';
  }

  return (
    <span
      className={className || 'text-white'}
      style={{ fontSize: size, lineHeight: 1 }}
      role="img"
      aria-label={mealName}
    >
      {emoji}
    </span>
  );
};

// Fonction pour obtenir l'icône depuis la base de données (asynchrone)
export const getMealIcon = async (mealIdentifier: string, size: number = 18, className?: string): Promise<React.ReactElement> => {
  // Vérifier le cache
  const now = Date.now();
  if (!mealTypesCache || (now - cacheTimestamp) > CACHE_DURATION) {
    try {
      mealTypesCache = await dynamicDataService.getMealTypes();
      cacheTimestamp = now;
    } catch (error) {
      console.error('Error loading meal types:', error);
      // Fallback vers les icônes par défaut
      return getMealIconFallback(mealIdentifier, size, className);
    }
  }

  // Trouver le type de repas correspondant
  const mealType = mealTypesCache.find(
    mt => mt.id === mealIdentifier || mt.type_key === mealIdentifier || mt.display_name === mealIdentifier
  );
  if (!mealType) {
    return getMealIconFallback(mealIdentifier, size, className);
  }

  // Obtenir l'icône correspondante
  const IconComponent = iconMapping[mealType.icon_name] || Clock;
  return React.createElement(IconComponent, { size, className: className || "text-white" });
};

// Hook pour utiliser les icônes de repas dans les composants React
export const useMealIcon = (mealIdentifier: string) => {
  const [icon, setIcon] = useState<React.ReactElement>(() => getMealIconFallback(mealIdentifier));

  useEffect(() => {
    const loadIcon = async () => {
      const iconElement = await getMealIcon(mealIdentifier);
      setIcon(iconElement);
    };

    loadIcon();
  }, [mealIdentifier]);

  return icon;
};

// Version synchrone pour la compatibilité (utilise le fallback)
export const getMealIconSync = (mealName: string, size: number = 18, className?: string): React.ReactElement => {
  return getMealIconFallback(mealName, size, className);
};
