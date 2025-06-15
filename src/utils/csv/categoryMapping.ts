
import { dynamicDataService } from '@/services/dynamicDataService';

// Cache pour éviter les appels répétés à la base de données
let categoryMappingCache: { [key: string]: string } | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fonction pour normaliser les noms de catégories
export const normalizeCategory = (category: string): string => {
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

// Fonction pour charger le mapping depuis Supabase
const loadCategoryMapping = async (): Promise<{ [key: string]: string }> => {
  try {
    const mappings = await dynamicDataService.getCategoryMappings();
    const mappingObject: { [key: string]: string } = {};
    
    mappings.forEach(mapping => {
      mappingObject[normalizeCategory(mapping.ciqual_category)] = mapping.simplified_category;
    });
    
    return mappingObject;
  } catch (error) {
    console.error('Error loading category mappings:', error);
    // Fallback vers un mapping minimal en cas d'erreur
    return {
      'legumes': 'vegetables',
      'fruits': 'fruits',
      'viandes': 'proteins',
      'poissons': 'proteins',
      'produits laitiers': 'dairy',
      'cereales': 'grains',
      'matieres grasses': 'fats'
    };
  }
};

export const mapCategory = async (originalCategory: string): Promise<string> => {
  if (!originalCategory) {
    console.log('⚠️ Catégorie vide ou null');
    return 'snacks';
  }
  
  const normalized = normalizeCategory(originalCategory);
  console.log(`🔍 Mapping catégorie: "${originalCategory}" -> "${normalized}"`);
  
  // Vérifier le cache
  const now = Date.now();
  if (!categoryMappingCache || (now - cacheTimestamp) > CACHE_DURATION) {
    console.log('🔄 Rechargement du cache des catégories...');
    categoryMappingCache = await loadCategoryMapping();
    cacheTimestamp = now;
  }
  
  const mapped = categoryMappingCache[normalized];
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

// Version synchrone pour la compatibilité avec l'ancien code
export const mapCategorySync = (originalCategory: string): string => {
  if (!originalCategory) return 'snacks';
  
  const normalized = normalizeCategory(originalCategory);
  
  // Utiliser le cache s'il est disponible
  if (categoryMappingCache && categoryMappingCache[normalized]) {
    return categoryMappingCache[normalized];
  }
  
  // Sinon utiliser la recherche flexible
  const flexibleMapping = findFlexibleMapping(normalized);
  return flexibleMapping || 'snacks';
};
