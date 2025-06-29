
import supabase from '@/lib/supabase';
import { Database } from '@/types/supabase';

type UserRole = Database['public']['Enums']['app_role'];

export interface UserWithRole {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

class RoleService {
  async getUserRole(userId: string): Promise<UserRole | null> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_role', { _user_id: userId });

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data as UserRole;
    } catch (error) {
      console.error('Error in getUserRole:', error);
      return null;
    }
  }

  async hasRole(userId: string, role: UserRole): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('has_role', { _user_id: userId, _role: role });

      if (error) {
        console.error('Error checking user role:', error);
        return false;
      }

      return data as boolean;
    } catch (error) {
      console.error('Error in hasRole:', error);
      return false;
    }
  }

  async isAdmin(userId: string): Promise<boolean> {
    return this.hasRole(userId, 'admin');
  }

  async assignRole(userId: string, role: UserRole): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });

      if (error) {
        console.error('Error assigning role:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in assignRole:', error);
      return false;
    }
  }

  async getAllUsersWithRoles(): Promise<UserWithRole[]> {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, name');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return [];
      }

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
        return [];
      }

      const roleMap = new Map(roles?.map(r => [r.user_id, r.role]) || []);

      return profiles?.map(profile => ({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: roleMap.get(profile.id) || 'user'
      })) || [];
    } catch (error) {
      console.error('Error in getAllUsersWithRoles:', error);
      return [];
    }
  }
}

export const roleService = new RoleService();
