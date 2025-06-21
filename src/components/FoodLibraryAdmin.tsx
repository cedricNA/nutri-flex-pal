
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FoodLibrarySupabase from './FoodLibrarySupabase';
import FoodImporter from './FoodImporter';
import FoodDataCleaner from './FoodDataCleaner';
import { Database, Upload, Trash2 } from 'lucide-react';
import { useRole } from '@/hooks/useRole';

const FoodLibraryAdmin = () => {
  const { isAdmin } = useRole();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Administration - Aliments</h1>
      </div>

      <Tabs defaultValue="library" className="space-y-6">
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-3' : 'grid-cols-1'}`}>
          <TabsTrigger value="library" className="flex items-center space-x-2">
            <Database size={18} />
            <span>Bibliothèque</span>
          </TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="import" className="flex items-center space-x-2">
                <Upload size={18} />
                <span>Import CSV</span>
              </TabsTrigger>
              <TabsTrigger value="cleanup" className="flex items-center space-x-2">
                <Trash2 size={18} />
                <span>Nettoyage</span>
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="library">
          <FoodLibrarySupabase />
        </TabsContent>

        {isAdmin && (
          <>
            <TabsContent value="import">
              <FoodImporter />
            </TabsContent>

            <TabsContent value="cleanup">
              <FoodDataCleaner />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default FoodLibraryAdmin;
