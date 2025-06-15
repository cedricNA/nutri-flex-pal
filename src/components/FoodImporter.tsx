import React, { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { useSupabaseFoodStore } from '../stores/useSupabaseFoodStore';

interface ImportStats {
  total: number;
  processed: number;
  successful: number;
  errors: number;
}

interface ImportError {
  row: number;
  error: string;
  data: any;
}

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

const FoodImporter = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [stats, setStats] = useState<ImportStats>({ total: 0, processed: 0, successful: 0, errors: 0 });
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const { refreshData } = useSupabaseFoodStore();

  const detectSeparator = (line: string): string => {
    const separators = ['\t', ';', ','];
    const counts = separators.map(sep => (line.match(new RegExp(sep, 'g')) || []).length);
    const maxIndex = counts.indexOf(Math.max(...counts));
    return separators[maxIndex];
  };

  const parseCSVLine = (line: string, separator: string): string[] => {
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

  const mapCategory = (originalCategory: string): string => {
    if (!originalCategory) return 'snacks';
    const normalized = originalCategory.toLowerCase().trim();
    return CATEGORY_MAPPING[normalized] || 'snacks';
  };

  const parseNumericValue = (value: string): number => {
    if (!value || value === '' || value === '-' || value === 'traces' || value === '<' || value === 'nd') return 0;
    
    let cleanValue = value.replace(',', '.').replace(/[^\d.-]/g, '');
    
    if (!cleanValue) return 0;
    
    const num = parseFloat(cleanValue);
    
    if (isNaN(num)) return 0;
    
    if (num > 999999) return 999999;
    if (num < -999999) return -999999;
    
    return Math.round(num * 100) / 100;
  };

  const validateFoodItem = (foodItem: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!foodItem.name || foodItem.name.trim() === '') {
      errors.push('Nom manquant');
      return { isValid: false, errors };
    }
    
    // Validation plus stricte du nom
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

  const findColumnIndex = (headers: string[], patterns: string[]): number => {
    for (const pattern of patterns) {
      const index = headers.findIndex(h => 
        h && h.toLowerCase().includes(pattern.toLowerCase())
      );
      if (index !== -1) return index;
    }
    return -1;
  };

  const processCSVData = useCallback(async (csvContent: string) => {
    console.log('Starting CSV processing...');
    
    // Nettoyer le contenu
    const lines = csvContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (lines.length < 2) {
      throw new Error('Fichier CSV vide ou invalide');
    }

    // Détecter le séparateur
    const separator = detectSeparator(lines[0]);
    console.log('Detected separator:', separator === '\t' ? 'TAB' : separator);

    const headers = parseCSVLine(lines[0], separator);
    console.log('Headers found:', headers.slice(0, 10));
    
    // Recherche des colonnes avec patterns multiples
    const columnMapping = {
      name: findColumnIndex(headers, ['alim_nom_fr', 'nom_fr', 'nom', 'name']),
      category: findColumnIndex(headers, ['alim_grp_nom_fr', 'groupe_nom_fr', 'groupe', 'categorie', 'category']),
      calories: findColumnIndex(headers, ['energie_kcal', 'energie', 'energy', 'kcal', 'calories']),
      protein: findColumnIndex(headers, ['proteines', 'protéines', 'protein']),
      carbs: findColumnIndex(headers, ['glucides', 'carbohydrate', 'carbs']),
      fat: findColumnIndex(headers, ['lipides', 'fat', 'matiere_grasse']),
      fiber: findColumnIndex(headers, ['fibres', 'fiber']),
      calcium: findColumnIndex(headers, ['calcium']),
      iron: findColumnIndex(headers, ['fer', 'iron']),
      magnesium: findColumnIndex(headers, ['magnesium', 'magnésium']),
      potassium: findColumnIndex(headers, ['potassium']),
      sodium: findColumnIndex(headers, ['sodium']),
      vitamin_c: findColumnIndex(headers, ['vitamine_c', 'vitamin_c', 'vit_c']),
      vitamin_d: findColumnIndex(headers, ['vitamine_d', 'vitamin_d', 'vit_d']),
      salt: findColumnIndex(headers, ['sel', 'salt'])
    };

    console.log('Column mapping:', columnMapping);

    if (columnMapping.name === -1) {
      throw new Error('Colonne nom non trouvée. Colonnes disponibles: ' + headers.join(', '));
    }

    const total = lines.length - 1;
    setStats({ total, processed: 0, successful: 0, errors: 0 });
    
    const batchSize = 10;
    const newErrors: ImportError[] = [];
    let processed = 0;
    let successful = 0;

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

          const categoryRaw = columnMapping.category !== -1 ? row[columnMapping.category]?.trim() : '';
          const category = mapCategory(categoryRaw || '');

          // Conversion des valeurs nutritionnelles
          let calories = 0;
          if (columnMapping.calories !== -1 && row[columnMapping.calories]) {
            const energyValue = parseNumericValue(row[columnMapping.calories]);
            // Si > 1000, probablement en kJ, convertir en kcal
            calories = energyValue > 1000 ? Math.round(energyValue / 4.184) : energyValue;
          }

          const foodItem = {
            name,
            category,
            calories,
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

      // Insertion en base
      if (foodItems.length > 0) {
        try {
          console.log(`Insertion de ${foodItems.length} aliments...`);
          const { error } = await supabase
            .from('foods')
            .insert(foodItems);

          if (error) {
            console.error('Erreur insertion:', error);
            for (const item of foodItems) {
              newErrors.push({
                row: i,
                error: `Erreur DB pour "${item.name}": ${error.message}`,
                data: item
              });
            }
          } else {
            successful += foodItems.length;
            console.log(`${foodItems.length} aliments insérés avec succès`);
          }
        } catch (error) {
          console.error('Erreur batch:', error);
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

      // Petite pause pour éviter la surcharge
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Add refresh after successful import
    if (successful > 0) {
      console.log('Import successful, refreshing food library...');
      await refreshData();
    }

    setErrors(newErrors);
    return { successful, errors: newErrors.length };
  }, [refreshData]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user) {
      toast({
        title: "Accès refusé",
        description: "Vous devez être connecté pour importer des données.",
        variant: "destructive"
      });
      return;
    }

    if (!isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent importer des aliments.",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    setErrors([]);

    try {
      const csvContent = await file.text();
      console.log('File loaded, size:', csvContent.length, 'chars');
      
      const result = await processCSVData(csvContent);

      toast({
        title: "Import terminé",
        description: `${result.successful} aliments importés avec succès. ${result.errors} erreurs.`,
        variant: result.errors > 0 ? "destructive" : "default"
      });

      // Force refresh of the food library
      if (result.successful > 0) {
        setTimeout(() => {
          refreshData();
        }, 1000);
      }

    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      toast({
        title: "Erreur d'import",
        description: error instanceof Error ? error.message : "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = '';
    }
  }, [user, isAdmin, processCSVData, toast, refreshData]);

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="text-center py-12">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
            <p className="text-gray-600">
              Seuls les administrateurs peuvent importer des aliments dans la base de données.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Import d'aliments CIQUAL</h2>
        
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Fichier CSV/TXT (séparateurs: ; , ou tabulation)</li>
              <li>• Colonne requise : nom des aliments</li>
              <li>• Détection automatique des colonnes</li>
              <li>• Validation renforcée des données</li>
            </ul>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              disabled={isImporting}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className={`cursor-pointer ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FileSpreadsheet size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {isImporting ? 'Import en cours...' : 'Sélectionner un fichier CSV/TXT'}
              </p>
              <p className="text-sm text-gray-500">
                Format CIQUAL ou compatible
              </p>
            </label>
          </div>

          {isImporting && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progression</span>
                <span className="text-sm text-gray-500">
                  {stats.processed} / {stats.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.processed / stats.total) * 100}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{stats.successful}</div>
                  <div className="text-gray-500">Succès</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-600">{stats.processed}</div>
                  <div className="text-gray-500">Traités</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">{stats.errors}</div>
                  <div className="text-gray-500">Erreurs</div>
                </div>
              </div>
            </div>
          )}

          {errors.length > 0 && (
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-red-900">
                  Erreurs d'import ({errors.length})
                </h3>
                <button
                  onClick={() => setShowErrors(!showErrors)}
                  className="text-sm text-red-700 hover:text-red-900"
                >
                  {showErrors ? 'Masquer' : 'Afficher'}
                </button>
              </div>
              {showErrors && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {errors.slice(0, 10).map((error, index) => (
                    <div key={index} className="text-sm text-red-800 bg-red-100 rounded p-2">
                      <strong>Ligne {error.row}:</strong> {error.error}
                    </div>
                  ))}
                  {errors.length > 10 && (
                    <div className="text-sm text-red-700">
                      ... et {errors.length - 10} autres erreurs
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodImporter;
