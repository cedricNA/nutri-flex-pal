
import supabase from '@/lib/supabase';
import { mapCategory } from './csvUtils';

export interface CategoryCleanupResult {
  totalUpdated: number;
  categoryStats: Record<string, number>;
  errors: string[];
}

export const cleanupExistingCategories = async (): Promise<CategoryCleanupResult> => {
  const errors: string[] = [];
  let totalUpdated = 0;
  const categoryStats: Record<string, number> = {};

  try {
    console.log('🧹 Démarrage du nettoyage des catégories...');

    // Récupérer tous les aliments avec des catégories à nettoyer
    const { data: foods, error: fetchError } = await supabase
      .from('foods')
      .select('id, name, category')
      .or('category.eq.snacks,category.eq.fats')
      .limit(1000);

    if (fetchError) {
      errors.push(`Erreur lors de la récupération: ${fetchError.message}`);
      return { totalUpdated: 0, categoryStats, errors };
    }

    if (!foods || foods.length === 0) {
      console.log('✅ Aucun aliment à nettoyer trouvé');
      return { totalUpdated: 0, categoryStats, errors };
    }

    console.log(`📊 ${foods.length} aliments à analyser`);

    // Traiter par batches
    const batchSize = 50;
    for (let i = 0; i < foods.length; i += batchSize) {
      const batch = foods.slice(i, i + batchSize);
      const updates = [];

      for (const food of batch) {
        // Essayer de deviner la catégorie à partir du nom
        const guessedCategory = guessCategoryFromName(food.name);
        if (guessedCategory && guessedCategory !== food.category) {
          updates.push({
            id: food.id,
            category: guessedCategory
          });
          categoryStats[guessedCategory] = (categoryStats[guessedCategory] || 0) + 1;
        }
      }

      if (updates.length > 0) {
        const { error: updateError } = await supabase
          .from('foods')
          .upsert(updates);

        if (updateError) {
          errors.push(`Erreur mise à jour batch ${i}: ${updateError.message}`);
        } else {
          totalUpdated += updates.length;
          console.log(`✅ Batch ${Math.floor(i/batchSize) + 1}: ${updates.length} aliments mis à jour`);
        }
      }

      // Pause entre les batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('📈 Statistiques de nettoyage:', categoryStats);
    return { totalUpdated, categoryStats, errors };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    errors.push(errorMessage);
    return { totalUpdated, categoryStats, errors };
  }
};

const guessCategory = (name: string): string => {
  const lowerName = name.toLowerCase();
  
  // Fruits
  if (lowerName.includes('pomme') || lowerName.includes('poire') || lowerName.includes('banane') ||
      lowerName.includes('orange') || lowerName.includes('citron') || lowerName.includes('raisin') ||
      lowerName.includes('fraise') || lowerName.includes('cerise') || lowerName.includes('abricot') ||
      lowerName.includes('pêche') || lowerName.includes('prune') || lowerName.includes('ananas') ||
      lowerName.includes('mangue') || lowerName.includes('kiwi') || lowerName.includes('melon')) {
    return 'fruits';
  }
  
  // Légumes
  if (lowerName.includes('carotte') || lowerName.includes('tomate') || lowerName.includes('salade') ||
      lowerName.includes('épinard') || lowerName.includes('courgette') || lowerName.includes('brocoli') ||
      lowerName.includes('chou') || lowerName.includes('poivron') || lowerName.includes('concombre') ||
      lowerName.includes('radis') || lowerName.includes('betterave') || lowerName.includes('navet') ||
      lowerName.includes('pomme de terre') || lowerName.includes('patate')) {
    return 'vegetables';
  }
  
  // Protéines
  if (lowerName.includes('viande') || lowerName.includes('bœuf') || lowerName.includes('porc') ||
      lowerName.includes('agneau') || lowerName.includes('poulet') || lowerName.includes('dinde') ||
      lowerName.includes('poisson') || lowerName.includes('saumon') || lowerName.includes('thon') ||
      lowerName.includes('œuf') || lowerName.includes('oeuf') || lowerName.includes('lentille') ||
      lowerName.includes('haricot') || lowerName.includes('pois chiche')) {
    return 'proteins';
  }
  
  // Produits laitiers
  if (lowerName.includes('lait') || lowerName.includes('fromage') || lowerName.includes('yaourt') ||
      lowerName.includes('yogurt') || lowerName.includes('beurre') || lowerName.includes('crème')) {
    return 'dairy';
  }
  
  // Céréales
  if (lowerName.includes('pain') || lowerName.includes('riz') || lowerName.includes('pâtes') ||
      lowerName.includes('blé') || lowerName.includes('avoine') || lowerName.includes('quinoa') ||
      lowerName.includes('céréale') || lowerName.includes('farine')) {
    return 'grains';
  }
  
  // Huiles et graisses
  if (lowerName.includes('huile') || lowerName.includes('olive') || lowerName.includes('margarine')) {
    return 'fats';
  }
  
  return 'snacks'; // Par défaut
};

// Version améliorée qui utilise le mapping existant
const guessCategoryFromName = (name: string): string => {
  // D'abord essayer la logique simple
  let category = guessCategory(name);
  
  // Si c'est encore "snacks", essayer avec des mots-clés plus spécifiques
  if (category === 'snacks') {
    const lowerName = name.toLowerCase();
    
    // Recherche de mots-clés dans le nom pour deviner la catégorie
    const keywords = {
      'fruits': ['fruit', 'jus de fruit', 'compote', 'confiture'],
      'vegetables': ['légume', 'soupe de légume', 'purée de légume'],
      'proteins': ['protéine', 'viande', 'poisson'],
      'dairy': ['lactique', 'lacté'],
      'grains': ['féculent', 'céréale'],
      'fats': ['gras', 'lipide']
    };
    
    for (const [cat, words] of Object.entries(keywords)) {
      if (words.some(word => lowerName.includes(word))) {
        category = cat;
        break;
      }
    }
  }
  
  return category;
};
