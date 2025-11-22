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
    // Check if there's ANY reading for today (from any user)
    // Use UTC to match database storage
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));

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
