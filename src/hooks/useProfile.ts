import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { profileService } from '@/services/supabaseServices';
import type { Database } from '@/types/supabase';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await profileService.getProfile(user.id);
        setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<ProfileRow>) => {
    if (!user) return;
    await profileService.updateProfile(user.id, updates);
    setProfile(prev => (prev ? { ...prev, ...updates } : prev));
  };

  return { profile, loading, updateProfile };
};
