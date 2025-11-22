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

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Check if there's ANY reading for today (from any user)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('readings')
      .select('id, recorded_at, user_id, users(name)')
      .gte('recorded_at', today.toISOString())
      .order('recorded_at', { ascending: false })
      .limit(1);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    const hasReadingToday = data && data.length > 0;

    res.status(200).json({
      hasReadingToday,
      lastReading: hasReadingToday ? {
        recorded_at: data[0].recorded_at,
        user_name: (data[0] as any).users?.name || 'Unknown'
      } : null,
      checked_at: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
