-- Create nutrition plans table
CREATE TABLE public.nutrition_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  target_calories INTEGER,
  target_protein NUMERIC,
  target_carbs NUMERIC,
  target_fat NUMERIC,
  duration INTEGER,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create planned meals table
CREATE TABLE public.planned_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES public.nutrition_plans(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  meal_time TIMESTAMP WITH TIME ZONE,
  meal_order INTEGER,
  target_calories INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create planned meal foods table
CREATE TABLE public.planned_meal_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  planned_meal_id UUID REFERENCES public.planned_meals(id) ON DELETE CASCADE NOT NULL,
  food_id UUID REFERENCES public.foods(id) ON DELETE CASCADE NOT NULL,
  quantity NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planned_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planned_meal_foods ENABLE ROW LEVEL SECURITY;

-- RLS policies for nutrition_plans
CREATE POLICY "Users can view their own nutrition plans" ON public.nutrition_plans
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own nutrition plans" ON public.nutrition_plans
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for planned_meals
CREATE POLICY "Users can view their own planned meals" ON public.planned_meals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.nutrition_plans np
      WHERE np.id = plan_id AND np.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can manage their own planned meals" ON public.planned_meals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.nutrition_plans np
      WHERE np.id = plan_id AND np.user_id = auth.uid()
    )
  );

-- RLS policies for planned_meal_foods
CREATE POLICY "Users can view their own planned meal foods" ON public.planned_meal_foods
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.planned_meals pm
      JOIN public.nutrition_plans np ON np.id = pm.plan_id
      WHERE pm.id = planned_meal_id AND np.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can manage their own planned meal foods" ON public.planned_meal_foods
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.planned_meals pm
      JOIN public.nutrition_plans np ON np.id = pm.plan_id
      WHERE pm.id = planned_meal_id AND np.user_id = auth.uid()
    )
  );
