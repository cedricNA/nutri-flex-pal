
import React, { useRef, useState, useEffect } from 'react';
import { User, Camera, Save, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfile } from '@/hooks/useProfile';

const ProfilePage = () => {
  const { profile: storedProfile, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    weight: '',
    height: '',
    activityLevel: 'sédentaire',
    goal: 'maintien',
    bio: '',
  });

  const activityMap: Record<string, string> = {
    sedentary: 'sédentaire',
    light: 'légère',
    moderate: 'modérée',
    active: 'intense',
    very_active: 'très intense',
  };

  const reverseActivityMap = Object.fromEntries(
    Object.entries(activityMap).map(([k, v]) => [v, k])
  ) as Record<string, string>;

  useEffect(() => {
    if (storedProfile) {
      const [first = '', ...rest] = (storedProfile.name || '').split(' ');
      setProfile({
        firstName: first,
        lastName: rest.join(' '),
        email: storedProfile.email || '',
        phone: '',
        age: storedProfile.age?.toString() || '',
        weight: storedProfile.weight?.toString() || '',
        height: storedProfile.height?.toString() || '',
        activityLevel: activityMap[storedProfile.activity_level || 'sedentary'],
        goal: 'maintien',
        bio: '',
      });
    }
  }, [storedProfile]);

  const handleSave = async () => {
    setIsEditing(false);
    await updateProfile({
      name: `${profile.firstName} ${profile.lastName}`,
      email: profile.email,
      age: Number(profile.age) || null,
      weight: Number(profile.weight) || null,
      height: Number(profile.height) || null,
      activity_level: reverseActivityMap[profile.activityLevel] || 'sedentary',
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const calculateBMR = () => {
    const weight = Number(profile.weight);
    const height = Number(profile.height);
    const age = Number(profile.age);
    if (!weight || !height || !age) return 0;
    return 10 * weight + 6.25 * height - 5 * age;
  };

  if (loading && !storedProfile) {
    return <div>Chargement du profil...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header avec photo de profil */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative group">
              <Avatar className="w-32 h-32">
                <AvatarImage
                  src={avatarUrl || "/placeholder.svg"}
                  alt="Photo de profil"
                />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  {profile.firstName[0]}{profile.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={handlePhotoClick}
                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="text-white" size={24} />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-gray-600 mb-4">{profile.email}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  Coach certifiée
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Objectif: {profile.goal}
                </span>
              </div>
            </div>
            
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
              className="gap-2"
            >
              <Edit3 size={16} />
              {isEditing ? 'Annuler' : 'Modifier'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informations personnelles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!isEditing}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Informations physiques */}
        <Card>
          <CardHeader>
            <CardTitle>Informations physiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="age">Âge</Label>
                <Input
                  id="age"
                  value={profile.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="weight">Poids (kg)</Label>
                <Input
                  id="weight"
                  value={profile.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="height">Taille (cm)</Label>
                <Input
                  id="height"
                  value={profile.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="activityLevel">Niveau d'activité</Label>
              <select
                id="activityLevel"
                value={profile.activityLevel}
                onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                disabled={!isEditing}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="sédentaire">Sédentaire</option>
                <option value="légère">Activité légère</option>
                <option value="modérée">Activité modérée</option>
                <option value="intense">Activité intense</option>
                <option value="très intense">Très intense</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="goal">Objectif</Label>
              <select
                id="goal"
                value={profile.goal}
                onChange={(e) => handleInputChange('goal', e.target.value)}
                disabled={!isEditing}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="perte">Perte de poids</option>
                <option value="maintien">Maintien</option>
                <option value="prise">Prise de masse</option>
                <option value="santé">Santé globale</option>
              </select>
            </div>

            {/* Calculs automatiques */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Calculs automatiques</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">IMC:</span>
                  <span className="ml-2 font-medium">
                    {(Number(profile.weight) / Math.pow(Number(profile.height) / 100, 2)).toFixed(1)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Métabolisme de base:</span>
                  <span className="ml-2 font-medium">
                    {calculateBMR().toFixed(0)} kcal
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bouton de sauvegarde */}
      {isEditing && (
        <div className="flex justify-center">
          <Button onClick={handleSave} className="gap-2 px-8">
            <Save size={16} />
            Sauvegarder les modifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
