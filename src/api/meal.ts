import supabase from '@/lib/supabase'
import type { PlannedMealFood } from '@/types/supabase'

export async function addFoodToMeal(
  plannedMealId: string,
  foodId: number,
  quantity: number,
  targetDate?: string
): Promise<PlannedMealFood> {
  const { data, error } = await supabase
    .from('planned_meal_foods')
    .insert({
      planned_meal_id: plannedMealId,
      food_id: foodId,
      grams: quantity,
      target_date: targetDate
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to add food to meal: ${error.message}`)
  }

  return data as PlannedMealFood
}
