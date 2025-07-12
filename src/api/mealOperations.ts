import supabase from '@/lib/supabase';
import { createMeal } from './meals';

export async function copyMealsFromYesterday(planId: string): Promise<void> {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Get yesterday's planned meals with their foods
    const { data: yesterdayMeals, error: fetchError } = await supabase
      .from('planned_meal_foods')
      .select(`
        planned_meal_id,
        food_id,
        grams,
        planned_meals (
          name,
          meal_time,
          target_calories,
          meal_type_id
        )
      `)
      .eq('target_date', yesterdayStr);

    if (fetchError) {
      throw new Error(`Erreur lors de la récupération des repas d'hier: ${fetchError.message}`);
    }

    if (!yesterdayMeals || yesterdayMeals.length === 0) {
      throw new Error("Aucun repas trouvé pour hier");
    }

    // Group foods by meal
    const mealGroups = new Map();
    yesterdayMeals.forEach(item => {
      const mealId = item.planned_meal_id;
      if (!mealGroups.has(mealId)) {
        mealGroups.set(mealId, {
          meal: item.planned_meals,
          foods: []
        });
      }
      mealGroups.get(mealId).foods.push({
        food_id: item.food_id,
        grams: item.grams
      });
    });

    // Create today's meals and add foods
    const today = new Date().toISOString().split('T')[0];
    
    for (const [_, { meal, foods }] of mealGroups) {
      if (!meal) continue;

      // Create or get today's meal
      const newMealId = await createMeal(
        meal.name,
        meal.meal_time,
        meal.target_calories,
        planId
      );

      // Add all foods to the new meal
      const foodInserts = foods.map(food => ({
        planned_meal_id: newMealId,
        food_id: food.food_id,
        grams: food.grams,
        target_date: today
      }));

      const { error: insertError } = await supabase
        .from('planned_meal_foods')
        .insert(foodInserts);

      if (insertError) {
        throw new Error(`Erreur lors de l'ajout des aliments: ${insertError.message}`);
      }
    }
  } catch (error) {
    console.error('Error copying meals from yesterday:', error);
    throw error;
  }
}

export async function deletePlannedMeal(mealId: string): Promise<void> {
  try {
    // First delete all foods associated with the meal
    const { error: foodsError } = await supabase
      .from('planned_meal_foods')
      .delete()
      .eq('planned_meal_id', mealId);

    if (foodsError) {
      throw new Error(`Erreur lors de la suppression des aliments: ${foodsError.message}`);
    }

    // Then delete the meal itself
    const { error: mealError } = await supabase
      .from('planned_meals')
      .delete()
      .eq('id', mealId);

    if (mealError) {
      throw new Error(`Erreur lors de la suppression du repas: ${mealError.message}`);
    }
  } catch (error) {
    console.error('Error deleting planned meal:', error);
    throw error;
  }
}

export async function duplicatePlannedMeal(mealId: string, planId: string): Promise<string> {
  try {
    // Get the original meal
    const { data: originalMeal, error: mealError } = await supabase
      .from('planned_meals')
      .select('*')
      .eq('id', mealId)
      .single();

    if (mealError || !originalMeal) {
      throw new Error(`Erreur lors de la récupération du repas: ${mealError?.message}`);
    }

    // Create duplicate meal with modified name
    const duplicateName = `${originalMeal.name} (copie)`;
    const newMealId = await createMeal(
      duplicateName,
      originalMeal.meal_time,
      originalMeal.target_calories,
      planId
    );

    // Get all foods from the original meal
    const { data: originalFoods, error: foodsError } = await supabase
      .from('planned_meal_foods')
      .select('food_id, grams, target_date')
      .eq('planned_meal_id', mealId);

    if (foodsError) {
      throw new Error(`Erreur lors de la récupération des aliments: ${foodsError.message}`);
    }

    if (originalFoods && originalFoods.length > 0) {
      // Add foods to the duplicate meal
      const foodInserts = originalFoods.map(food => ({
        planned_meal_id: newMealId,
        food_id: food.food_id,
        grams: food.grams,
        target_date: food.target_date
      }));

      const { error: insertError } = await supabase
        .from('planned_meal_foods')
        .insert(foodInserts);

      if (insertError) {
        throw new Error(`Erreur lors de l'ajout des aliments dupliqués: ${insertError.message}`);
      }
    }

    return newMealId;
  } catch (error) {
    console.error('Error duplicating planned meal:', error);
    throw error;
  }
}

export async function updatePlannedMeal(
  mealId: string, 
  updates: {
    name?: string;
    meal_time?: string;
    target_calories?: number;
  }
): Promise<void> {
  try {
    const { error } = await supabase
      .from('planned_meals')
      .update(updates)
      .eq('id', mealId);

    if (error) {
      throw new Error(`Erreur lors de la mise à jour du repas: ${error.message}`);
    }
  } catch (error) {
    console.error('Error updating planned meal:', error);
    throw error;
  }
}