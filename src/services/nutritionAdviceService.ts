import supabase from '@/lib/supabase';
import { ActivityLevel } from '@/utils/calorieUtils';

interface UserProfile {
  id: string;
  gender: 'male' | 'female';
  age: number;
  weight: number;
  height: number;
  activity_level: ActivityLevel;
}

interface UserGoal {
  target_value: number | null;
  description: string | null;
}

const activityFactor: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

function calculateTDEE({ gender, weight, height, age, activity_level }: UserProfile): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  const bmr = gender === 'male' ? base + 5 : base - 161;
  return Math.round(bmr * activityFactor[activity_level]);
}

export async function generateNutritionAdvice(userId: string): Promise<string> {
  // Étape 1 : récupérer le profil utilisateur et son objectif principal
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, gender, age, weight, height, activity_level')
    .eq('id', userId)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error('Impossible de récupérer le profil utilisateur');
  }

  const { data: goal } = await supabase
    .from('user_goals')
    .select('target_value, description')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const tdee = calculateTDEE(profile as UserProfile);

  // Étape 3 : construire le prompt
  const prompt = `Voici le profil de l'utilisateur :\n- Sexe : ${profile.gender}\n- Âge : ${profile.age} ans\n- Poids : ${profile.weight} kg\n- Taille : ${profile.height} cm\n- Niveau d'activité : ${profile.activity_level}\n- Objectif : ${goal?.target_value ? `${goal.target_value} kg` : 'non précisé'}\n- Description de l'objectif : ${goal?.description || 'non précisée'}\n\nSon TDEE estimé est de ${tdee} kcal par jour. Donne-lui des conseils nutritionnels personnalisés et motivants pour atteindre son objectif.`;

  // Étape 4 : appel à OpenRouter
  const apiKey = localStorage.getItem('openrouter-api-key');
  if (!apiKey) throw new Error('Clé API OpenRouter manquante');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'NutriFlex',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o',
      messages: [
        { role: 'system', content: 'Tu es un expert nutritionniste et coach motivationnel.' },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Erreur API OpenRouter: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content as string;
}

