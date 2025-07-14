import supabase from '@/lib/supabase'
import { calculateTDEE, generateNutritionTargets } from '@/utils/nutritionUtils'
import type { Database } from '@/types/supabase'
import type { UserProfile } from '@/schemas'

export async function ensureActivePlan(userId: string): Promise<string> {
  // Vérifie s'il existe déjà un plan actif
  const { data: plan, error } = await supabase
    .from('nutrition_plans')
    .select('id')
    .eq('user_id', userId)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch active plan: ${error.message}`)
  }

  if (plan) {
    return plan.id
  }

  // Vérifie s'il existe d'autres plans de l'utilisateur
  const { data: existingPlans, error: plansError } = await supabase
    .from('nutrition_plans')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (plansError) {
    throw new Error(`Failed to fetch plans: ${plansError.message}`)
  }

  if (existingPlans && existingPlans.length > 0) {
    const firstPlan = existingPlans[0]
    await supabase
      .from('nutrition_plans')
      .update({ is_active: true })
      .eq('id', firstPlan.id)
    return firstPlan.id
  }

  // Récupérer le profil utilisateur pour calculer un plan personnalisé
  type ProfileRow = Database['public']['Tables']['profiles']['Row']
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('age, gender, weight, height, activity_level, weight_target')
    .eq('id', userId)
    .maybeSingle()

  if (profileError || !profile) {
    throw new Error(`Failed to fetch user profile: ${profileError?.message}`)
  }

  // Création d'un profil minimal pour le calcul
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
  }

  // Calcul du TDEE à partir des données du profil
  const tdee = calculateTDEE(userProfile)

  let planType: 'maintenance' | 'weight-loss' | 'bulk' = 'maintenance'
  if (profile.weight_target && profile.weight) {
    if (profile.weight_target < profile.weight) planType = 'weight-loss'
    if (profile.weight_target > profile.weight) planType = 'bulk'
  }

  const targets = generateNutritionTargets(
    tdee,
    planType === 'bulk' ? 'muscle-gain' : planType
  )
  const { calories: targetCalories, protein: targetProtein, carbs: targetCarbs, fat: targetFat } = targets

  // Create a default plan if none exists
  const { data, error: insertError } = await supabase
    .from('nutrition_plans')
    .insert({
      user_id: userId,
      name: 'Plan par défaut',
      description: 'Plan créé automatiquement',
      type: planType,
      target_calories: targetCalories,
      target_protein: targetProtein,
      target_carbs: targetCarbs,
      target_fat: targetFat,
      duration: 4,
      is_active: true
    })
    .select('id')
    .single()

  if (insertError || !data) {
    throw new Error(`Failed to create active plan: ${insertError?.message}`)
  }

  return data.id
}
