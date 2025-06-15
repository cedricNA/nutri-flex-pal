
import React from 'react';
import { ImportError } from '@/types/import';

interface ImportErrorsProps {
  errors: ImportError[];
  showErrors: boolean;
  onToggleErrors: () => void;
}

const ImportErrors: React.FC<ImportErrorsProps> = ({ errors, showErrors, onToggleErrors }) => {
  if (errors.length === 0) return null;

  return (
    <div className="bg-red-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-red-900">
          Erreurs d'import ({errors.length})
        </h3>
        <button
          onClick={onToggleErrors}
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
  );
};

export default ImportErrors;
