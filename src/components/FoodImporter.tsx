
import React, { useState, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { useSupabaseFoodStore } from '../stores/useSupabaseFoodStore';
import { ImportStats, ImportError } from '@/types/import';
import { csvProcessor } from '@/services/csvProcessor';
import FileUploadArea from './import/FileUploadArea';
import ImportProgress from './import/ImportProgress';
import ImportErrors from './import/ImportErrors';

const FoodImporter = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [stats, setStats] = useState<ImportStats>({ total: 0, processed: 0, successful: 0, errors: 0 });
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const { refreshData } = useSupabaseFoodStore();

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
      
      const result = await csvProcessor.processCSVData(csvContent, setStats);

      toast({
        title: "Import terminé",
        description: `${result.successful} aliments importés avec succès. ${result.errors.length} erreurs.`,
        variant: result.errors.length > 0 ? "destructive" : "default"
      });

      if (result.successful > 0) {
        setTimeout(() => {
          refreshData();
        }, 1000);
      }

      setErrors(result.errors);

    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      toast({
        title: "Erreur d'import",
        description: error instanceof Error ? error.message : "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  }, [user, isAdmin, toast, refreshData]);

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
          <FileUploadArea onFileUpload={handleFileUpload} isImporting={isImporting} />
          <ImportProgress stats={stats} isImporting={isImporting} />
          <ImportErrors 
            errors={errors} 
            showErrors={showErrors} 
            onToggleErrors={() => setShowErrors(!showErrors)} 
          />
        </div>
      </div>
    </div>
  );
};

export default FoodImporter;
