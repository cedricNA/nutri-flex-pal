
import { storageService } from './storageService';
import { AppSettingsSchema, type AppSettings } from '../schemas';

class SettingsService {
  private listeners: ((settings: AppSettings) => void)[] = [];
  private currentSettings: AppSettings;

  constructor() {
    this.currentSettings = this.loadSettings();
    this.applySettings(this.currentSettings);
  }

  private loadSettings(): AppSettings {
    return storageService.get('app-settings');
  }

  private saveSettings(settings: AppSettings): void {
    storageService.set('app-settings', settings);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentSettings));
  }

  private applySettings(settings: AppSettings): void {
    // Apply dark mode
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply compact view
    if (settings.compactView) {
      document.body.classList.add('compact-view');
    } else {
      document.body.classList.remove('compact-view');
    }

    // Apply animations
    if (!settings.animations) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }

  getSettings(): AppSettings {
    return { ...this.currentSettings };
  }

  updateSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): void {
    const newSettings = { ...this.currentSettings, [key]: value };
    
    try {
      // Validate the new settings
      const validated = AppSettingsSchema.parse(newSettings);
      this.currentSettings = validated;
      this.saveSettings(validated);
      this.applySettings(validated);
      this.notifyListeners();
    } catch (error) {
      console.error('Invalid setting update:', error);
      throw new Error(`Invalid value for setting ${key}`);
    }
  }

  updateSettings(updates: Partial<AppSettings>): void {
    const newSettings = { ...this.currentSettings, ...updates };
    
    try {
      const validated = AppSettingsSchema.parse(newSettings);
      this.currentSettings = validated;
      this.saveSettings(validated);
      this.applySettings(validated);
      this.notifyListeners();
    } catch (error) {
      console.error('Invalid settings update:', error);
      throw new Error('Invalid settings provided');
    }
  }

  subscribe(listener: (settings: AppSettings) => void): () => void {
    this.listeners.push(listener);
    listener(this.currentSettings);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  reset(): void {
    const defaultSettings = AppSettingsSchema.parse({});
    this.currentSettings = defaultSettings;
    this.saveSettings(defaultSettings);
    this.applySettings(defaultSettings);
    this.notifyListeners();
  }
}

export const settingsService = new SettingsService();
