
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FoodLibrarySupabase from './FoodLibrarySupabase';
import FoodImporter from './FoodImporter';
import { Database, Upload } from 'lucide-react';

const FoodLibraryAdmin = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Administration - Aliments</h1>
      </div>

      <Tabs defaultValue="library" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="library" className="flex items-center space-x-2">
            <Database size={18} />
            <span>Bibliothèque</span>
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center space-x-2">
            <Upload size={18} />
            <span>Import CSV</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="library">
          <FoodLibrarySupabase />
        </TabsContent>
        
        <TabsContent value="import">
          <FoodImporter />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FoodLibraryAdmin;
