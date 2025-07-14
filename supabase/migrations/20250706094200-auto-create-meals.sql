-- Automatically create standard meals when a nutrition plan is activated

CREATE OR REPLACE FUNCTION public.create_default_meals()
RETURNS trigger AS $$
DECLARE
  meal_rec RECORD;
  ratio DOUBLE PRECISION;
  time_map JSONB := jsonb_build_object(
    'breakfast', '08:00',
    'lunch', '12:30',
    'dinner', '19:30',
    'snack', '16:00'
  );
BEGIN
  IF NEW.is_active = TRUE AND (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.is_active IS DISTINCT FROM NEW.is_active)) THEN
    -- Skip if meals already exist for this plan
    IF EXISTS (SELECT 1 FROM public.planned_meals WHERE plan_id = NEW.id) THEN
      RETURN NEW;
    END IF;

    FOR meal_rec IN
      SELECT id, type_key, display_name, sort_order FROM public.meal_types ORDER BY sort_order
    LOOP
      ratio := CASE meal_rec.type_key
        WHEN 'breakfast' THEN 0.25
        WHEN 'lunch' THEN 0.35
        WHEN 'dinner' THEN 0.30
        WHEN 'snack' THEN 0.10
        ELSE 0
      END;

      INSERT INTO public.planned_meals (plan_id, name, meal_time, meal_order, target_calories, meal_type_id)
      VALUES (
        NEW.id,
        meal_rec.display_name,
        CURRENT_DATE + (time_map ->> meal_rec.type_key)::time,
        meal_rec.sort_order,
        ROUND(NEW.target_calories * ratio),
        meal_rec.id
      );
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_create_default_meals ON public.nutrition_plans;
CREATE TRIGGER trg_create_default_meals
  AFTER INSERT OR UPDATE OF is_active ON public.nutrition_plans
  FOR EACH ROW EXECUTE FUNCTION public.create_default_meals();
