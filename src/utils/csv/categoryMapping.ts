
const CATEGORY_MAPPING: { [key: string]: string } = {
  // Fruits et légumes
  'fruits': 'fruits',
  'legumes': 'vegetables',
  'pommes de terre et autres tubercules': 'vegetables',
  'salades composees et crudites': 'vegetables',
  
  // Protéines
  'viandes crues': 'proteins',
  'viandes cuites': 'proteins',
  'poissons cuits': 'proteins',
  'mollusques et crustaces crus': 'proteins',
  'mollusques et crustaces cuits': 'proteins',
  'produits a base de poissons et produits de la mer': 'proteins',
  'autres produits a base de viande': 'proteins',
  'charcuteries et assimiles': 'proteins',
  'substitus de produits carnes': 'proteins',
  'oeufs': 'proteins',
  'legumineuses': 'proteins',
  'fruits a coque et graines oleagineuses': 'proteins',
  
  // Produits laitiers
  'laits': 'dairy',
  'laits et boissons infantiles': 'dairy',
  'fromages et assimiles': 'dairy',
  'desserts lactes': 'dairy',
  'produits laitiers frais et assimiles': 'dairy',
  'cremes et specialites a base de creme': 'dairy',
  'aliments infantiles': 'dairy',
  'desserts infantiles': 'dairy',
  
  // Céréales et dérivés
  'pains et assimiles': 'grains',
  'pates, riz et cereales': 'grains',
  'cereales de petit-dejeuner': 'grains',
  'cereales et biscuits infantiles': 'grains',
  'viennoiseries': 'grains',
  'barres cerealeres': 'grains',
  'plats composes': 'grains',
  'sandwichs': 'grains',
  'pizzas, tartes et crepes salees': 'grains',
  'feuilletees et autres entrees': 'grains',
  'soupes': 'grains',
  'petits pots sales et plats infantiles': 'grains',
  
  // Matières grasses
  'beurres': 'fats',
  'huiles et graisses vegetales': 'fats',
  'huiles de poissons': 'fats',
  'autres matieres grasses': 'fats',
  'margarines': 'fats',
  
  // Snacks et sucreries (tout le reste)
  'sucres, miels et assimiles': 'snacks',
  'confiseries non chocolatees': 'snacks',
  'chocolats et produits a base de chocolat': 'snacks',
  'biscuits sucres': 'snacks',
  'biscuits aperitifs': 'snacks',
  'gateaux et patisseries': 'snacks',
  'glaces': 'snacks',
  'desserts glaces': 'snacks',
  'sorbets': 'snacks',
  'confitures et assimiles': 'snacks',
  'boissons sans alcool': 'snacks',
  'boisson alcoolisees': 'snacks',
  'eaux': 'snacks',
  'epices': 'snacks',
  'condiments': 'snacks',
  'herbes': 'snacks',
  'sauces': 'snacks',
  'sels': 'snacks',
  'aides culinaires': 'snacks',
  'ingredients divers': 'snacks',
  'algues': 'snacks',
  'denrees destinees a une alimentation particuliere': 'snacks'
};

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
