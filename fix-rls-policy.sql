-- Fix RLS policy to allow all authenticated users to see all readings
-- Run this in Supabase SQL Editor

-- First, drop the existing policy if it exists
DROP POLICY IF EXISTS "Users can view all readings" ON readings;

-- Recreate the policy to allow all authenticated users to see all readings
CREATE POLICY "Users can view all readings"
  ON readings FOR SELECT
  TO authenticated
  USING (true);

-- Verify the policy exists
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'readings' AND policyname = 'Users can view all readings';
