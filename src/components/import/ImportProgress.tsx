
import React from 'react';
import { ImportStats } from '@/types/import';

interface ImportProgressProps {
  stats: ImportStats;
  isImporting: boolean;
}

const ImportProgress: React.FC<ImportProgressProps> = ({ stats, isImporting }) => {
  if (!isImporting) return null;

  return (
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
  );
};

export default ImportProgress;
