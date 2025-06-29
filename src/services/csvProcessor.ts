
import supabase from '@/lib/supabase';
import { ImportStats, ImportError } from '@/types/import';
import { detectSeparator, parseCSVLine, createColumnMappingSync } from '@/utils/csvUtils';
import { validateFoodItem, createFoodItem } from '@/utils/foodValidation';

export class CSVProcessor {
  async processCSVData(
    csvContent: string,
    setStats: (stats: ImportStats) => void
  ): Promise<{ successful: number; errors: ImportError[] }> {
    console.log('🚀 Démarrage du traitement CSV...');
    
    const lines = csvContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (lines.length < 2) {
      throw new Error('Fichier CSV vide ou invalide');
    }

    const separator = detectSeparator(lines[0]);
    console.log('🔍 Séparateur détecté:', separator === '\t' ? 'TAB' : separator);

    const headers = parseCSVLine(lines[0], separator);
    console.log('📋 Headers trouvés (premiers 15):', headers.slice(0, 15));
    
    // Utiliser la version synchrone pour le mapping des colonnes
    const columnMapping = createColumnMappingSync(headers);
    console.log('🗂️ Mapping des colonnes:', columnMapping);

    if (columnMapping.name === -1) {
      throw new Error('Colonne nom non trouvée. Colonnes disponibles: ' + headers.join(', '));
    }

    if (columnMapping.category === -1) {
      console.warn('⚠️ Colonne catégorie non trouvée - toutes les catégories seront "snacks"');
    }

    const total = lines.length - 1;
    setStats({ total, processed: 0, successful: 0, errors: 0 });
    
    const batchSize = 10;
    const newErrors: ImportError[] = [];
    let processed = 0;
    let successful = 0;
    
    // Suivi des catégories pour debug
    const categoryStats = new Map<string, number>();

    for (let i = 1; i < lines.length; i += batchSize) {
      const batch = lines.slice(i, i + batchSize);
      const foodItems = [];

      for (let j = 0; j < batch.length; j++) {
        const rowIndex = i + j;
        
        try {
          const row = parseCSVLine(batch[j], separator);
          
          if (row.length < 2) {
            newErrors.push({
              row: rowIndex,
              error: 'Ligne invalide (trop peu de colonnes)',
              data: { raw: batch[j] }
            });
            continue;
          }

          const name = row[columnMapping.name]?.trim();
          
          if (!name) {
            newErrors.push({
              row: rowIndex,
              error: 'Nom manquant',
              data: { name }
            });
            continue;
          }

          const originalCategory = columnMapping.category !== -1 ? row[columnMapping.category]?.trim() : '';
          console.log(`📝 Ligne ${rowIndex}: "${name}" - catégorie originale: "${originalCategory}"`);

          const foodItem = createFoodItem(row, columnMapping);
          
          // Suivi des statistiques de catégories
          const finalCategory = foodItem.category;
          categoryStats.set(finalCategory, (categoryStats.get(finalCategory) || 0) + 1);

          const validation = validateFoodItem(foodItem);
          if (!validation.isValid) {
            newErrors.push({
              row: rowIndex,
              error: `Validation: ${validation.errors.join(', ')}`,
              data: { name: foodItem.name, issues: validation.errors }
            });
            continue;
          }

          foodItems.push(foodItem);
          
        } catch (error) {
          newErrors.push({
            row: rowIndex,
            error: `Erreur parsing: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
            data: { raw: batch[j] }
          });
        }
      }

      if (foodItems.length > 0) {
        try {
          console.log(`💾 Insertion de ${foodItems.length} aliments...`);
          const { error } = await supabase
            .from('foods')
            .insert(foodItems);

          if (error) {
            console.error('❌ Erreur insertion:', error);
            for (const item of foodItems) {
              newErrors.push({
                row: i,
                error: `Erreur DB pour "${item.name}": ${error.message}`,
                data: item
              });
            }
          } else {
            successful += foodItems.length;
            console.log(`✅ ${foodItems.length} aliments insérés avec succès`);
          }
        } catch (error) {
          console.error('❌ Erreur batch:', error);
          newErrors.push({
            row: i,
            error: `Erreur batch: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
            data: foodItems.map(f => f.name)
          });
        }
      }

      processed += batch.length;
      setStats({
        total,
        processed,
        successful,
        errors: newErrors.length
      });

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Affichage des statistiques de catégories
    console.log('📊 Statistiques des catégories:');
    categoryStats.forEach((count, category) => {
      console.log(`  - ${category}: ${count} aliments`);
    });

    return { successful, errors: newErrors };
  }
}

export const csvProcessor = new CSVProcessor();
