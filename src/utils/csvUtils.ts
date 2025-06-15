
import { ColumnMapping } from '@/types/import';

const CATEGORY_MAPPING: { [key: string]: string } = {
  'fruits et légumes': 'fruits',
  'fruits': 'fruits',
  'légumes': 'vegetables',
  'viandes': 'proteins',
  'poissons': 'proteins',
  'œufs': 'proteins',
  'produits laitiers': 'dairy',
  'céréales et dérivés': 'grains',
  'légumineuses': 'proteins',
  'matières grasses': 'fats',
  'sucres et produits sucrés': 'snacks',
  'boissons': 'snacks',
  'épices et condiments': 'snacks',
  'plats composés': 'grains',
  'aides culinaires et ingrédients divers': 'snacks'
};

export const detectSeparator = (line: string): string => {
  const separators = ['\t', ';', ','];
  const counts = separators.map(sep => (line.match(new RegExp(sep, 'g')) || []).length);
  const maxIndex = counts.indexOf(Math.max(...counts));
  return separators[maxIndex];
};

export const parseCSVLine = (line: string, separator: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === separator && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim().replace(/^"|"$/g, ''));
  return result;
};

export const findColumnIndex = (headers: string[], possibleNames: string[]): number => {
  for (const name of possibleNames) {
    const index = headers.findIndex(h => h && h.trim().toLowerCase() === name.toLowerCase());
    if (index !== -1) return index;
  }
  return -1;
};

export const mapCategory = (originalCategory: string): string => {
  if (!originalCategory) return 'snacks';
  const normalized = originalCategory.toLowerCase().trim();
  return CATEGORY_MAPPING[normalized] || 'snacks';
};

export const parseNumericValue = (value: string): number => {
  if (!value || value === '' || value === '-' || value === 'traces' || value === '<' || value === 'nd') return 0;
  
  let cleanValue = value.replace(',', '.').replace(/[^\d.-]/g, '');
  
  if (!cleanValue) return 0;
  
  const num = parseFloat(cleanValue);
  
  if (isNaN(num)) return 0;
  
  if (num > 999999) return 999999;
  if (num < -999999) return -999999;
  
  return Math.round(num * 100) / 100;
};

export const createColumnMapping = (headers: string[]): ColumnMapping => {
  return {
    name: findColumnIndex(headers, ['alim_nom_fr', 'nom', 'name', 'aliment']),
    category: findColumnIndex(headers, ['alim_grp_nom_fr', 'groupe', 'category', 'categorie']),
    calories: findColumnIndex(headers, ['kcal', 'calories', 'energie']),
    protein: findColumnIndex(headers, ['protéines', 'proteines', 'protein']),
    carbs: findColumnIndex(headers, ['glucides', 'carbs', 'carbohydrates']),
    fat: findColumnIndex(headers, ['lipides', 'fat', 'graisses']),
    fiber: findColumnIndex(headers, ['fibres alimentaires (g/100 g)', 'fibres', 'fiber']),
    calcium: findColumnIndex(headers, ['calcium (mg/100 g)', 'calcium']),
    iron: findColumnIndex(headers, ['fer (mg/100 g)', 'fer', 'iron']),
    magnesium: findColumnIndex(headers, ['magnésium (mg/100 g)', 'magnesium']),
    potassium: findColumnIndex(headers, ['potassium (mg/100 g)', 'potassium']),
    sodium: findColumnIndex(headers, ['sodium (mg/100 g)', 'sodium']),
    vitamin_c: findColumnIndex(headers, ['vitamine c (mg/100 g)', 'vitamin c', 'vitamine c']),
    vitamin_d: findColumnIndex(headers, ['vitamine d (µg/100 g)', 'vitamin d', 'vitamine d']),
    salt: findColumnIndex(headers, ['sel chlorure de sodium (g/100 g)', 'sel', 'salt'])
  };
};

// Re-export ColumnMapping for convenience
export type { ColumnMapping } from '@/types/import';
