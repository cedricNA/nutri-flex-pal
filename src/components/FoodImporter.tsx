
import React, { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';

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

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === '\t' && !inQuotes) { // Utiliser tabulation au lieu de virgule
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const mapCategory = (originalCategory: string): string => {
    const normalized = originalCategory.toLowerCase().trim();
    return CATEGORY_MAPPING[normalized] || 'snacks';
  };

  const parseNumericValue = (value: string): number => {
    if (!value || value === '' || value === '-' || value === 'traces' || value === '<') return 0;
    
    // Nettoyer la valeur - remplacer virgule par point
    let cleanValue = value.replace(',', '.').replace(/[^\d.-]/g, '');
    
    if (!cleanValue) return 0;
    
    const num = parseFloat(cleanValue);
    
    if (isNaN(num)) return 0;
    
    // Limiter les valeurs extrêmes
    if (num > 999999) return 999999;
    if (num < -999999) return -999999;
    
    return Math.round(num * 100) / 100;
  };

  const validateFoodItem = (foodItem: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Vérifier que le nom existe et n'est pas un code
    if (!foodItem.name || foodItem.name.trim() === '') {
      errors.push('Nom manquant');
    } else if (foodItem.name.match(/^\d+$/)) {
      errors.push('Nom invalide (code numérique uniquement)');
    } else if (foodItem.name.includes(':::')) {
      errors.push('Nom corrompu (contient :::)');
    }
    
    // Validation nutritionnelle plus permissive
    if (foodItem.calories < 0 || foodItem.calories > 9000) {
      errors.push(`Calories invalides: ${foodItem.calories}`);
    }
    
    if (foodItem.protein < 0 || foodItem.protein > 200) {
      errors.push(`Protéines invalides: ${foodItem.protein}`);
    }
    
    if (foodItem.carbs < 0 || foodItem.carbs > 200) {
      errors.push(`Glucides invalides: ${foodItem.carbs}`);
    }
    
    if (foodItem.fat < 0 || foodItem.fat > 200) {
      errors.push(`Lipides invalides: ${foodItem.fat}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const processCSVData = useCallback(async (csvContent: string) => {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = parseCSVLine(lines[0]);
    
    console.log('Headers found:', headers);
    console.log('First few headers:', headers.slice(0, 10));
    
    // Mapping basé sur le fichier CSV CIQUAL que vous avez partagé
    const columnMapping = {
      code: headers.findIndex(h => h.includes('alim_code')),
      name: headers.findIndex(h => h.includes('alim_nom_fr')),
      category: headers.findIndex(h => h.includes('alim_grp_nom_fr')),
      // Chercher les colonnes d'énergie (en kJ puis conversion en kcal)
      calories: headers.findIndex(h => h.includes('Energie') && h.includes('kJ')),
      protein: headers.findIndex(h => h.includes('Protéines') && h.includes('g/100')),
      carbs: headers.findIndex(h => h.includes('Glucides') && h.includes('g/100')),
      fat: headers.findIndex(h => h.includes('Lipides') && h.includes('g/100')),
      fiber: headers.findIndex(h => h.includes('Fibres') && h.includes('g/100')),
      calcium: headers.findIndex(h => h.includes('Calcium') && h.includes('mg/100')),
      iron: headers.findIndex(h => h.includes('Fer') && h.includes('mg/100')),
      magnesium: headers.findIndex(h => h.includes('Magnésium') && h.includes('mg/100')),
      potassium: headers.findIndex(h => h.includes('Potassium') && h.includes('mg/100')),
      sodium: headers.findIndex(h => h.includes('Sodium') && h.includes('mg/100')),
      vitamin_c: headers.findIndex(h => h.includes('Vitamine C') && h.includes('mg/100')),
      vitamin_d: headers.findIndex(h => h.includes('Vitamine D') && h.includes('μg/100')),
      salt: headers.findIndex(h => h.includes('Sel') && h.includes('g/100'))
    };

    console.log('Column mapping:', columnMapping);

    const total = lines.length - 1;
    setStats({ total, processed: 0, successful: 0, errors: 0 });
    
    const batchSize = 10; // Réduire la taille des lots
    const newErrors: ImportError[] = [];
    let processed = 0;
    let successful = 0;

    for (let i = 1; i < lines.length; i += batchSize) {
      const batch = lines.slice(i, i + batchSize);
      const foodItems = [];

      for (let j = 0; j < batch.length; j++) {
        const row = parseCSVLine(batch[j]);
        const rowIndex = i + j;

        try {
          // Récupérer le nom et vérifier qu'il existe
          const name = row[columnMapping.name]?.replace(/"/g, '').trim();
          const code = row[columnMapping.code]?.replace(/"/g, '').trim();
          
          console.log(`Row ${rowIndex}: name="${name}", code="${code}"`);
          
          if (!name || name === '' || name === code) {
            newErrors.push({
              row: rowIndex,
              error: `Nom manquant ou invalide: "${name}"`,
              data: { name, code }
            });
            continue;
          }

          const categoryRaw = row[columnMapping.category]?.replace(/"/g, '').trim();
          const category = mapCategory(categoryRaw || '');

          // Convertir kJ en kcal (diviser par 4.184)
          const energyKJ = parseNumericValue(row[columnMapping.calories] || '0');
          const calories = Math.round(energyKJ / 4.184);

          const foodItem = {
            name,
            category,
            calories,
            protein: parseNumericValue(row[columnMapping.protein] || '0'),
            carbs: parseNumericValue(row[columnMapping.carbs] || '0'),
            fat: parseNumericValue(row[columnMapping.fat] || '0'),
            fiber: parseNumericValue(row[columnMapping.fiber] || '0'),
            calcium: parseNumericValue(row[columnMapping.calcium] || '0'),
            iron: parseNumericValue(row[columnMapping.iron] || '0'),
            magnesium: parseNumericValue(row[columnMapping.magnesium] || '0'),
            potassium: parseNumericValue(row[columnMapping.potassium] || '0'),
            sodium: parseNumericValue(row[columnMapping.sodium] || '0'),
            vitamin_c: parseNumericValue(row[columnMapping.vitamin_c] || '0'),
            vitamin_d: parseNumericValue(row[columnMapping.vitamin_d] || '0'),
            salt: parseNumericValue(row[columnMapping.salt] || '0'),
            unit: '100g'
          };

          const validation = validateFoodItem(foodItem);
          if (!validation.isValid) {
            newErrors.push({
              row: rowIndex,
              error: `Validation échouée: ${validation.errors.join(', ')}`,
              data: foodItem
            });
            continue;
          }

          foodItems.push(foodItem);
        } catch (error) {
          newErrors.push({
            row: rowIndex,
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            data: row
          });
        }
      }

      if (foodItems.length > 0) {
        try {
          console.log(`Insertion de ${foodItems.length} aliments...`);
          const { error } = await supabase
            .from('foods')
            .insert(foodItems);

          if (error) {
            console.error('Erreur lors de l\'insertion:', error);
            // Insérer un par un pour identifier les problèmes
            for (const item of foodItems) {
              try {
                const { error: singleError } = await supabase
                  .from('foods')
                  .insert([item]);
                
                if (singleError) {
                  newErrors.push({
                    row: i,
                    error: `Erreur insertion ${item.name}: ${singleError.message}`,
                    data: item
                  });
                } else {
                  successful++;
                }
              } catch (singleInsertError) {
                newErrors.push({
                  row: i,
                  error: `Erreur insertion ${item.name}: ${singleInsertError instanceof Error ? singleInsertError.message : 'Erreur inconnue'}`,
                  data: item
                });
              }
            }
          } else {
            successful += foodItems.length;
            console.log(`${foodItems.length} aliments insérés avec succès`);
          }
        } catch (error) {
          console.error('Erreur lors de l\'insertion batch:', error);
          newErrors.push({
            row: i,
            error: `Erreur batch: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
            data: foodItems
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

      // Pause entre les lots
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setErrors(newErrors);
    return { successful, errors: newErrors.length };
  }, []);

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
      let csvContent = '';

      if (file.name.endsWith('.csv')) {
        csvContent = await file.text();
      } else if (file.name.endsWith('.txt')) {
        // Accepter aussi les fichiers .txt qui peuvent être du CSV
        csvContent = await file.text();
      } else if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
        toast({
          title: "Format non supporté directement",
          description: "Veuillez convertir votre fichier Excel en CSV ou TXT avec séparateurs tabulation.",
          variant: "destructive"
        });
        setIsImporting(false);
        return;
      } else {
        toast({
          title: "Format non supporté",
          description: "Seuls les fichiers .csv et .txt sont supportés.",
          variant: "destructive"
        });
        setIsImporting(false);
        return;
      }

      const result = await processCSVData(csvContent);

      toast({
        title: "Import terminé",
        description: `${result.successful} aliments importés avec succès. ${result.errors} erreurs.`,
        variant: result.errors > 0 ? "destructive" : "default"
      });

    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      toast({
        title: "Erreur d'import",
        description: error instanceof Error ? error.message : "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  }, [user, isAdmin, processCSVData, toast]);

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
            <h3 className="font-semibold text-blue-900 mb-2">Instructions pour format CIQUAL</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Exportez votre fichier en CSV ou TXT avec séparateurs tabulation</li>
              <li>• Assurez-vous que les colonnes 'alim_nom_fr' et 'alim_grp_nom_fr' sont présentes</li>
              <li>• Les colonnes nutritionnelles doivent être au format 'Nutriment (unité/100 g)'</li>
              <li>• L'import filtre automatiquement les codes numériques sans nom</li>
              <li>• Validation renforcée pour éviter les données corrompues</li>
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
                Format CIQUAL avec séparateurs tabulation
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
