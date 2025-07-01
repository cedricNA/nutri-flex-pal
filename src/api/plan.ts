import supabase from '@/lib/supabase'

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

  // Create a default plan if none exists
  const { data, error: insertError } = await supabase
    .from('nutrition_plans')
    .insert({
      user_id: userId,
      name: 'Plan par défaut',
      description: 'Plan créé automatiquement',
      type: 'maintenance',
      target_calories: 2000,
      target_protein: 100,
      target_carbs: 250,
      target_fat: 70,
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
