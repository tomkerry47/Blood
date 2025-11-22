-- Fix RLS policies to allow all authenticated users to see all data
-- Run this in Supabase SQL Editor

-- Fix users table - allow all users to see each other
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can view all users" ON users;

CREATE POLICY "Users can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

-- Fix readings table - allow all users to see all readings
DROP POLICY IF EXISTS "Users can view all readings" ON readings;

CREATE POLICY "Users can view all readings"
  ON readings FOR SELECT
  TO authenticated
  USING (true);

-- Verify the policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('users', 'readings') 
  AND policyname IN ('Users can view all users', 'Users can view all readings')
ORDER BY tablename, policyname;
