
import { normalizeCategory } from './categoryMapping';
import { ColumnMapping } from '@/types/import';
import { dynamicDataService } from '@/services/dynamicDataService';

// Cache pour éviter les appels répétés
let columnMappingCache: { [key: string]: string[] } | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fonction pour charger le mapping des colonnes depuis Supabase
const loadColumnMappings = async (): Promise<{ [key: string]: string[] }> => {
  try {
    const mappings = await dynamicDataService.getCsvColumnMappings();
    const mappingObject: { [key: string]: string[] } = {};
    
    mappings.forEach(mapping => {
      mappingObject[mapping.field_type] = mapping.possible_names;
    });
    
    return mappingObject;
  } catch (error) {
    console.error('Error loading column mappings:', error);
    // Fallback vers un mapping minimal en cas d'erreur
    return {
      name: ['alim_nom_fr', 'nom', 'name', 'aliment', 'food_name'],
      calories: ['energie_kcal_100g', 'calories', 'energy', 'kcal'],
      protein: ['proteines_g_100g', 'protein', 'proteins', 'proteines'],
      carbs: ['glucides_g_100g', 'carbs', 'carbohydrates', 'glucides'],
      fat: ['lipides_g_100g', 'fat', 'fats', 'lipides'],
      category: ['alim_grp_nom_fr', 'category', 'groupe', 'categorie']
    };
  }
};

export const findColumnIndex = async (headers: string[], fieldType: string): Promise<number> => {
  // Vérifier le cache
  const now = Date.now();
  if (!columnMappingCache || (now - cacheTimestamp) > CACHE_DURATION) {
    console.log('🔄 Rechargement du cache des colonnes...');
    columnMappingCache = await loadColumnMappings();
    cacheTimestamp = now;
  }
  
  const possibleNames = columnMappingCache[fieldType] || [];
  
  for (const name of possibleNames) {
    const normalizedName = normalizeCategory(name);
    const index = headers.findIndex(h => h && normalizeCategory(h) === normalizedName);
    if (index !== -1) return index;
  }
  return -1;
};

export const createColumnMapping = async (headers: string[]): Promise<ColumnMapping> => {
  console.log('📋 Headers détectés:', headers.slice(0, 15));
  
  const mapping = {
    name: await findColumnIndex(headers, 'name'),
    category: await findColumnIndex(headers, 'category'),
    calories: await findColumnIndex(headers, 'calories'),
    protein: await findColumnIndex(headers, 'protein'),
    carbs: await findColumnIndex(headers, 'carbs'),
    fat: await findColumnIndex(headers, 'fat'),
    fiber: await findColumnIndex(headers, 'fiber'),
    calcium: await findColumnIndex(headers, 'calcium'),
    iron: await findColumnIndex(headers, 'iron'),
    magnesium: await findColumnIndex(headers, 'magnesium'),
    potassium: await findColumnIndex(headers, 'potassium'),
    sodium: await findColumnIndex(headers, 'sodium'),
    vitamin_c: await findColumnIndex(headers, 'vitamin_c'),
    vitamin_d: await findColumnIndex(headers, 'vitamin_d'),
    salt: await findColumnIndex(headers, 'salt')
  };
  
  console.log('🗂️ Mapping des colonnes:', mapping);
  return mapping;
};

// Version synchrone pour la compatibilité (utilise le mapping hardcodé)
export const findColumnIndexSync = (headers: string[], possibleNames: string[]): number => {
  for (const name of possibleNames) {
    const normalizedName = normalizeCategory(name);
    const index = headers.findIndex(h => h && normalizeCategory(h) === normalizedName);
    if (index !== -1) return index;
  }
  return -1;
};

export const createColumnMappingSync = (headers: string[]): ColumnMapping => {
  console.log('📋 Headers détectés:', headers.slice(0, 15));
  
  const mapping = {
    name: findColumnIndexSync(headers, [
      'alim_nom_fr', 'nom', 'name', 'aliment', 'food_name', 'nom_aliment', 
      'denomination', 'libelle', 'produit'
    ]),
    category: findColumnIndexSync(headers, [
      'alim_grp_nom_fr', 'groupe', 'category', 'categorie', 'group', 
      'famille', 'type', 'classe', 'sous_groupe', 'alim_ssgrp_nom_fr'
    ]),
    calories: findColumnIndexSync(headers, [
      'kcal', 'calories', 'energie', 'energy', 'kcal/100g', 'energie (kcal/100 g)'
    ]),
    protein: findColumnIndexSync(headers, [
      'protéines', 'proteines', 'protein', 'protides', 'proteines (g/100 g)'
    ]),
    carbs: findColumnIndexSync(headers, [
      'glucides', 'carbs', 'carbohydrates', 'sucres', 'glucides (g/100 g)'
    ]),
    fat: findColumnIndexSync(headers, [
      'lipides', 'fat', 'graisses', 'matières grasses', 'lipides (g/100 g)'
    ]),
    fiber: findColumnIndexSync(headers, [
      'fibres alimentaires (g/100 g)', 'fibres', 'fiber', 'fibres alimentaires'
    ]),
    calcium: findColumnIndexSync(headers, [
      'calcium (mg/100 g)', 'calcium', 'ca'
    ]),
    iron: findColumnIndexSync(headers, [
      'fer (mg/100 g)', 'fer', 'iron', 'fe'
    ]),
    magnesium: findColumnIndexSync(headers, [
      'magnésium (mg/100 g)', 'magnesium', 'mg'
    ]),
    potassium: findColumnIndexSync(headers, [
      'potassium (mg/100 g)', 'potassium', 'k'
    ]),
    sodium: findColumnIndexSync(headers, [
      'sodium (mg/100 g)', 'sodium', 'na'
    ]),
    vitamin_c: findColumnIndexSync(headers, [
      'vitamine c (mg/100 g)', 'vitamin c', 'vitamin c', 'vit c'
    ]),
    vitamin_d: findColumnIndexSync(headers, [
      'vitamine d (µg/100 g)', 'vitamin d', 'vitamine d', 'vit d'
    ]),
    salt: findColumnIndexSync(headers, [
      'sel chlorure de sodium (g/100 g)', 'sel', 'salt'
    ])
  };
  
  console.log('🗂️ Mapping des colonnes:', mapping);
  return mapping;
};
