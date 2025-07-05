-- Create foods_clean view
CREATE OR REPLACE VIEW public.foods_clean AS
SELECT
  id,
  name AS name_fr,
  category AS group_fr,
  calories AS kcal,
  protein AS protein_g,
  carbs AS carb_g,
  fat AS fat_g,
  0 AS sugars_g,
  fiber AS fiber_g,
  0 AS sat_fat_g,
  salt AS salt_g
FROM public.foods;
