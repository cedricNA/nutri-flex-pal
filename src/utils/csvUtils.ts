import { ColumnMapping } from '@/types/import';

const CATEGORY_MAPPING: { [key: string]: string } = {
  // Fruits et légumes
  'fruits': 'fruits',
  'fruits et legumes': 'fruits',
  'legumes': 'vegetables',
  'legumes frais': 'vegetables',
  'legumes secs': 'vegetables',
  'legumineuses': 'proteins',
  'pommes de terre et autres tubercules': 'vegetables',
  'tubercules': 'vegetables',
  'pommes de terre et derives': 'vegetables',
  'salades composees et crudites': 'vegetables',
  
  // Protéines
  'viandes crues': 'proteins',
  'viandes cuites': 'proteins',
  'viandes': 'proteins',
  'viandes et abats': 'proteins',
  'volailles': 'proteins',
  'poissons cuits': 'proteins',
  'poissons': 'proteins',
  'poissons et fruits de mer': 'proteins',
  'fruits de mer': 'proteins',
  'mollusques et crustaces crus': 'proteins',
  'mollusques et crustaces cuits': 'proteins',
  'produits a base de poissons et produits de la mer': 'proteins',
  'autres produits a base de viande': 'proteins',
  'charcuteries et assimiles': 'proteins',
  'substitus de produits carnes': 'proteins',
  'oeufs': 'proteins',
  'legumes secs et legumineuses': 'proteins',
  'fruits a coque et graines oleagineuses': 'proteins',
  
  // Produits laitiers
  'produits laitiers': 'dairy',
  'laits': 'dairy',
  'laits et boissons infantiles': 'dairy',
  'fromages et assimiles': 'dairy',
  'fromages': 'dairy',
  'desserts lactes': 'dairy',
  'produits laitiers frais et assimiles': 'dairy',
  'cremes et specialites a base de creme': 'dairy',
  'yaourts': 'dairy',
  'beurres': 'fats',
  
  // Céréales et dérivés
  'cereales et derives': 'grains',
  'cereales': 'grains',
  'pains et assimiles': 'grains',
  'pains': 'grains',
  'biscottes et crackers': 'grains',
  'pates, riz et cereales': 'grains',
  'pates': 'grains',
  'riz': 'grains',
  'farines': 'grains',
  'cereales de petit-dejeuner': 'grains',
  'cereales et biscuits infantiles': 'grains',
  'viennoiseries': 'grains',
  'barres cerealières': 'grains',
  
  // Matières grasses
  'matieres grasses': 'fats',
  'huiles et graisses vegetales': 'fats',
  'huiles': 'fats',
  'huiles de poissons': 'fats',
  'autres matieres grasses': 'fats',
  'margarine': 'fats',
  'margarines': 'fats',
  'graisses animales': 'fats',
  
  // Snacks et sucreries
  'sucres et produits sucres': 'snacks',
  'sucres, miels et assimiles': 'snacks',
  'confiseries': 'snacks',
  'confiseries non chocolatees': 'snacks',
  'chocolats': 'snacks',
  'chocolats et produits a base de chocolat': 'snacks',
  'biscuits et gateaux': 'snacks',
  'biscuits sucres': 'snacks',
  'biscuits aperitifs': 'snacks',
  'gateaux et patisseries': 'snacks',
  'patisseries': 'snacks',
  'glaces': 'snacks',
  'desserts glaces': 'snacks',
  'sorbets': 'snacks',
  'confitures et assimiles': 'snacks',
  'boissons': 'snacks',
  'boissons sans alcool': 'snacks',
  'boisson alcoolisees': 'snacks',
  'boissons alcoolisees': 'snacks',
  'boissons non alcoolisees': 'snacks',
  'eaux': 'snacks',
  'epices et condiments': 'snacks',
  'epices': 'snacks',
  'condiments': 'snacks',
  'herbes': 'snacks',
  'sauces': 'snacks',
  'sels': 'snacks',
  'aides culinaires': 'snacks',
  'ingredients divers': 'snacks',
  'algues': 'snacks',
  
  // Plats composés
  'plats composes': 'grains',
  'sandwichs': 'grains',
  'pizzas, tartes et crepes salees': 'grains',
  'pizzas et quiches': 'grains',
  'feuilletees et autres entrees': 'grains',
  'soupes': 'grains',
  
  // Autres
  'aides culinaires et ingredients divers': 'snacks',
  'complements alimentaires': 'snacks',
  'denrees destinees a une alimentation particuliere': 'snacks',
  'aliments infantiles': 'dairy',
  'desserts infantiles': 'dairy',
  'petits pots sales et plats infantiles': 'grains',
  'entremets': 'dairy',
  
  // Variations communes avec virgules et espaces
  'viandes, oeufs, poissons et assimiles': 'proteins',
  'viandes, oeufs, poissons et assimilés': 'proteins'
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

// Fonction pour recherche flexible
const findFlexibleMapping = (normalized: string): string | null => {
  // Recherche par mots-clés
  if (normalized.includes('viande') || normalized.includes('oeuf') || normalized.includes('poisson')) {
    return 'proteins';
  }
  if (normalized.includes('legume') || normalized.includes('tubercule') || normalized.includes('salade')) {
    return 'vegetables';
  }
  if (normalized.includes('fruit')) {
    return 'fruits';
  }
  if (normalized.includes('lait') || normalized.includes('fromage') || normalized.includes('yaourt')) {
    return 'dairy';
  }
  if (normalized.includes('pain') || normalized.includes('cereale') || normalized.includes('pate') || normalized.includes('riz')) {
    return 'grains';
  }
  if (normalized.includes('huile') || normalized.includes('beurre') || normalized.includes('margarine')) {
    return 'fats';
  }
  return null;
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
    // Si pas de correspondance exacte, essayer une recherche plus flexible
    const flexibleMapping = findFlexibleMapping(normalized);
    if (flexibleMapping) {
      console.log(`🔍 Correspondance flexible: "${normalized}" -> "${flexibleMapping}"`);
      return flexibleMapping;
    }
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
      'vitamine c (mg/100 g)', 'vitamin c', 'vitamin c', 'vit c'
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
