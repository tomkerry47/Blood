import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Reading {
  id: string;
  user_id: string;
  systolic: number;
  diastolic: number;
  pulse: number | null;
  notes: string | null;
  recorded_at: string;
  created_at: string;
}

export interface ReadingWithUser extends Reading {
  user_name: string;
  user_email: string;
}
