import supabase from '@/lib/supabase'
import { mealRatios } from '@/utils/mealRatios'

export interface PlannedMealFood {
  id: string
  planned_meal_id: string
  user_id: string
  food_id: string
  grams: number
  target_date: string
  created_at: string
}

export async function addFoodToMeal(params: {
  plannedMealId: string
  foodId: string
  grams: number
  targetDate?: string
}): Promise<void> {
  const { plannedMealId, foodId, grams, targetDate } = params
  try {
    console.log('Planned meal ID:', plannedMealId)
    if (!plannedMealId) {
      throw new Error('Invalid planned meal ID')
    }
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
  kcal: number | undefined,
  planId: string,
  mealType?: string
): Promise<string> {
  let target = kcal ?? 0
  if (kcal === undefined && mealType) {
    const { data: plan } = await supabase
      .from('nutrition_plans')
      .select('target_calories')
      .eq('id', planId)
      .single()

    if (plan && mealRatios[mealType as keyof typeof mealRatios]) {
      target = Math.round(plan.target_calories * mealRatios[mealType as keyof typeof mealRatios])
    }
  }

  const { data, error } = await supabase
    .from('planned_meals')
    .insert({
      name,
      meal_time: time,
      target_calories: target,
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
  mealType: string
  targetCalories?: number
}): Promise<string> {
  const { planId, name, mealTime, mealType, targetCalories } = params

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

  // Compute target calories if not provided
  let target = targetCalories
  if (target === undefined && mealType) {
    const { data: plan } = await supabase
      .from('nutrition_plans')
      .select('target_calories')
      .eq('id', planId)
      .single()

    if (plan && mealRatios[mealType as keyof typeof mealRatios]) {
      target = Math.round(plan.target_calories * mealRatios[mealType as keyof typeof mealRatios])
    } else {
      target = 0
    }
  } else if (target === undefined) {
    target = 0
  }

  // Create the meal if not found
  const { data, error: insertError } = await supabase
    .from('planned_meals')
    .insert({
      name,
      meal_time: mealTime,
      target_calories: target,
      plan_id: planId
    })
    .select('id')
    .single()

  if (insertError || !data) {
    throw new Error(`Failed to create planned meal: ${insertError?.message}`)
  }

  return data.id
}
