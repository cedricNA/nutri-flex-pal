import supabase from '@/lib/supabase';
import { calculateTDEE } from '@/utils/nutritionUtils';
import type { UserProfile } from '@/schemas';

export async function generatePlanSuggestion(userId: string): Promise<string> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('gender, age, weight, height, activity_level, weight_target')
    .eq('id', userId)
    .maybeSingle();

  if (error || !profile) {
    throw new Error("Impossible de récupérer le profil utilisateur");
  }

  const userProfile: UserProfile = {
    id: userId,
    name: '',
    email: '',
    gender: (profile.gender || 'male') as 'male' | 'female',
    age: profile.age || 30,
    weight: profile.weight || 70,
    height: profile.height || 170,
    activityLevel: (profile.activity_level || 'moderate') as any,
    goals: {
      weightTarget: profile.weight_target || (profile.weight || 70),
      dailyCalories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  };

  const tdee = calculateTDEE(userProfile);
  const goalDiff =
    profile.weight && profile.weight_target
      ? profile.weight_target - profile.weight
      : 0;

  let goalDesc = 'maintien du poids';
  if (goalDiff < 0) {
    goalDesc = `perte de ${Math.abs(goalDiff)} kg`;
  } else if (goalDiff > 0) {
    goalDesc = `prise de ${goalDiff} kg`;
  }

  const prompt = `Selon ce profil:\n- sexe: ${userProfile.gender}\n- age: ${userProfile.age}\n- poids: ${userProfile.weight} kg\n- taille: ${userProfile.height} cm\n- niveau d'activité: ${userProfile.activityLevel}\n- objectif: ${goalDesc}\n\nSon TDEE est estimé à ${tdee} kcal. Propose une recommandation courte en français indiquant un apport calorique quotidien adapté sous la forme: "D'après ton profil et ton objectif (${goalDesc}), un objectif à XYZ kcal semble approprié."`;

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
      model: 'deepseek/deepseek-r1-0528:free',
      messages: [
        { role: 'system', content: 'Tu es un expert nutritionniste.' },
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
