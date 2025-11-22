-- Blood Pressure Tracker Database Schema
-- Run this in your Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blood pressure readings table
CREATE TABLE IF NOT EXISTS readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  systolic INTEGER NOT NULL CHECK (systolic > 0 AND systolic < 300),
  diastolic INTEGER NOT NULL CHECK (diastolic > 0 AND diastolic < 200),
  pulse INTEGER CHECK (pulse > 0 AND pulse < 250),
  notes TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS readings_user_id_idx ON readings(user_id);
CREATE INDEX IF NOT EXISTS readings_recorded_at_idx ON readings(recorded_at DESC);
CREATE INDEX IF NOT EXISTS readings_user_recorded_idx ON readings(user_id, recorded_at DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Users can read their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own data (for auto-creation on first login)
CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for readings table
-- Users can view all readings (since it's a shared app for 2 people)
CREATE POLICY "Users can view all readings"
  ON readings FOR SELECT
  TO authenticated
  USING (true);

-- Users can insert their own readings
CREATE POLICY "Users can insert own readings"
  ON readings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own readings
CREATE POLICY "Users can update own readings"
  ON readings FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own readings
CREATE POLICY "Users can delete own readings"
  ON readings FOR DELETE
  USING (auth.uid() = user_id);

-- Create a function to check if a reading exists for today
CREATE OR REPLACE FUNCTION has_reading_today(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM readings 
    WHERE user_id = user_uuid 
    AND recorded_at::DATE = CURRENT_DATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for latest readings per user
CREATE OR REPLACE VIEW latest_readings AS
SELECT DISTINCT ON (user_id)
  r.*,
  u.name as user_name,
  u.email as user_email
FROM readings r
JOIN users u ON r.user_id = u.id
ORDER BY user_id, recorded_at DESC;

-- Grant access to authenticated users
GRANT SELECT ON latest_readings TO authenticated;

-- Insert sample users (you'll replace these with actual auth users)
-- Note: These will be replaced when you set up Supabase Auth
-- For now, this is just for testing structure
