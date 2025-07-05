-- Create sleep_entries table
CREATE TABLE public.sleep_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  hours_slept NUMERIC NOT NULL,
  quality_score NUMERIC,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.sleep_entries ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own sleep entries" ON public.sleep_entries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own sleep entries" ON public.sleep_entries
  FOR ALL USING (auth.uid() = user_id);
