ALTER TABLE public.planned_meals
  ADD COLUMN meal_type_id UUID REFERENCES public.meal_types(id);

-- Update existing rows by matching meal name to meal type display name
UPDATE public.planned_meals pm
SET meal_type_id = mt.id
FROM public.meal_types mt
WHERE pm.name = mt.display_name;
