
import React from 'react';
import { Bell, Shield, Palette, Globe, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";

const SettingsPage = () => {
  const { toast } = useToast();
  const { settings, updateSetting, resetSettings } = useSettings();

  const handleSettingChange = (key: string, value: boolean | string) => {
    updateSetting(key as any, value);
    toast({
      title: "Paramètres mis à jour",
      description: "Vos préférences ont été enregistrées.",
    });
    console.log(`Paramètre ${key} modifié:`, value);
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
          <TabsTrigger value="general">Général</TabsTrigger>
        </TabsList>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} />
                Notifications et rappels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="mealReminders">Rappels de repas</Label>
                  <p className="text-sm text-gray-500">
                    Recevoir des notifications pour les heures de repas
                  </p>
                </div>
                <Switch
                  id="mealReminders"
                  checked={settings.mealReminders}
                  onCheckedChange={(checked) => handleSettingChange('mealReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="hydrationReminders">Rappels d'hydratation</Label>
                  <p className="text-sm text-gray-500">
                    Notifications pour boire de l'eau régulièrement
                  </p>
                </div>
                <Switch
                  id="hydrationReminders"
                  checked={settings.hydrationReminders}
                  onCheckedChange={(checked) => handleSettingChange('hydrationReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="weeklyReports">Rapports hebdomadaires</Label>
                  <p className="text-sm text-gray-500">
                    Résumé de votre progression chaque semaine
                  </p>
                </div>
                <Switch
                  id="weeklyReports"
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => handleSettingChange('weeklyReports', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="emailNotifications">Notifications par email</Label>
                  <p className="text-sm text-gray-500">
                    Recevoir les notifications importantes par email
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="pushNotifications">Notifications push</Label>
                  <p className="text-sm text-gray-500">
                    Notifications directement sur votre appareil
                  </p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Apparence */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette size={20} />
                Apparence et interface
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="darkMode" className="flex items-center gap-2">
                    {settings.darkMode ? <Moon size={16} /> : <Sun size={16} />}
                    Mode sombre
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Interface avec un thème sombre pour réduire la fatigue oculaire
                  </p>
                </div>
                <Switch
                  id="darkMode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="compactView">Vue compacte</Label>
                  <p className="text-sm text-muted-foreground">
                    Affichage plus dense pour voir plus d'informations
                  </p>
                </div>
                <Switch
                  id="compactView"
                  checked={settings.compactView}
                  onCheckedChange={(checked) => handleSettingChange('compactView', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="animations">Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer les transitions et animations de l'interface
                  </p>
                </div>
                <Switch
                  id="animations"
                  checked={settings.animations}
                  onCheckedChange={(checked) => handleSettingChange('animations', checked)}
                />
              </div>

              {/* Preview section */}
              <div className="mt-6 p-4 border rounded-lg bg-card">
                <h4 className="font-semibold mb-3">Aperçu des modifications</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${settings.darkMode ? 'bg-slate-800' : 'bg-white border'}`}></div>
                    <span>Thème: {settings.darkMode ? 'Sombre' : 'Clair'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${settings.compactView ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <span>Espacement: {settings.compactView ? 'Compact' : 'Normal'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${settings.animations ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                    <span>Animations: {settings.animations ? 'Activées' : 'Désactivées'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Confidentialité */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={20} />
                Confidentialité et sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="profilePublic">Profil public</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre aux autres utilisateurs de voir votre profil
                  </p>
                </div>
                <Switch
                  id="profilePublic"
                  checked={settings.profilePublic}
                  onCheckedChange={(checked) => handleSettingChange('profilePublic', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="shareProgress">Partager les progrès</Label>
                  <p className="text-sm text-muted-foreground">
                    Autoriser le partage de vos statistiques avec votre coach
                  </p>
                </div>
                <Switch
                  id="shareProgress"
                  checked={settings.shareProgress}
                  onCheckedChange={(checked) => handleSettingChange('shareProgress', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="analyticsOptIn">Données d'usage</Label>
                  <p className="text-sm text-muted-foreground">
                    Participer à l'amélioration de l'application
                  </p>
                </div>
                <Switch
                  id="analyticsOptIn"
                  checked={settings.analyticsOptIn}
                  onCheckedChange={(checked) => handleSettingChange('analyticsOptIn', checked)}
                />
              </div>

              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Gestion des données</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Exporter mes données
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20">
                    Supprimer mon compte
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Général */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe size={20} />
                Paramètres généraux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <select
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                  <option value="Europe/London">Europe/London (GMT+0)</option>
                  <option value="America/New_York">America/New_York (GMT-5)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (GMT-8)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="units">Système d'unités</Label>
                <select
                  id="units"
                  value={settings.units}
                  onChange={(e) => handleSettingChange('units', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="metric">Métrique (kg, cm)</option>
                  <option value="imperial">Impérial (lbs, ft)</option>
                </select>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Support</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Centre d'aide
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Contacter le support
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Signaler un problème
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
