
import { ColumnMapping } from '@/types/import';
import { parseNumericValue } from '@/utils/csv/valueParser';
import { mapCategorySync } from '@/utils/csv/categoryMapping';
import { FoodInsert } from '@/types/food';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateFoodItem = (food: Partial<FoodInsert>): ValidationResult => {
  const errors: string[] = [];

  if (!food.name || food.name.trim() === '') {
    errors.push('Le nom est obligatoire');
  }

  if (food.name && food.name.length > 200) {
    errors.push('Le nom est trop long (max 200 caractères)');
  }

  if (food.calories && (food.calories < 0 || food.calories > 9999)) {
    errors.push('Les calories doivent être entre 0 et 9999');
  }

  if (food.protein && (food.protein < 0 || food.protein > 999)) {
    errors.push('Les protéines doivent être entre 0 et 999g');
  }

  if (food.carbs && (food.carbs < 0 || food.carbs > 999)) {
    errors.push('Les glucides doivent être entre 0 et 999g');
  }

  if (food.fat && (food.fat < 0 || food.fat > 999)) {
    errors.push('Les lipides doivent être entre 0 et 999g');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const createFoodItem = (row: string[], columnMapping: ColumnMapping): Omit<FoodInsert, 'id' | 'created_at'> => {
  const name = row[columnMapping.name]?.trim() || '';
  const originalCategory = columnMapping.category !== -1 ? row[columnMapping.category]?.trim() || '' : '';
  
  console.log(`🏷️ Traitement: "${name}" - catégorie brute: "${originalCategory}"`);
  
  const mappedCategory = mapCategorySync(originalCategory);
  
  console.log(`🎯 Catégorie finale pour "${name}": "${mappedCategory}"`);

  return {
    name,
    category: mappedCategory,
    calories: columnMapping.calories !== -1 ? parseNumericValue(row[columnMapping.calories] || '0') : 0,
    protein: columnMapping.protein !== -1 ? parseNumericValue(row[columnMapping.protein] || '0') : 0,
    carbs: columnMapping.carbs !== -1 ? parseNumericValue(row[columnMapping.carbs] || '0') : 0,
    fat: columnMapping.fat !== -1 ? parseNumericValue(row[columnMapping.fat] || '0') : 0,
    fiber: columnMapping.fiber !== -1 ? parseNumericValue(row[columnMapping.fiber] || '0') : 0,
    unit: '100g',
    calcium: columnMapping.calcium !== -1 ? parseNumericValue(row[columnMapping.calcium] || '0') : 0,
    iron: columnMapping.iron !== -1 ? parseNumericValue(row[columnMapping.iron] || '0') : 0,
    magnesium: columnMapping.magnesium !== -1 ? parseNumericValue(row[columnMapping.magnesium] || '0') : 0,
    potassium: columnMapping.potassium !== -1 ? parseNumericValue(row[columnMapping.potassium] || '0') : 0,
    sodium: columnMapping.sodium !== -1 ? parseNumericValue(row[columnMapping.sodium] || '0') : 0,
    vitamin_c: columnMapping.vitamin_c !== -1 ? parseNumericValue(row[columnMapping.vitamin_c] || '0') : 0,
    vitamin_d: columnMapping.vitamin_d !== -1 ? parseNumericValue(row[columnMapping.vitamin_d] || '0') : 0,
    salt: columnMapping.salt !== -1 ? parseNumericValue(row[columnMapping.salt] || '0') : 0
  };
};
