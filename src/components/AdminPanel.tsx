
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Shield, UserCog, Database } from 'lucide-react';
import { roleService, UserWithRole } from '@/services/roleService';
import { useToast } from '@/hooks/use-toast';
import { Database as DatabaseType } from '@/integrations/supabase/types';
import FoodLibraryAdmin from './FoodLibraryAdmin';

type UserRole = DatabaseType['public']['Enums']['app_role'];

const AdminPanel = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'foods'>('users');
  const { toast } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersWithRoles = await roleService.getAllUsersWithRoles();
      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des utilisateurs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const success = await roleService.assignRole(userId, newRole);
      
      if (success) {
        toast({
          title: "Rôle mis à jour",
          description: "Le rôle de l'utilisateur a été modifié avec succès"
        });
        
        // Mettre à jour la liste locale
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de modifier le rôle",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error changing role:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du rôle",
        variant: "destructive"
      });
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    return role === 'admin' ? 'destructive' : 'default';
  };

  const getRoleIcon = (role: UserRole) => {
    return role === 'admin' ? Shield : UserCog;
  };

  // Fixed: Return content based on activeTab without type error
  if (activeTab === 'foods') {
    return <FoodLibraryAdmin />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
            className="flex items-center space-x-2"
          >
            <Users size={18} />
            <span>Utilisateurs</span>
          </Button>
          <Button
            variant={activeTab === 'foods' ? 'default' : 'outline'}
            onClick={() => setActiveTab('foods')}
            className="flex items-center space-x-2"
          >
            <Database size={18} />
            <span>Aliments</span>
          </Button>
        </div>
      </div>

      {/* Users management content - only shown when activeTab is 'users' */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="text-blue-500" size={24} />
            <span>Gestion des utilisateurs</span>
          </CardTitle>
          <CardDescription>
            Gérez les rôles et permissions des utilisateurs de l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {users.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Aucun utilisateur trouvé</p>
              ) : (
                users.map((user) => {
                  const RoleIcon = getRoleIcon(user.role);
                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center space-x-1">
                          <RoleIcon size={14} />
                          <span>{user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</span>
                        </Badge>
                        
                        <Select
                          value={user.role}
                          onValueChange={(newRole: UserRole) => handleRoleChange(user.id, newRole)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Utilisateur</SelectItem>
                            <SelectItem value="admin">Administrateur</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="text-blue-500" size={20} />
                <span className="font-medium">Total utilisateurs</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-2">{users.length}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <UserCog className="text-green-500" size={20} />
                <span className="font-medium">Utilisateurs</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {users.filter(u => u.role === 'user').length}
              </p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Shield className="text-red-500" size={20} />
                <span className="font-medium">Administrateurs</span>
              </div>
              <p className="text-2xl font-bold text-red-600 mt-2">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
