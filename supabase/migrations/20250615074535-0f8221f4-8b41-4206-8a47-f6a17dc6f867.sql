
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER CHECK (age > 0),
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  weight_target DECIMAL(5,2),
  daily_calories INTEGER,
  protein_goal DECIMAL(6,2),
  carbs_goal DECIMAL(6,2),
  fat_goal DECIMAL(6,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weight entries table
CREATE TABLE public.weight_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calorie entries table
CREATE TABLE public.calorie_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  consumed INTEGER NOT NULL,
  target INTEGER NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create foods table
CREATE TABLE public.foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  calories DECIMAL(6,2) NOT NULL,
  protein DECIMAL(6,2) NOT NULL DEFAULT 0,
  carbs DECIMAL(6,2) NOT NULL DEFAULT 0,
  fat DECIMAL(6,2) NOT NULL DEFAULT 0,
  fiber DECIMAL(6,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'g',
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user food favorites table
CREATE TABLE public.user_food_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  food_id UUID REFERENCES public.foods(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, food_id)
);

-- Create meal entries table
CREATE TABLE public.meal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  food_id UUID REFERENCES public.foods(id) ON DELETE CASCADE NOT NULL,
  grams DECIMAL(6,2) NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) NOT NULL,
  eaten_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('meal', 'hydration', 'achievement', 'reminder', 'info')) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user settings table
CREATE TABLE public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  meal_reminders BOOLEAN DEFAULT TRUE,
  hydration_reminders BOOLEAN DEFAULT TRUE,
  weekly_reports BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT TRUE,
  dark_mode BOOLEAN DEFAULT FALSE,
  compact_view BOOLEAN DEFAULT FALSE,
  animations BOOLEAN DEFAULT TRUE,
  profile_public BOOLEAN DEFAULT FALSE,
  share_progress BOOLEAN DEFAULT TRUE,
  analytics_opt_in BOOLEAN DEFAULT TRUE,
  language TEXT DEFAULT 'fr',
  timezone TEXT DEFAULT 'Europe/Paris',
  units TEXT DEFAULT 'metric',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hydration tracking table
CREATE TABLE public.hydration_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  glasses_count INTEGER DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calorie_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_food_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hydration_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for weight_entries
CREATE POLICY "Users can view their own weight entries" ON public.weight_entries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own weight entries" ON public.weight_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own weight entries" ON public.weight_entries
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own weight entries" ON public.weight_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for calorie_entries
CREATE POLICY "Users can view their own calorie entries" ON public.calorie_entries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own calorie entries" ON public.calorie_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own calorie entries" ON public.calorie_entries
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own calorie entries" ON public.calorie_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for foods (public read, authenticated users can add)
CREATE POLICY "Anyone can view foods" ON public.foods
  FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Authenticated users can insert foods" ON public.foods
  FOR INSERT TO authenticated WITH CHECK (true);

-- Create RLS policies for user_food_favorites
CREATE POLICY "Users can view their own favorites" ON public.user_food_favorites
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own favorites" ON public.user_food_favorites
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for meal_entries
CREATE POLICY "Users can view their own meal entries" ON public.meal_entries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own meal entries" ON public.meal_entries
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for user_settings
CREATE POLICY "Users can view their own settings" ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own settings" ON public.user_settings
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for hydration_entries
CREATE POLICY "Users can view their own hydration entries" ON public.hydration_entries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own hydration entries" ON public.hydration_entries
  FOR ALL USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    new.email
  );
  
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample foods data
INSERT INTO public.foods (name, category, calories, protein, carbs, fat, fiber, unit, image) VALUES
('Pomme', 'fruits', 52, 0.3, 14, 0.2, 2.4, 'g', '/placeholder.svg'),
('Banane', 'fruits', 89, 1.1, 23, 0.3, 2.6, 'g', '/placeholder.svg'),
('Poulet (blanc)', 'proteins', 165, 31, 0, 3.6, 0, 'g', '/placeholder.svg'),
('Saumon', 'proteins', 208, 22, 0, 13, 0, 'g', '/placeholder.svg'),
('Riz brun', 'grains', 123, 2.6, 23, 0.9, 1.8, 'g', '/placeholder.svg'),
('Quinoa', 'grains', 120, 4.4, 22, 1.9, 2.8, 'g', '/placeholder.svg'),
('Brocoli', 'vegetables', 34, 2.8, 7, 0.4, 2.6, 'g', '/placeholder.svg'),
('Épinards', 'vegetables', 23, 2.9, 3.6, 0.4, 2.2, 'g', '/placeholder.svg'),
('Avocat', 'fats', 160, 2, 9, 15, 7, 'g', '/placeholder.svg'),
('Amandes', 'fats', 576, 21, 22, 49, 12, 'g', '/placeholder.svg'),
('Yaourt grec', 'dairy', 59, 10, 3.6, 0.4, 0, 'g', '/placeholder.svg'),
('Lait écrémé', 'dairy', 34, 3.4, 5, 0.1, 0, 'ml', '/placeholder.svg');
