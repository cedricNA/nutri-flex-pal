
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Trash2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabaseFoodService } from '@/services/supabaseFoodService';
import { useRole } from '@/hooks/useRole';

const FoodDataCleaner = () => {
  const [isCleaningData, setIsCleaningData] = useState(false);
  const [cleaningResults, setCleaningResults] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAdmin } = useRole();

  const handleCleanData = async () => {
    if (!isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent nettoyer les données.",
        variant: "destructive"
      });
      return;
    }

    setIsCleaningData(true);
    setCleaningResults(null);

    try {
      const success = await supabaseFoodService.cleanCorruptedData();
      
      if (success) {
        setCleaningResults("Données corrompues supprimées avec succès");
        toast({
          title: "Nettoyage terminé",
          description: "Les données corrompues ont été supprimées de la base de données.",
        });
      } else {
        setCleaningResults("Erreur lors du nettoyage des données");
        toast({
          title: "Erreur",
          description: "Impossible de nettoyer les données corrompues.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
      setCleaningResults("Erreur inattendue lors du nettoyage");
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive"
      });
    } finally {
      setIsCleaningData(false);
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="text-red-500" size={24} />
            <span>Accès refusé</span>
          </CardTitle>
          <CardDescription>
            Seuls les administrateurs peuvent accéder aux outils de nettoyage des données.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trash2 className="text-blue-500" size={24} />
          <span>Nettoyage des données</span>
        </CardTitle>
        <CardDescription>
          Supprime les entrées d'aliments corrompues ou invalides de la base de données
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-yellow-50 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">Attention</h3>
          <p className="text-sm text-yellow-800">
            Cette action supprimera définitivement les aliments avec des noms corrompus ou invalides.
            Assurez-vous de faire une sauvegarde si nécessaire.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Critères de nettoyage :</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Noms contenant des caractères ":::"</li>
            <li>• Noms commençant par des chiffres et ":"</li>
            <li>• Noms vides ou null</li>
            <li>• Noms excessivement longs (+ de 200 caractères)</li>
          </ul>
        </div>

        <Button
          onClick={handleCleanData}
          disabled={isCleaningData}
          className="w-full"
          variant="destructive"
        >
          {isCleaningData ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Nettoyage en cours...
            </>
          ) : (
            <>
              <Trash2 size={18} className="mr-2" />
              Nettoyer les données corrompues
            </>
          )}
        </Button>

        {cleaningResults && (
          <div className={`rounded-lg p-4 ${
            cleaningResults.includes('succès') ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <div className="flex items-center space-x-2">
              {cleaningResults.includes('succès') ? (
                <CheckCircle className="text-green-500" size={20} />
              ) : (
                <AlertCircle className="text-red-500" size={20} />
              )}
              <span className={cleaningResults.includes('succès') ? 'text-green-800' : 'text-red-800'}>
                {cleaningResults}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodDataCleaner;
