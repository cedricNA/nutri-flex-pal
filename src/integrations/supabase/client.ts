
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = 'https://rbsvimtcuwcjlhquftvz.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJic3ZpbXRjdXdjamxocXVmdHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NzE5NzYsImV4cCI6MjA2NTU0Nzk3Nn0.amgZDFQ_Vzs187w-d4MEHEp-u49p2TxHQ2hCRLu-65k';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
