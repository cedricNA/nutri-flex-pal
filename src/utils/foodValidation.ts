
import { ColumnMapping, mapCategory, parseNumericValue } from '@/utils/csvUtils';

export const validateFoodItem = (foodItem: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!foodItem.name || foodItem.name.trim() === '') {
    errors.push('Nom manquant');
    return { isValid: false, errors };
  }
  
  const name = foodItem.name.trim();
  if (name.match(/^\d+$/)) {
    errors.push('Nom invalide (code numérique uniquement)');
  }
  if (name.includes(':::') || name.includes('alim_nom_fr')) {
    errors.push('Nom corrompu');
  }
  if (name.length < 2) {
    errors.push('Nom trop court');
  }
  if (name.length > 200) {
    errors.push('Nom trop long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const createFoodItem = (row: string[], columnMapping: ColumnMapping) => {
  const name = row[columnMapping.name]?.trim();
  const categoryRaw = columnMapping.category !== -1 ? row[columnMapping.category]?.trim() : '';
  const category = mapCategory(categoryRaw || '');

  return {
    name,
    category,
    calories: columnMapping.calories !== -1 ? parseNumericValue(row[columnMapping.calories] || '0') : 0,
    protein: columnMapping.protein !== -1 ? parseNumericValue(row[columnMapping.protein] || '0') : 0,
    carbs: columnMapping.carbs !== -1 ? parseNumericValue(row[columnMapping.carbs] || '0') : 0,
    fat: columnMapping.fat !== -1 ? parseNumericValue(row[columnMapping.fat] || '0') : 0,
    fiber: columnMapping.fiber !== -1 ? parseNumericValue(row[columnMapping.fiber] || '0') : 0,
    calcium: columnMapping.calcium !== -1 ? parseNumericValue(row[columnMapping.calcium] || '0') : 0,
    iron: columnMapping.iron !== -1 ? parseNumericValue(row[columnMapping.iron] || '0') : 0,
    magnesium: columnMapping.magnesium !== -1 ? parseNumericValue(row[columnMapping.magnesium] || '0') : 0,
    potassium: columnMapping.potassium !== -1 ? parseNumericValue(row[columnMapping.potassium] || '0') : 0,
    sodium: columnMapping.sodium !== -1 ? parseNumericValue(row[columnMapping.sodium] || '0') : 0,
    vitamin_c: columnMapping.vitamin_c !== -1 ? parseNumericValue(row[columnMapping.vitamin_c] || '0') : 0,
    vitamin_d: columnMapping.vitamin_d !== -1 ? parseNumericValue(row[columnMapping.vitamin_d] || '0') : 0,
    salt: columnMapping.salt !== -1 ? parseNumericValue(row[columnMapping.salt] || '0') : 0,
    unit: '100g'
  };
};
