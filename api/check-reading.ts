import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
      .select('id, recorded_at, user_id, users(name)')
      .order('recorded_at', { ascending: false })
      .limit(5);  // Get last 5 readings for debugging

    if (allError) {
      res.status(500).json({ error: allError.message });
      return;
    }

    // Check if the most recent reading is from today (any timezone)
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    
    let hasReadingToday = false;
    let lastReading = null;

    if (allData && allData.length > 0) {
      const mostRecent = allData[0];
      const readingDate = new Date(mostRecent.recorded_at);
      const readingDayStart = new Date(readingDate.getFullYear(), readingDate.getMonth(), readingDate.getDate(), 0, 0, 0, 0);
      
      // Check if same calendar day
      hasReadingToday = todayStart.getTime() === readingDayStart.getTime();
      
      if (hasReadingToday) {
        lastReading = {
          recorded_at: mostRecent.recorded_at,
          user_name: (mostRecent as any).users?.name || 'Unknown'
        };
      }
    }

    res.status(200).json({
      hasReadingToday,
      lastReading,
      checked_at: new Date().toISOString(),
      debug: {
        serverTime: now.toISOString(),
        todayStart: todayStart.toISOString(),
        recentReadings: allData?.map(r => ({
          recorded_at: r.recorded_at,
          isSameDay: hasReadingToday
        })) || []
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
