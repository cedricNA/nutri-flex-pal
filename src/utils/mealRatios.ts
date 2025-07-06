export const mealRatios = {
  breakfast: 0.25,
  lunch: 0.35,
  dinner: 0.30,
  snack: 0.10
} as const;

export type MealRatioKey = keyof typeof mealRatios;
