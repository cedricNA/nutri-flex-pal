
import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

interface FileUploadAreaProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isImporting: boolean;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ onFileUpload, isImporting }) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Fichier CSV avec des noms de colonnes français ou anglais</li>
          <li>• Colonnes détectées automatiquement (nom, calories, protéines, etc.)</li>
          <li>• Format flexible avec séparateurs : virgule, point-virgule ou tabulation</li>
          <li>• Validation automatique des données</li>
        </ul>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          accept=".csv,.txt"
          onChange={onFileUpload}
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
            {isImporting ? 'Import en cours...' : 'Sélectionner un fichier CSV'}
          </p>
          <p className="text-sm text-gray-500">
            Format CSV avec colonnes françaises ou anglaises
          </p>
        </label>
      </div>
    </div>
  );
};

export default FileUploadArea;
