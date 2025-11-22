import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Try both with and without VITE_ prefix (Vercel vs local dev)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Get the most recent reading to check if it's from today
    const { data: allData, error: allError } = await supabase
      .from('readings')
      .select('recorded_at')
      .order('recorded_at', { ascending: false })
      .limit(1);

    if (allError) {
      res.status(500).json({ hasReadingToday: false });
      return;
    }

    // Check if the most recent reading is from today
    let hasReadingToday = false;

    if (allData && allData.length > 0) {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      
      const readingDate = new Date(allData[0].recorded_at);
      const readingDayStart = new Date(readingDate.getFullYear(), readingDate.getMonth(), readingDate.getDate(), 0, 0, 0, 0);
      
      // Check if same calendar day
      hasReadingToday = todayStart.getTime() === readingDayStart.getTime();
    }

    // Return proper JSON with boolean (no quotes around true/false)
    res.status(200).json({ hasReadingToday });
  } catch (error: any) {
    res.status(500).json({ hasReadingToday: false });
  }
}
