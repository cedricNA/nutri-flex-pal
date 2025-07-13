-- Create consumed_meal_foods table
CREATE TABLE public.consumed_meal_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  food_id UUID REFERENCES public.foods(id) ON DELETE CASCADE NOT NULL,
  grams NUMERIC NOT NULL,
  consumed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.consumed_meal_foods ENABLE ROW LEVEL SECURITY;

-- Policies for consumed_meal_foods
CREATE POLICY "Users can view their own consumed meal foods" ON public.consumed_meal_foods
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own consumed meal foods" ON public.consumed_meal_foods
  FOR ALL USING (auth.uid() = user_id);

-- View summarizing daily nutrition intake
CREATE OR REPLACE VIEW public.daily_nutrition_summary AS
SELECT
  cmf.user_id,
  date_trunc('day', cmf.consumed_at)::date AS summary_date,
  SUM((f.calories * cmf.grams) / 100) AS calories,
  SUM((f.protein * cmf.grams) / 100) AS protein,
  SUM((f.carbs * cmf.grams) / 100) AS carbs,
  SUM((f.fat * cmf.grams) / 100) AS fat,
  SUM((f.fiber * cmf.grams) / 100) AS fiber
FROM public.consumed_meal_foods cmf
JOIN public.foods f ON f.id = cmf.food_id
GROUP BY cmf.user_id, summary_date;
