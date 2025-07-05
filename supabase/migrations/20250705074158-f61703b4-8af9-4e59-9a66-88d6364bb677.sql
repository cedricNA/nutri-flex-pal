-- Create activity_entries table
CREATE TABLE public.activity_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  calories_burned NUMERIC,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.activity_entries ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own activity entries" ON public.activity_entries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own activity entries" ON public.activity_entries
  FOR ALL USING (auth.uid() = user_id);
