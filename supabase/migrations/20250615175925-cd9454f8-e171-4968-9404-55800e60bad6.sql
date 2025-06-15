
-- Table pour les mappings de catégories CIQUAL vers catégories simplifiées
CREATE TABLE public.category_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ciqual_category TEXT NOT NULL UNIQUE,
  simplified_category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour la détection des colonnes CSV
CREATE TABLE public.csv_column_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_type TEXT NOT NULL, -- 'name', 'calories', 'protein', etc.
  possible_names TEXT[] NOT NULL, -- array of possible column names
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les types de repas
CREATE TABLE public.meal_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_key TEXT NOT NULL UNIQUE, -- 'breakfast', 'lunch', 'dinner', 'snack'
  display_name TEXT NOT NULL,
  icon_name TEXT NOT NULL, -- lucide icon name
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les objectifs personnalisés des utilisateurs
CREATE TABLE public.user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  unit TEXT NOT NULL,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('weight_loss', 'hydration', 'exercise', 'calorie_deficit', 'sleep', 'nutrition', 'custom')),
  deadline DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.category_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.csv_column_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour category_mappings (lecture publique, écriture admin)
CREATE POLICY "Anyone can view category mappings" ON public.category_mappings
  FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Authenticated users can manage category mappings" ON public.category_mappings
  FOR ALL TO authenticated USING (true);

-- RLS Policies pour csv_column_mappings (lecture publique, écriture admin)
CREATE POLICY "Anyone can view csv column mappings" ON public.csv_column_mappings
  FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Authenticated users can manage csv column mappings" ON public.csv_column_mappings
  FOR ALL TO authenticated USING (true);

-- RLS Policies pour meal_types (lecture publique, écriture admin)
CREATE POLICY "Anyone can view meal types" ON public.meal_types
  FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Authenticated users can manage meal types" ON public.meal_types
  FOR ALL TO authenticated USING (true);

-- RLS Policies pour user_goals (utilisateur peut voir/gérer ses propres objectifs)
CREATE POLICY "Users can view their own goals" ON public.user_goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own goals" ON public.user_goals
  FOR ALL USING (auth.uid() = user_id);

-- Insérer les données initiales pour category_mappings
INSERT INTO public.category_mappings (ciqual_category, simplified_category) VALUES
('legumes', 'vegetables'),
('fruits', 'fruits'),
('viandes', 'proteins'),
('poissons', 'proteins'),
('produits laitiers', 'dairy'),
('cereales', 'grains'),
('feculents', 'grains'),
('matieres grasses', 'fats'),
('sucres', 'sweets'),
('boissons', 'beverages'),
('snacks', 'snacks'),
('vegetables', 'vegetables'),
('meat', 'proteins'),
('fish', 'proteins'),
('dairy', 'dairy'),
('grains', 'grains'),
('fats', 'fats'),
('fruits et legumes', 'fruits'),
('produits de la mer', 'proteins'),
('volailles', 'proteins'),
('oeufs', 'proteins'),
('noix et graines', 'fats'),
('epices et condiments', 'seasonings');

-- Insérer les données initiales pour csv_column_mappings
INSERT INTO public.csv_column_mappings (field_type, possible_names) VALUES
('name', ARRAY['alim_nom_fr', 'nom', 'name', 'aliment', 'food_name', 'produit', 'denomination']),
('calories', ARRAY['energie_kcal_100g', 'calories', 'energy', 'kcal', 'energie']),
('protein', ARRAY['proteines_g_100g', 'protein', 'proteins', 'proteines']),
('carbs', ARRAY['glucides_g_100g', 'carbs', 'carbohydrates', 'glucides']),
('fat', ARRAY['lipides_g_100g', 'fat', 'fats', 'lipides']),
('fiber', ARRAY['fibres_g_100g', 'fiber', 'fibres']),
('category', ARRAY['alim_grp_nom_fr', 'category', 'groupe', 'categorie', 'group']),
('calcium', ARRAY['calcium_mg_100g', 'calcium']),
('iron', ARRAY['fer_mg_100g', 'iron', 'fer']),
('magnesium', ARRAY['magnesium_mg_100g', 'magnesium']),
('potassium', ARRAY['potassium_mg_100g', 'potassium']),
('sodium', ARRAY['sodium_mg_100g', 'sodium']),
('vitamin_c', ARRAY['vitamine_c_mg_100g', 'vitamin_c', 'vitamine_c']),
('vitamin_d', ARRAY['vitamine_d_µg_100g', 'vitamin_d', 'vitamine_d']),
('salt', ARRAY['sel_g_100g', 'salt', 'sel']);

-- Insérer les données initiales pour meal_types
INSERT INTO public.meal_types (type_key, display_name, icon_name, sort_order) VALUES
('breakfast', 'Petit-déjeuner', 'Coffee', 1),
('lunch', 'Déjeuner', 'UtensilsCrossed', 2),
('dinner', 'Dîner', 'ChefHat', 3),
('snack', 'Collation', 'Cookie', 4);
