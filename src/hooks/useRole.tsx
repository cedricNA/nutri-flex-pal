
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { roleService } from '@/services/roleService';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['app_role'];

export const useRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const userRole = await roleService.getUserRole(user.id);
        const adminStatus = await roleService.isAdmin(user.id);
        
        setRole(userRole);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('user'); // Fallback to 'user' role
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return {
    role,
    isAdmin,
    loading,
    hasRole: (requiredRole: UserRole) => role === requiredRole,
    refresh: async () => {
      if (user) {
        setLoading(true);
        const userRole = await roleService.getUserRole(user.id);
        const adminStatus = await roleService.isAdmin(user.id);
        setRole(userRole);
        setIsAdmin(adminStatus);
        setLoading(false);
      }
    }
  };
};
