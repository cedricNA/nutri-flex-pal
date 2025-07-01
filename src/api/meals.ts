import supabase from '@/lib/supabase'
import dayjs from 'dayjs'

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
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw 'Not authenticated'
    }

    const finalDate = targetDate ?? dayjs().format('YYYY-MM-DD')
    const insertData: Record<string, unknown> = {
      planned_meal_id: plannedMealId,
      food_id: foodId,
      grams,
      target_date: finalDate,
      ...(user ? { user_id: user.id } : {})
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
