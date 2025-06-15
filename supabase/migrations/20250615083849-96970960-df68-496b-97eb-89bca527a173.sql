
-- Ajouter les nouvelles colonnes nutritionnelles à la table foods
ALTER TABLE public.foods 
ADD COLUMN calcium NUMERIC DEFAULT 0,
ADD COLUMN iron NUMERIC DEFAULT 0,
ADD COLUMN magnesium NUMERIC DEFAULT 0,
ADD COLUMN potassium NUMERIC DEFAULT 0,
ADD COLUMN sodium NUMERIC DEFAULT 0,
ADD COLUMN vitamin_c NUMERIC DEFAULT 0,
ADD COLUMN vitamin_d NUMERIC DEFAULT 0,
ADD COLUMN salt NUMERIC DEFAULT 0;

-- Ajouter des commentaires pour clarifier les unités
COMMENT ON COLUMN public.foods.calcium IS 'Calcium en mg/100g';
COMMENT ON COLUMN public.foods.iron IS 'Fer en mg/100g';
COMMENT ON COLUMN public.foods.magnesium IS 'Magnésium en mg/100g';
COMMENT ON COLUMN public.foods.potassium IS 'Potassium en mg/100g';
COMMENT ON COLUMN public.foods.sodium IS 'Sodium en mg/100g';
COMMENT ON COLUMN public.foods.vitamin_c IS 'Vitamine C en mg/100g';
COMMENT ON COLUMN public.foods.vitamin_d IS 'Vitamine D en μg/100g';
COMMENT ON COLUMN public.foods.salt IS 'Sel chlorure de sodium en g/100g';
