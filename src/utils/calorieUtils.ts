export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface CalorieCalcInput {
  weight: number;
  height: number;
  age: number;
  activityLevel: ActivityLevel;
}

const activityFactor: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateMaintenanceCalories({ weight, height, age, activityLevel }: CalorieCalcInput): number {
  const bmr = 10 * weight + 6.25 * height - 5 * age;
  return Math.round(bmr * activityFactor[activityLevel]);
}

export function calculateAdjustedCalories(input: CalorieCalcInput & { weightTarget: number }): number {
  const maintenance = calculateMaintenanceCalories(input);
  if (input.weightTarget < input.weight) {
    return Math.max(1200, maintenance - 500);
  }
  return maintenance;
}
