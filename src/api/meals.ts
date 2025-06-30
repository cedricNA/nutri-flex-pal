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
  userId: string
  foodId: number
  grams: number
  targetDate: string
}): Promise<void> {
  const { plannedMealId, userId, foodId, grams, targetDate } = params
  try {
    const { error } = await supabase.from('planned_meal_foods').insert({
      planned_meal_id: plannedMealId,
      user_id: userId,
      food_id: foodId,
      grams,
      target_date: targetDate
    })

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
