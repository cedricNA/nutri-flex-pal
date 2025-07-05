import supabase from '@/lib/supabase'

export interface PlannedMealFood {
  id: string
  planned_meal_id: string
  user_id: string
  food_id: number
  grams: number
  target_date: string
  created_at: string
}

export async function addFoodToMeal(params: {
  plannedMealId: string
  foodId: number
  grams: number
  targetDate?: string
}): Promise<void> {
  const { plannedMealId, foodId, grams, targetDate } = params
  try {
    const insertData: Record<string, unknown> = {
      planned_meal_id: plannedMealId,
      food_id: foodId,
      grams
    }

    if (targetDate) {
      insertData.target_date = targetDate
    }

    const { error } = await supabase.from('planned_meal_foods').insert(insertData)

    if (error) {
      throw new Error(`Failed to add food to meal: ${error.message}`)
    }
  } catch (err) {
    if (err instanceof Error) {
      throw err
    }
    throw new Error('Unknown error adding food to meal')
  }
}

export async function createMeal(
  name: string,
  time: string,
  kcal: number,
  planId: string
): Promise<string> {
  const { data, error } = await supabase
    .from('planned_meals')
    .insert({
      name,
      meal_time: time,
      target_calories: kcal,
      plan_id: planId
    })
    .select('id')
    .single()

  if (error || !data) {
    throw new Error(`Failed to create meal: ${error?.message}`)
  }

  return data.id
}

export async function getOrCreatePlannedMeal(params: {
  planId: string
  name: string
  mealTime: string
  targetCalories?: number
}): Promise<string> {
  const { planId, name, mealTime, targetCalories = 0 } = params

  // Try to find existing meal for this plan, name and time
  const { data: existing, error } = await supabase
    .from('planned_meals')
    .select('id')
    .eq('plan_id', planId)
    .eq('name', name)
    .eq('meal_time', mealTime)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch planned meal: ${error.message}`)
  }

  if (existing) {
    return existing.id
  }

  // Create the meal if not found
  const { data, error: insertError } = await supabase
    .from('planned_meals')
    .insert({
      name,
      meal_time: mealTime,
      target_calories: targetCalories,
      plan_id: planId
    })
    .select('id')
    .single()

  if (insertError || !data) {
    throw new Error(`Failed to create planned meal: ${insertError?.message}`)
  }

  return data.id
}
