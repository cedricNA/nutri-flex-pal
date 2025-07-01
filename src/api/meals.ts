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
