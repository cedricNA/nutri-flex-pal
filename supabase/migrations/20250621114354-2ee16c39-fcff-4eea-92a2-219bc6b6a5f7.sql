-- Add tracking fields to user_goals
ALTER TABLE public.user_goals
  ADD COLUMN start_date DATE,
  ADD COLUMN end_date DATE,
  ADD COLUMN tracking_type TEXT CHECK (tracking_type IN ('auto','manual')) DEFAULT 'manual',
  ADD COLUMN tracking_interval TEXT CHECK (tracking_interval IN ('jour','semaine','mois')),
  ADD COLUMN tracking_repetition INTEGER;
