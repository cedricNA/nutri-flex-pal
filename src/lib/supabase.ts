import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Hard-coded credentials generated during project setup. These are used as a
// fallback so the app can run even when no local `.env` file is provided.
const DEFAULT_URL = 'https://rbsvimtcuwcjlhquftvz.supabase.co'
const DEFAULT_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJic3ZpbXRjdXdjamxocXVmdHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NzE5NzYsImV4cCI6MjA2NTU0Nzk3Nn0.amgZDFQ_Vzs187w-d4MEHEp-u49p2TxHQ2hCRLu-65k'

const url = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables missing, falling back to default credentials.')
}

const supabase = createClient<Database>(url, key)

export default supabase
