
import { useState, useEffect } from 'react';
import { settingsService } from '@/services/settingsService';
import { type AppSettings } from '@/schemas';

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(settingsService.getSettings());

  useEffect(() => {
    const unsubscribe = settingsService.subscribe(setSettings);
    return unsubscribe;
  }, []);

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    settingsService.updateSetting(key, value);
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    settingsService.updateSettings(updates);
  };

  const resetSettings = () => {
    settingsService.reset();
  };

  return {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
  };
};
