export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'

import type { UserProfile } from '@/schemas'

const activityFactor: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

export function calculateTDEE(user: UserProfile): number {
  const base = 10 * user.weight + 6.25 * user.height - 5 * user.age
  const bmr = user.gender === 'male' ? base + 5 : base - 161
  return Math.round(bmr * activityFactor[user.activityLevel])
}

export function generateNutritionTargets(
  tdee: number,
  goalType: 'weight-loss' | 'maintenance' | 'muscle-gain'
) {
  let calories = tdee
  if (goalType === 'weight-loss') {
    calories = Math.max(1200, tdee - 500)
  } else if (goalType === 'muscle-gain') {
    calories = tdee + 500
  }

  const ratios = {
    'weight-loss': { p: 0.3, c: 0.4, f: 0.3 },
    maintenance: { p: 0.25, c: 0.5, f: 0.25 },
    'muscle-gain': { p: 0.3, c: 0.5, f: 0.2 },
  } as const

  const r = ratios[goalType]
  const protein = Math.round((calories * r.p) / 4)
  const fat = Math.round((calories * r.f) / 9)
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4))

  return { calories, protein, carbs, fat }
}
