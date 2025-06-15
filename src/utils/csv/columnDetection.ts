
import { normalizeCategory } from './categoryMapping';
import { ColumnMapping } from '@/types/import';

export const findColumnIndex = (headers: string[], possibleNames: string[]): number => {
  for (const name of possibleNames) {
    const normalizedName = normalizeCategory(name);
    const index = headers.findIndex(h => h && normalizeCategory(h) === normalizedName);
    if (index !== -1) return index;
  }
  return -1;
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
