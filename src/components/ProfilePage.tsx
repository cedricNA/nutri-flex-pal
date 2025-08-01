import React, { useRef, useState, useEffect, useCallback } from 'react';
import { User, Camera, Info, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InlineEditableInput from './InlineEditableInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { dynamicDataService, type UserGoal } from '@/services/dynamicDataService';
import ObjectiveSummary from './ObjectiveSummary';
import { useToast } from '@/hooks/use-toast';
import ProfileSkeleton from './skeletons/ProfileSkeleton';
import { useProfileValidation } from '@/hooks/useProfileValidation';

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

interface ProfilePageProps {
  onManageGoals?: () => void;
}

const ProfilePage = ({ onManageGoals }: ProfilePageProps) => {
  const { profile: storedProfile, loading, updateProfile } = useProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  const { errors, validateField } = useProfileValidation();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeGoals, setActiveGoals] = useState<UserGoal[]>([]);
  const [completedGoals, setCompletedGoals] = useState<UserGoal[]>([]);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    activityLevel: 'sédentaire',
    goal: 'maintien',
    bio: '',
  });
  const initialProfileRef = useRef<typeof profile | null>(null);

  const loadGoals = useCallback(async () => {
    if (!user) return;

    try {
      const active = await dynamicDataService.getUserGoals(user.id);
      const completed = await dynamicDataService.getCompletedUserGoals(user.id);
      setActiveGoals(active);
      setCompletedGoals(completed);
    } catch (err) {
      console.error('Error loading goals:', err);
    }
  }, [user]);

  useEffect(() => {
    if (storedProfile) {
      const [first = '', ...rest] = (storedProfile.name || '').split(' ');
      const mapped = {
        firstName: first,
        lastName: rest.join(' '),
        email: storedProfile.email || '',
        phone: '',
        age: storedProfile.age?.toString() || '',
        weight: storedProfile.weight?.toString() || '',
        height: storedProfile.height?.toString() || '',
        gender: storedProfile.gender || 'male',
        activityLevel: activityMap[storedProfile.activity_level || 'sedentary'],
        goal: 'maintien',
        bio: '',
      };
      setProfile(mapped);
      if (!initialProfileRef.current) {
        initialProfileRef.current = mapped;
      }
    }
  }, [storedProfile]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);


  const handleInputChange = async (field: string, value: string) => {
    validateField(field as any, value);
    setProfile(prev => ({ ...prev, [field]: value }));

    const updates: Record<string, any> = {};
    if (field === 'firstName' || field === 'lastName') {
      const first = field === 'firstName' ? value : profile.firstName;
      const last = field === 'lastName' ? value : profile.lastName;
      updates.name = `${first} ${last}`.trim();
    } else if (field === 'email') {
      updates.email = value;
    } else if (field === 'age') {
      updates.age = Number(value) || null;
    } else if (field === 'weight') {
      updates.weight = Number(value) || null;
    } else if (field === 'height') {
      updates.height = Number(value) || null;
    } else if (field === 'gender') {
      updates.gender = value;
    } else if (field === 'activityLevel') {
      updates.activity_level = reverseActivityMap[value] || 'sedentary';
    }

    if (Object.keys(updates).length) {
      await updateProfile(updates);
      toast({ title: 'Profil mis à jour' });
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const processImage = (file: File) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 256;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const minSide = Math.min(img.width, img.height);
      const sx = (img.width - minSide) / 2;
      const sy = (img.height - minSide) / 2;
      ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        setAvatarUrl(url);
      }, 'image/jpeg', 0.8);
    };
    img.src = URL.createObjectURL(file);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processImage(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const calculateBMR = () => {
    const weight = Number(profile.weight);
    const height = Number(profile.height);
    const age = Number(profile.age);
    if (!weight || !height || !age) return 0;
    const base = 10 * weight + 6.25 * height - 5 * age;
    return base + (profile.gender === 'male' ? 5 : -161);
  };

  const handleResetProfile = async () => {
    if (!initialProfileRef.current) return;
    const p = initialProfileRef.current;
    setProfile(p);
    await updateProfile({
      name: `${p.firstName} ${p.lastName}`.trim(),
      email: p.email,
      gender: p.gender,
      age: Number(p.age) || null,
      weight: Number(p.weight) || null,
      height: Number(p.height) || null,
      activity_level: reverseActivityMap[p.activityLevel] || 'sedentary',
    });
    toast({ title: 'Modifications annulées' });
  };

  const hasChanges = initialProfileRef.current
    ? Object.keys(initialProfileRef.current).some(
        key => (profile as any)[key] !== (initialProfileRef.current as any)[key]
      )
    : false;


  if (loading && !storedProfile) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Header avec photo de profil */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div
              className="relative group"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
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
                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm"
              >
                <Camera className="mr-1" size={20} />
                <span>Changer</span>
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

          </div>
        </CardContent>
      </Card>

      {/* Informations personnelles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="group hover:shadow-lg transition-all duration-200">
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
                <InlineEditableInput
                  id="firstName"
                  value={profile.firstName}
                  onSave={(val) => handleInputChange('firstName', val)}
                  className="w-full"
                  error={errors.firstName}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <InlineEditableInput
                  id="lastName"
                  value={profile.lastName}
                  onSave={(val) => handleInputChange('lastName', val)}
                  className="w-full"
                  error={errors.lastName}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <InlineEditableInput
                id="email"
                type="email"
                value={profile.email}
                onSave={(val) => handleInputChange('email', val)}
                className="w-full"
                error={errors.email}
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <InlineEditableInput
                id="phone"
                value={profile.phone}
                onSave={(val) => handleInputChange('phone', val)}
                className="w-full"
                error={errors.phone}
              />
            </div>

            <div>
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Informations physiques */}
        <Card className="group hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle>Informations physiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="age">Âge</Label>
              <InlineEditableInput
                id="age"
                type="number"
                value={profile.age}
                onSave={(val) => handleInputChange('age', val)}
                className="w-full"
                error={errors.age}
              />
              </div>
              <div>
                <Label htmlFor="weight">Poids (kg)</Label>
              <InlineEditableInput
                id="weight"
                type="number"
                value={profile.weight}
                onSave={(val) => handleInputChange('weight', val)}
                className="w-full"
                error={errors.weight}
              />
              </div>
              <div>
                <Label htmlFor="height">Taille (cm)</Label>
              <InlineEditableInput
                id="height"
                type="number"
                value={profile.height}
                onSave={(val) => handleInputChange('height', val)}
                className="w-full"
                error={errors.height}
              />
              </div>
            </div>

            <div>
              <Label htmlFor="gender">Sexe</Label>
              <select
                id="gender"
                value={profile.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="male">Homme</option>
                <option value="female">Femme</option>
              </select>
            </div>

            <div>
              <Label htmlFor="activityLevel">Niveau d'activité</Label>
              <select
                id="activityLevel"
                value={profile.activityLevel}
                onChange={(e) => handleInputChange('activityLevel', e.target.value)}
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
              <Label htmlFor="goal" className="flex items-center gap-1">
                Objectif nutritionnel
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={14} className="cursor-help text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Ceci est votre objectif nutritionnel de base, utilisé pour le calcul des besoins caloriques.
                  </TooltipContent>
                </Tooltip>
              </Label>
              <select
                id="goal"
                value={profile.goal}
                onChange={(e) => handleInputChange('goal', e.target.value)}
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

      {/* Objectifs actifs */}
      {activeGoals.length > 0 ? (
        <Card className="group hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target size={20} />
              Objectifs actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeGoals.map(goal => (
                <ObjectiveSummary key={goal.id} goal={goal} />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="group hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target size={20} />
              Objectifs actifs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-center">
            <p className="transition-colors group-hover:text-primary">Aucun objectif actif.</p>
            <p className="text-sm text-muted-foreground transition-colors group-hover:text-primary">Fixez-en un dans la section Progression.</p>
          </CardContent>
        </Card>
      )}

      {/* Objectifs récemment atteints */}
      <Card>
        <CardHeader>
          <CardTitle>Récemment atteints</CardTitle>
        </CardHeader>
        <CardContent>
          {completedGoals.length === 0 ? (
            <p>Aucun objectif récemment atteint.</p>
          ) : (
            <ul className="list-disc list-inside space-y-1">
              {completedGoals.map(goal => (
                <li key={goal.id}>{goal.title}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="text-right">
        <Button variant="link" onClick={onManageGoals} className="p-0 h-auto">
          Gérer mes objectifs
        </Button>
      </div>

      {hasChanges && (
        <div className="text-right">
          <Button onClick={handleResetProfile} variant="outline" className="mt-2">
            Annuler les modifications
          </Button>
        </div>
      )}



    </div>
  );
};

export default ProfilePage;
