import supabase from '@/lib/supabase'
import { calculateTDEE, type ActivityLevel } from '@/utils/calorieUtils'
import type { Database } from '@/types/supabase'

export async function ensureActivePlan(userId: string): Promise<string> {
  // Try to get existing active plan
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

  // Calcul du TDEE à partir des données du profil
  const tdee = calculateTDEE({
    gender: (profile.gender || 'male') as 'male' | 'female',
    weight: profile.weight || 70,
    height: profile.height || 170,
    age: profile.age || 30,
    activityLevel: (profile.activity_level || 'moderate') as ActivityLevel
  })

  let planType: 'maintenance' | 'weight-loss' | 'bulk' = 'maintenance'
  if (profile.weight_target && profile.weight) {
    if (profile.weight_target < profile.weight) planType = 'weight-loss'
    if (profile.weight_target > profile.weight) planType = 'bulk'
  }

  let targetCalories = tdee
  if (planType === 'weight-loss') {
    targetCalories = Math.max(1200, tdee - 500)
  } else if (planType === 'bulk') {
    targetCalories = tdee + 500
  }

  const weight = profile.weight || 70
  const targetProtein = Math.round(weight * 1.8)
  const targetFat = Math.round(weight)
  const remaining = targetCalories - targetProtein * 4 - targetFat * 9
  const targetCarbs = Math.max(0, Math.round(remaining / 4))

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
