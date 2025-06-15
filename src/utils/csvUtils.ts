
import { ColumnMapping } from '@/types/import';

const CATEGORY_MAPPING: { [key: string]: string } = {
  // Catégories CIQUAL officielles
  'fruits et légumes': 'fruits',
  'fruits': 'fruits',
  'légumes': 'vegetables',
  'légumes frais': 'vegetables',
  'légumes secs': 'vegetables',
  'tubercules': 'vegetables',
  'pommes de terre et dérivés': 'vegetables',
  
  // Protéines
  'viandes': 'proteins',
  'viandes et abats': 'proteins',
  'volailles': 'proteins',
  'poissons': 'proteins',
  'poissons et fruits de mer': 'proteins',
  'fruits de mer': 'proteins',
  'œufs': 'proteins',
  'oeufs': 'proteins',
  'légumineuses': 'proteins',
  'légumes secs et légumineuses': 'proteins',
  
  // Produits laitiers
  'produits laitiers': 'dairy',
  'laits': 'dairy',
  'fromages': 'dairy',
  'desserts lactés': 'dairy',
  'yaourts': 'dairy',
  'beurres': 'dairy',
  
  // Céréales et dérivés
  'céréales et dérivés': 'grains',
  'céréales': 'grains',
  'pains': 'grains',
  'biscottes et crackers': 'grains',
  'pâtes': 'grains',
  'riz': 'grains',
  'farines': 'grains',
  'céréales de petit-déjeuner': 'grains',
  
  // Matières grasses
  'matières grasses': 'fats',
  'huiles': 'fats',
  'margarine': 'fats',
  'graisses animales': 'fats',
  
  // Snacks et sucreries
  'sucres et produits sucrés': 'snacks',
  'confiseries': 'snacks',
  'chocolats': 'snacks',
  'biscuits et gâteaux': 'snacks',
  'pâtisseries': 'snacks',
  'glaces': 'snacks',
  'boissons': 'snacks',
  'boissons alcoolisées': 'snacks',
  'boissons non alcoolisées': 'snacks',
  'épices et condiments': 'snacks',
  'condiments': 'snacks',
  'épices': 'snacks',
  'herbes': 'snacks',
  'sauces': 'snacks',
  
  // Plats composés
  'plats composés': 'grains',
  'sandwichs': 'grains',
  'pizzas et quiches': 'grains',
  'soupes': 'grains',
  
  // Autres
  'aides culinaires et ingrédients divers': 'snacks',
  'compléments alimentaires': 'snacks',
  'aliments infantiles': 'dairy',
  'entremets': 'dairy'
};

// Fonction pour normaliser les noms de catégories
const normalizeCategory = (category: string): string => {
  if (!category) return '';
  return category
    .toLowerCase()
    .trim()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n')
    .replace(/\s+/g, ' ')
    .trim();
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
    const normalizedName = normalizeCategory(name);
    const index = headers.findIndex(h => h && normalizeCategory(h) === normalizedName);
    if (index !== -1) return index;
  }
  return -1;
};

export const mapCategory = (originalCategory: string): string => {
  if (!originalCategory) {
    console.log('⚠️ Catégorie vide ou null');
    return 'snacks';
  }
  
  const normalized = normalizeCategory(originalCategory);
  console.log(`🔍 Mapping catégorie: "${originalCategory}" -> "${normalized}"`);
  
  const mapped = CATEGORY_MAPPING[normalized];
  if (mapped) {
    console.log(`✅ Catégorie mappée: "${normalized}" -> "${mapped}"`);
    return mapped;
  } else {
    console.log(`❌ Catégorie non reconnue: "${normalized}" -> par défaut "snacks"`);
    return 'snacks';
  }
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
  console.log('📋 Headers détectés:', headers.slice(0, 15));
  
  const mapping = {
    name: findColumnIndex(headers, [
      'alim_nom_fr', 'nom', 'name', 'aliment', 'food_name', 'nom_aliment', 
      'denomination', 'libelle', 'produit'
    ]),
    category: findColumnIndex(headers, [
      'alim_grp_nom_fr', 'groupe', 'category', 'categorie', 'group', 
      'famille', 'type', 'classe', 'sous_groupe', 'alim_ssgrp_nom_fr'
    ]),
    calories: findColumnIndex(headers, [
      'kcal', 'calories', 'energie', 'energy', 'kcal/100g', 'energie (kcal/100 g)'
    ]),
    protein: findColumnIndex(headers, [
      'protéines', 'proteines', 'protein', 'protides', 'proteines (g/100 g)'
    ]),
    carbs: findColumnIndex(headers, [
      'glucides', 'carbs', 'carbohydrates', 'sucres', 'glucides (g/100 g)'
    ]),
    fat: findColumnIndex(headers, [
      'lipides', 'fat', 'graisses', 'matières grasses', 'lipides (g/100 g)'
    ]),
    fiber: findColumnIndex(headers, [
      'fibres alimentaires (g/100 g)', 'fibres', 'fiber', 'fibres alimentaires'
    ]),
    calcium: findColumnIndex(headers, [
      'calcium (mg/100 g)', 'calcium', 'ca'
    ]),
    iron: findColumnIndex(headers, [
      'fer (mg/100 g)', 'fer', 'iron', 'fe'
    ]),
    magnesium: findColumnIndex(headers, [
      'magnésium (mg/100 g)', 'magnesium', 'mg'
    ]),
    potassium: findColumnIndex(headers, [
      'potassium (mg/100 g)', 'potassium', 'k'
    ]),
    sodium: findColumnIndex(headers, [
      'sodium (mg/100 g)', 'sodium', 'na'
    ]),
    vitamin_c: findColumnIndex(headers, [
      'vitamine c (mg/100 g)', 'vitamin c', 'vitamine c', 'vit c'
    ]),
    vitamin_d: findColumnIndex(headers, [
      'vitamine d (µg/100 g)', 'vitamin d', 'vitamine d', 'vit d'
    ]),
    salt: findColumnIndex(headers, [
      'sel chlorure de sodium (g/100 g)', 'sel', 'salt'
    ])
  };
  
  console.log('🗂️ Mapping des colonnes:', mapping);
  return mapping;
};

// Re-export ColumnMapping for convenience
export type { ColumnMapping } from '@/types/import';
